"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RareEvent } from "@/lib/aura-engine";

export default function RareEventOverlay({
  event,
  onDone,
}: {
  event: RareEvent;
  onDone: () => void;
}) {
  if (event === "none") return null;

  const isChosen = event === "chosen-one";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => {
          // auto-dismiss after a beat
          setTimeout(onDone, isChosen ? 2600 : 1800);
        }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      >
        {/* explosion glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: isChosen ? 3.2 : 2.2, opacity: 0 }}
          transition={{ duration: isChosen ? 1.8 : 1.2, ease: "easeOut" }}
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,200,87,1), rgba(255,107,0,0.6) 40%, transparent 70%)",
          }}
        />

        <div className="relative text-center px-6">
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
            className="text-5xl sm:text-7xl mb-4"
          >
            {isChosen ? "🔥🔥🔥" : "☠️"}
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="font-display font-bold uppercase text-3xl sm:text-5xl text-glow"
            style={{ color: isChosen ? "#FFC857" : "#FF6B00" }}
          >
            {isChosen ? "The Chosen One" : "Aura God Detected"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-3 font-mono text-xs sm:text-sm tracking-widest text-white/60 uppercase"
          >
            {isChosen ? "Bureau-wide alert issued" : "Extremely rare reading confirmed"}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
