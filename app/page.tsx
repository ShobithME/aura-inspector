"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Camera, Trash2, ShieldCheck, Crown, Flame } from "lucide-react";
import ScannerFrame from "@/components/ScannerFrame";

export default function HomePage() {
  return (
    <div className="px-4 sm:px-6">
      <section className="max-w-4xl mx-auto text-center pt-8 sm:pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.3em] text-ember/80 uppercase mb-4">
            The Official Aura Inspection Bureau
          </p>

          <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl uppercase leading-[1.05] text-glow">
            <span className="text-flame">🔥 AURA</span>
            <br />
            <span className="text-white">INSPECTOR 🔥</span>
          </h1>

          <p className="mt-6 font-display uppercase tracking-widest text-xs sm:text-sm text-white/60">
            Official Aura Inspection Bureau
          </p>
          <p className="mt-3 font-mono text-sm sm:text-base text-flame/90 tracking-wide">
            MEASURING AURA. JUDGING VIBES. CERTIFYING LEGENDS.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex items-center justify-center gap-3 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/40"
        >
          <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-flame/60" />
          AURA INSPECTION AUTHORIZED · PROCEED WITH CAUTION
          <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-flame/60" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10"
        >
          <Link href="/inspect">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-firered via-flame to-ember font-display font-bold uppercase tracking-wider text-base sm:text-lg text-black animate-pulseGlow"
            >
              <Flame className="w-5 h-5" />
              Start Inspection
              <Flame className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Privacy notice card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="max-w-2xl mx-auto mt-8 mb-16"
      >
        <ScannerFrame className="rounded-2xl glass-panel p-6 sm:p-8">
          <p className="text-center font-mono text-[10px] sm:text-xs tracking-[0.3em] text-ember/70 uppercase mb-5">
            Aura Inspector Privacy Notice
          </p>

          <ul className="space-y-3 font-body text-sm sm:text-base text-white/85">
            <li className="flex items-start gap-3">
              <Lock className="w-4 h-4 mt-0.5 text-flame shrink-0" />
              All processing occurs locally on your device.
            </li>
            <li className="flex items-start gap-3">
              <Camera className="w-4 h-4 mt-0.5 text-flame shrink-0" />
              No photos are captured.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-flame shrink-0" />
              No images are uploaded.
            </li>
            <li className="flex items-start gap-3">
              <Trash2 className="w-4 h-4 mt-0.5 text-flame shrink-0" />
              No inspection data is stored.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-flame shrink-0" />
              No personal information is collected.
            </li>
          </ul>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">Approved By</p>
            <p className="flex items-center justify-center gap-2 font-display font-semibold text-sm sm:text-base text-ember">
              <Crown className="w-4 h-4" /> Shobith Lark
            </p>
            <p className="text-xs text-white/50 mt-1">Founder, Aura Inspector</p>
            <p className="mt-4 inline-block text-xs font-mono px-3 py-1 rounded-full bg-flame/10 border border-flame/30 text-flame">
              🔥 100% Approved By Aura Inspector
            </p>
          </div>
        </ScannerFrame>
      </motion.section>
    </div>
  );
}
