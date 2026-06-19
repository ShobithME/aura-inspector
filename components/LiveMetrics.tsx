"use client";

import { motion } from "framer-motion";

const LIVE_METRICS = [
  "Confidence Index",
  "Aura Density",
  "Plot Armor",
  "Vibe Stability",
  "Menace Level",
  "Rizz Frequency",
  "Drip Level",
  "Nonchalant Energy",
];

export default function LiveMetrics({ progress }: { progress: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6">
      {LIVE_METRICS.map((name, i) => {
        // Stagger each metric's growth and add jitter so they don't move in lockstep
        const seed = (i * 37) % 17;
        const target = Math.min(99, Math.max(4, progress + seed - 8));
        return (
          <div key={name} className="font-mono">
            <div className="flex justify-between text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50 mb-1">
              <span>{name}</span>
              <span className="text-ember">{target}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-firered via-flame to-ember rounded-full"
                animate={{ width: `${target}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
