"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera as CameraIcon,
  AlertTriangle,
  Download,
  Share2,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import html2canvas from "html2canvas";

import ScannerOverlay from "@/components/ScannerOverlay";
import LiveMetrics from "@/components/LiveMetrics";
import RadarChart from "@/components/RadarChart";
import Certificate from "@/components/Certificate";
import RareEventOverlay from "@/components/RareEventOverlay";
import ScannerFrame from "@/components/ScannerFrame";
import {
  generateReport,
  decodeReport,
  encodeReport,
  SCAN_MESSAGES,
  type InspectionReport,
} from "@/lib/aura-engine";

type Stage = "idle" | "camera" | "scanning" | "results";
type CameraState = "idle" | "loading" | "ready" | "error";

type CameraStep =
  | "idle"
  | "requesting"
  | "permission_granted"
  | "stream_received"
  | "video_attached"
  | "metadata_loaded"
  | "playback_started"
  | "ready";

const SCAN_DURATION_MS = 10000;
const CAMERA_TIMEOUT_MS = 10000;

// --- Sound helpers (no external deps) ---
let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  return audioCtx;
}
function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  vol = 0.15
) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      freq * 0.5,
      ctx.currentTime + duration
    );
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio unavailable
  }
}
function playScanBeep(soundEnabled: boolean) {
  if (!soundEnabled) return;
  playTone(880, 0.08, "square", 0.08);
  setTimeout(() => playTone(1100, 0.06, "square", 0.06), 100);
}
function playScanComplete(soundEnabled: boolean) {
  if (!soundEnabled) return;
  playTone(440, 0.1, "sine", 0.2);
  setTimeout(() => playTone(660, 0.1, "sine", 0.2), 120);
  setTimeout(() => playTone(880, 0.3, "sine", 0.2), 240);
}
function playRareSound(soundEnabled: boolean) {
  if (!soundEnabled) return;
  [200, 300, 500, 800, 1200].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.4, "sawtooth", 0.12), i * 100)
  );
}
function playDownloadSound(soundEnabled: boolean) {
  if (!soundEnabled) return;
  playTone(660, 0.15, "sine", 0.12);
  setTimeout(() => playTone(880, 0.2, "sine", 0.12), 160);
}

const STEP_LABELS: Record<CameraStep, string> = {
  idle: "Idle",
  requesting: "Requesting Permission…",
  permission_granted: "Camera Permission Granted",
  stream_received: "Camera Stream Received",
  video_attached: "Video Attached",
  metadata_loaded: "Video Metadata Loaded",
  playback_started: "Video Playback Started",
  ready: "Camera Ready",
};

