"use client";

import { forwardRef } from "react";
import type { InspectionReport } from "@/lib/aura-engine";

type Props = { report: InspectionReport };

const Certificate = forwardRef<HTMLDivElement, Props>(function Certificate({ report }, ref) {
  const { score, rank, tags, verdict, caseId } = report;
  const date = new Date(report.timestamp);
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isLegendary = score >= 980;
  const isLow = score < 300;

  const bgColor = isLegendary
    ? "radial-gradient(ellipse 140% 80% at 50% -10%, rgba(255,200,87,0.28), transparent 50%), radial-gradient(ellipse 100% 60% at 90% 110%, rgba(255,107,0,0.22), transparent 55%), #0a0402"
    : isLow
    ? "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(180,30,20,0.2), transparent 55%), #080302"
    : "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255,107,0,0.18), transparent 55%), radial-gradient(ellipse 100% 60% at 90% 110%, rgba(255,45,32,0.14), transparent 55%), #0a0503";

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1350,
        background: bgColor,
        position: "relative",
        padding: 64,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#f5ede4",
        overflow: "hidden",
        border: `10px solid ${isLegendary ? "rgba(255,200,87,0.6)" : "rgba(255,107,0,0.35)"}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Burnt paper edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 5% 5%, rgba(0,0,0,0.7), transparent 25%), radial-gradient(circle at 95% 5%, rgba(0,0,0,0.6), transparent 25%), radial-gradient(circle at 5% 95%, rgba(0,0,0,0.65), transparent 25%), radial-gradient(circle at 95% 95%, rgba(0,0,0,0.6), transparent 25%), radial-gradient(circle at 50% 100%, rgba(80,20,5,0.35), transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Fire glow stripes */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 8,
          background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.8) 30%, rgba(255,200,87,0.9) 50%, rgba(255,107,0,0.8) 70%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 8,
          background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.8) 30%, rgba(255,200,87,0.9) 50%, rgba(255,107,0,0.8) 70%, transparent)",
        }}
      />

      {/* Main content (header, score, tags, verdict) */}
      <div style={{ flex: "0 0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: 13,
            letterSpacing: 6,
            color: "#FFC857",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ✦ Official Aura Inspection Bureau ✦
        </p>
        <h1
          style={{
            fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
            fontWeight: 700,
            fontSize: 54,
            textTransform: "uppercase",
            color: "#FF6B00",
            margin: "12px 0 6px",
            textShadow: "0 0 30px rgba(255,107,0,0.7), 0 0 80px rgba(255,45,32,0.3)",
            lineHeight: 1.1,
          }}
        >
          🔥 Aura Inspection Report 🔥
        </h1>
        <div
          style={{
            width: "100%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.6) 30%, rgba(255,200,87,0.8) 50%, rgba(255,107,0,0.6) 70%, transparent)",
            margin: "14px 0",
          }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 3,
          }}
        >
          CASE ID: {caseId} · {dateStr}
        </p>
        </div>

        {/* Score block */}
        <div style={{ textAlign: "center", marginTop: 40, position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            letterSpacing: 5,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          ━━ Aura Score ━━
        </p>
        <div style={{ height: 210, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
          <p
            style={{
              fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
              fontWeight: 700,
              fontSize: 170,
              lineHeight: 1,
              color: isLegendary ? "#FFC857" : "#FF8A3D",
              textShadow: isLegendary
                ? "0 0 28px rgba(255,200,87,0.85)"
                : "0 0 24px rgba(255,107,0,0.7)",
              margin: 0,
            }}
          >
            {score}
          </p>
        </div>
        <p
          style={{
            fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
            fontSize: 42,
            fontWeight: 700,
            color: "#fff",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(255,107,0,0.4)",
            marginTop: 8,
          }}
        >
          {rank.emoji} {rank.label}
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: "rgba(255,200,87,0.7)",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          {score >= 700
            ? "⬛ STATUS: AURA CONFIRMED ⬛"
            : score >= 300
            ? "▪ STATUS: UNDER REVIEW ▪"
            : "✕ STATUS: AURA INSUFFICIENT ✕"}
        </p>
        </div>

        {/* Divider */}
        <div
          style={{
            margin: "30px 0",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), transparent)",
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* Tags */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 15,
              padding: "8px 22px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,107,0,0.55)",
              background: "rgba(255,107,0,0.12)",
              color: "#FF8A3D",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {tag}
          </span>
        ))}
        </div>

        {/* Verdict */}
        <div style={{ textAlign: "center", marginTop: 34, position: "relative", zIndex: 1, padding: "0 40px" }}>
        <p
          style={{
            fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
            fontSize: 11,
            letterSpacing: 4,
            color: "rgba(255,200,87,0.5)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          ✦ Official Verdict ✦
        </p>
        <p
          style={{
            fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
            fontSize: 32,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.9)",
            maxWidth: 900,
            margin: "0 auto",
            lineHeight: 1.4,
            textShadow: "0 0 20px rgba(255,107,0,0.2)",
          }}
        >
          &ldquo;{verdict}&rdquo;
        </p>
        </div>
      </div>

      {/* Flexible spacer — absorbs leftover space so the footer never
          overlaps the content above, regardless of verdict length or tag
          count, and there's no dead empty gap either. */}
      <div style={{ flex: "1 1 auto", minHeight: 24 }} />

      {/* Bureau Stamp + Signature footer row */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), transparent)",
            marginBottom: 24,
          }}
        />
        <div style={{ position: "relative" }}>
          {/* Bureau Stamp */}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%) rotate(-18deg)",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "5px solid rgba(255,107,0,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,107,0,0.07)",
              boxShadow: "0 0 20px rgba(255,107,0,0.2) inset",
            }}
          >
            <p
              style={{
                fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
                fontSize: 14,
                textAlign: "center",
                color: "#FF6B00",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                lineHeight: 1.4,
              }}
            >
              🔥<br />INSPECTION<br />SEALED<br />AIB
            </p>
          </div>

          <div style={{ textAlign: "center", padding: "0 180px" }}>
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
                fontSize: 56,
                color: "#FFC857",
                textShadow: "0 0 14px rgba(255,200,87,0.4)",
                transform: "rotate(-3deg)",
                margin: "0 0 18px",
                lineHeight: 1,
              }}
            >
              Shobith Lark
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              ━━━━━━━━━━ Signed &amp; Approved By ━━━━━━━━━━
            </p>
            <p
              style={{
                fontFamily: "'Oswald', 'Arial Narrow', sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#FFC857",
                textShadow: "0 0 20px rgba(255,200,87,0.4)",
                marginBottom: 4,
                whiteSpace: "nowrap",
              }}
            >
              👑 AURA GOD — SHOBITH LARK
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Founder, Aura Inspector
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "rgba(255,107,0,0.6)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Official Aura Inspection Bureau · aurainspector.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