export default function InspectPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraStep, setCameraStep] = useState<CameraStep>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [showRareEvent, setShowRareEvent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown");
  const [streamStatus, setStreamStatus] = useState<string>("none");
  const [videoStatus, setVideoStatus] = useState<string>("none");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const cameraTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attachRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether stream attachment has been attempted for this session
  const streamAttachedRef = useRef(false);
  // Tracks whether the camera has genuinely reached "ready" (used by the
  // timeout failsafe to avoid a stale-closure read of cameraState)
  const cameraReadyRef = useRef(false);

  // Load from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("r");
    if (encoded) {
      const decoded = decodeReport(encoded);
      if (decoded) {
        setReport(decoded);
        setStage("results");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }
    if (attachRetryRef.current) {
      clearTimeout(attachRetryRef.current);
      attachRetryRef.current = null;
    }
    streamAttachedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Attach stream to video once both stage=camera and videoRef are available.
  // Mirrors the working Test Camera implementation: attach srcObject, call
  // play(), and treat a successful (or failed-but-autoplaying) play() as the
  // ready signal. No waiting on loadedmetadata/playing events.
  //
  // IMPORTANT: AnimatePresence mode="wait" delays mounting the camera view
  // (and therefore the <video> element) until the previous ("idle") view
  // finishes its exit animation. That means videoRef.current can still be
  // null on the render where `stage` first becomes "camera" — and since
  // this effect only depended on [stage], it would bail out once and never
  // get a second chance, leaving the stream attached to nothing (hence the
  // black feed). Polling briefly after stage flips ensures we attach as
  // soon as the element actually exists.
  useEffect(() => {
    if (stage !== "camera" || streamAttachedRef.current) return;

    let cancelled = false;

    const tryAttach = () => {
      if (cancelled || streamAttachedRef.current) return;
      if (!streamRef.current || !videoRef.current) {
        // Video element or stream not ready yet (AnimatePresence exit
        // animation still in progress) — check again shortly.
        attachRetryRef.current = setTimeout(tryAttach, 50);
        return;
      }

      streamAttachedRef.current = true;
      const video = videoRef.current;
      const stream = streamRef.current;

      console.log("[SCANNER] Stream Attached");
      setCameraStep("video_attached");
      setVideoStatus("attaching");
      video.srcObject = stream;

      console.log("[SCANNER] Calling play()", {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });

      video
        .play()
        .then(() => {
          console.log("[SCANNER] Playback Started", {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
          });
          cameraReadyRef.current = true;
          setCameraStep("playback_started");
          setVideoStatus("playing");
          setCameraState("ready");
          setCameraStep("ready");
          console.log("[SCANNER] Scanner Ready");
          if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
          }
        })
        .catch((err) => {
          // Same failsafe as the Test Camera: don't block the user if
          // play() rejects (e.g. autoplay quirks) — the video element's
          // autoPlay attribute will typically still render the feed.
          console.log("[SCANNER] play() rejected", err);
          cameraReadyRef.current = true;
          setVideoStatus("playing (autoplay fallback)");
          setCameraState("ready");
          setCameraStep("ready");
          console.log("[SCANNER] Scanner Ready (via autoplay fallback)");
          if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
          }
        });
    };

    tryAttach();

    return () => {
      cancelled = true;
      if (attachRetryRef.current) {
        clearTimeout(attachRetryRef.current);
        attachRetryRef.current = null;
      }
    };
  }, [stage]);

  async function startInspection() {
    setCameraError(null);
    setCameraState("loading");
    setCameraStep("requesting");
    streamAttachedRef.current = false;
    setPermissionStatus("requesting");
    setStreamStatus("none");
    setVideoStatus("none");

    console.log("[SCANNER] Requesting Camera");

    if (!navigator.mediaDevices?.getUserMedia) {
      const msg =
        "Camera API is not supported in this browser. Please try Chrome, Firefox, or Safari.";
      console.log("[SCANNER] Error", msg);
      setCameraError(msg);
      setCameraState("error");
      setPermissionStatus("unsupported");
      return;
    }

    // Failsafe timeout: if initialization somehow never resolves, fall back
    // to the same camera approach as the Test Camera rather than leaving
    // the user stuck on an endless loading state. Uses a ref (not the
    // cameraState closure variable, which would be stale here) so this only
    // fires if attachment genuinely never completed.
    cameraReadyRef.current = false;
    cameraTimeoutRef.current = setTimeout(() => {
      if (!cameraReadyRef.current) {
        console.log("[SCANNER] Error", "timed out, falling back to raw feed");
        setCameraError(null);
        setCameraState("ready");
        setCameraStep("ready");
      }
    }, CAMERA_TIMEOUT_MS);

    try {
      // Same exact getUserMedia call as the working Test Camera.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log("[SCANNER] Permission Granted");
      setCameraStep("permission_granted");
      setPermissionStatus("granted");

      console.log("[SCANNER] Stream Received");
      streamRef.current = stream;
      setCameraStep("stream_received");
      setStreamStatus(`active (${stream.getVideoTracks().length} video track(s))`);

      // Set stage to camera — the useEffect above will attach the stream
      // once videoRef mounts, then mark ready as soon as play() resolves.
      setStage("camera");
      setCameraState("loading");
    } catch (err: unknown) {
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
        cameraTimeoutRef.current = null;
      }
      const error = err as { name?: string; message?: string };
      let msg = "Camera access failed. Please check your browser permissions and try again.";
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        msg = "Camera access was denied. Please allow camera permissions in your browser settings and try again.";
        setPermissionStatus("denied");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        msg = "No camera found. Please connect a camera and try again.";
        setPermissionStatus("no device");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        msg = "Camera is in use by another application. Please close other apps and try again.";
        setPermissionStatus("in use");
      } else {
        setPermissionStatus("error");
      }
      console.log("[SCANNER] Error", msg, error.message);
      setCameraError(msg);
      setCameraState("error");
      setCameraStep("idle");
    }
  }

  function beginScan() {
    if (soundEnabled) playScanBeep(soundEnabled);
    setStage("scanning");
    setProgress(0);
    setMessageIndex(0);

    const start = Date.now();
    let beepCount = 0;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / SCAN_DURATION_MS) * 100);
      setProgress(pct);
      setMessageIndex(
        Math.min(
          SCAN_MESSAGES.length - 1,
          Math.floor((pct / 100) * SCAN_MESSAGES.length)
        )
      );

      if (soundEnabled && Math.floor(pct / 10) > beepCount) {
        beepCount = Math.floor(pct / 10);
        playTone(440 + beepCount * 40, 0.05, "square", 0.05);
      }

      if (pct >= 100) {
        clearInterval(interval);
        stopCamera();
        const r = generateReport();
        setReport(r);
        setStage("results");
        playScanComplete(soundEnabled);
        if (r.rareEvent !== "none") {
          setTimeout(() => {
            setShowRareEvent(true);
            playRareSound(soundEnabled);
          }, 400);
        }
        const encoded = encodeReport(r);
        const url = new URL(window.location.href);
        url.searchParams.set("r", encoded);
        window.history.replaceState({}, "", url.toString());
      }
    }, 80);
  }

  function reset() {
    setStage("idle");
    setCameraState("idle");
    setCameraStep("idle");
    setReport(null);
    setProgress(0);
    setShowRareEvent(false);
    setCameraError(null);
    setPermissionStatus("unknown");
    setStreamStatus("none");
    setVideoStatus("none");
    streamAttachedRef.current = false;
    const url = new URL(window.location.href);
    url.searchParams.delete("r");
    window.history.replaceState({}, "", url.toString());
  }

  async function downloadCertificate() {
    if (!certRef.current) return;
    setDownloading(true);
    playDownloadSound(soundEnabled);
    try {
      // Ensure web fonts (incl. the handwritten signature font) are fully
      // loaded before rasterizing — otherwise html2canvas can capture a
      // fallback font on the first render.
      if (typeof document !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: "#0a0503",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `aura-inspection-${report?.caseId ?? "report"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // certificate generation failed silently
    } finally {
      setDownloading(false);
    }
  }

  async function shareResult() {
    if (!report) return;
    const shareUrl = window.location.href;
    const text = `🔥 I scored ${report.score} Aura on Aura Inspector.\nRank: ${report.rank.emoji} ${report.rank.label.toUpperCase()}\n"${report.verdict}"\nCan your aura beat mine?`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: "🔥 Aura Inspection Report", url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      await copyLink();
    }
  }

  async function copyLink() {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Top controls row */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setSoundEnabled((v) => !v)}
          aria-label={soundEnabled ? "Disable sounds" : "Enable sounds"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-ember transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* IDLE */}
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center pt-6"
          >
            <h1 className="font-display font-bold text-3xl sm:text-4xl uppercase text-glow mb-3">
              Aura Inspection Terminal
            </h1>
            <p className="text-white/60 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Position your face within frame. The bureau&rsquo;s scanner will begin analysis
              immediately upon camera access.
            </p>

            {cameraError && (
              <div className="flex items-start gap-3 text-left rounded-xl glass-panel p-4 mb-6 border-firered/40">
                <AlertTriangle className="w-5 h-5 text-firered shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-white/80">{cameraError}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={startInspection}
              aria-label="Authorize camera access to begin aura inspection"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-firered via-flame to-ember font-display font-bold uppercase tracking-wider text-black animate-pulseGlow"
            >
              <CameraIcon className="w-5 h-5" aria-hidden="true" />
              Authorize Camera Access
            </motion.button>
          </motion.div>
        )}

        {/* CAMERA / SCANNING */}
        {(stage === "camera" || stage === "scanning") && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-2"
          >
            {/* Status step message */}
            {stage === "camera" && cameraState === "loading" && cameraStep !== "idle" && (
              <p className="font-mono text-[10px] text-flame/80 text-center uppercase tracking-widest mb-2">
                {STEP_LABELS[cameraStep]}
              </p>
            )}

            <div className="relative w-full aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden glow-flame border border-flame/30 bg-black">
              {cameraState === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-flame animate-spin" />
                    <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                      {STEP_LABELS[cameraStep] || "Initializing Camera…"}
                    </p>
                  </div>
                </div>
              )}

              {cameraState === "error" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <AlertTriangle className="w-8 h-8 text-firered" />
                    <p className="font-mono text-xs text-firered uppercase tracking-widest">
                      Camera Initialization Failed
                    </p>
                    <p className="font-mono text-[10px] text-white/50 mt-1">{cameraError}</p>
                    <button
                      onClick={reset}
                      className="mt-2 px-4 py-2 rounded-full glass-panel font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-ember transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Camera feed for aura inspection"
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                style={{
                  opacity: cameraState === "ready" ? 1 : 0,
                  transition: "opacity 0.4s",
                  display: "block",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
              <ScannerOverlay scanning={stage === "scanning"} />

              {stage === "scanning" && (
                <div className="scanline-overlay">
                  <div className="scanline-bar" />
                </div>
              )}
            </div>

            {stage === "camera" && cameraState === "ready" && (
              <div className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={beginScan}
                  aria-label="Begin aura scan"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-firered via-flame to-ember font-display font-bold uppercase tracking-wider text-black animate-pulseGlow"
                >
                  Begin Scan
                </motion.button>
              </div>
            )}

            {stage === "camera" && cameraState === "loading" && (
              <div className="text-center mt-6">
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Connecting to camera…
                </p>
              </div>
            )}

            {stage === "scanning" && (
              <div className="mt-6">
                <p className="font-mono text-xs sm:text-sm text-ember text-center uppercase tracking-wider min-h-[1.5em]">
                  {SCAN_MESSAGES[messageIndex]}
                </p>
                <div
                  className="h-2 rounded-full bg-white/10 overflow-hidden mt-3"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Scan progress"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-firered via-flame to-ember"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center font-mono text-[10px] text-white/40 mt-1">
                  {Math.round(progress)}%
                </p>
                <LiveMetrics progress={progress} />
              </div>
            )}
          </motion.div>
        )}

        {/* RESULTS */}
        {stage === "results" && report && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-2"
          >
            <h1 className="text-center font-display font-bold text-2xl sm:text-3xl uppercase text-glow mb-1">
              🔥 Aura Inspection Report 🔥
            </h1>
            <p className="text-center font-mono text-[10px] sm:text-xs text-white/40 tracking-widest mb-6">
              CASE {report.caseId}
            </p>

            <ScannerFrame className="rounded-2xl glass-panel p-6 sm:p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Aura Score</p>
              <p className="font-display font-bold text-6xl sm:text-7xl text-ember text-glow">
                {report.score}
              </p>
              <p className="font-display font-semibold text-lg sm:text-xl text-white mt-2 uppercase">
                {report.rank.emoji} {report.rank.label}
              </p>
              <p className="font-mono text-xs text-flame/80 mt-1 uppercase tracking-wide">
                Status:{" "}
                {report.score >= 700
                  ? "Aura Confirmed"
                  : report.score >= 300
                  ? "Under Review"
                  : "Aura Insufficient"}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {report.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] sm:text-xs px-3 py-1 rounded-full border border-flame/40 bg-flame/10 text-flame uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-6 font-display italic text-base sm:text-lg text-white/85">
                &ldquo;{report.verdict}&rdquo;
              </p>
            </ScannerFrame>

            <div className="rounded-2xl glass-panel p-6 sm:p-8 mt-6">
              <p className="text-center font-mono text-xs uppercase tracking-widest text-white/50 mb-2">
                Metric Breakdown
              </p>
              <div className="w-full max-w-xs mx-auto">
                <RadarChart metrics={report.metrics} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {report.metrics.map((m) => (
                  <div key={m.name} className="font-mono text-[10px] sm:text-xs">
                    <div className="flex justify-between text-white/50 uppercase tracking-wide mb-1">
                      <span>{m.name}</span>
                      <span className="text-ember">{m.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-firered to-flame rounded-full"
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <ActionButton
                onClick={downloadCertificate}
                icon={<Download className="w-4 h-4" aria-hidden="true" />}
                disabled={downloading}
                aria-label="Download aura certificate"
              >
                {downloading ? "Rendering…" : "Download Certificate"}
              </ActionButton>
              <ActionButton
                onClick={shareResult}
                icon={<Share2 className="w-4 h-4" aria-hidden="true" />}
                aria-label="Share your aura result"
              >
                Share Result
              </ActionButton>
              <ActionButton
                onClick={copyLink}
                icon={
                  copied ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <LinkIcon className="w-4 h-4" aria-hidden="true" />
                  )
                }
                aria-label="Copy shareable link"
              >
                {copied ? "Link Copied!" : "Copy Link"}
              </ActionButton>
              <ActionButton
                onClick={reset}
                icon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
                aria-label="Inspect again"
              >
                Inspect Again
              </ActionButton>
            </div>

            {/* Off-screen certificate render target */}
            <div className="fixed -left-[9999px] top-0" aria-hidden="true">
              <Certificate ref={certRef} report={report} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {report && (
        <RareEventOverlay
          event={showRareEvent ? report.rareEvent : "none"}
          onDone={() => setShowRareEvent(false)}
        />
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  icon,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-panel font-display text-xs sm:text-sm uppercase tracking-wide text-white/85 hover:text-flame hover:border-flame/50 transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}
