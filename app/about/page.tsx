"use client";

import { motion } from "framer-motion";
import { Crown, Instagram, Clapperboard, Flame } from "lucide-react";
import ScannerFrame from "@/components/ScannerFrame";

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase text-glow flex items-center justify-center gap-3">
          <Crown className="w-8 h-8 text-ember" aria-hidden="true" /> About The Creator
        </h1>
        <p className="mt-3 font-mono text-xs sm:text-sm tracking-widest text-white/50 uppercase">
          The Human Behind Aura Inspector
        </p>
      </motion.div>

      {/* Creator card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <ScannerFrame className="rounded-2xl glass-panel p-6 sm:p-10 mb-8 text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-flame to-firered flex items-center justify-center text-3xl glow-flame mb-5"
            aria-hidden="true"
          >
            👑
          </div>
          <p className="font-display font-bold text-2xl sm:text-3xl text-ember uppercase tracking-wide">
            Shobith Lark
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-white/60 text-sm">
            <Clapperboard className="w-4 h-4 text-flame" aria-hidden="true" />
            <span>Post-Production Professional</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1 text-white/60 text-sm">
            <Flame className="w-4 h-4 text-flame" aria-hidden="true" />
            <span>Founder of Aura Inspector</span>
          </div>
          <p className="mt-5 font-mono text-xs text-flame/80 italic">
            &ldquo;Inspecting aura since 2026.&rdquo;
          </p>
        </ScannerFrame>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="rounded-2xl glass-panel p-6 sm:p-10 mb-8"
      >
        <p className="text-base sm:text-lg leading-relaxed text-white/85">
          Hi, I&rsquo;m Shobith.
        </p>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
          I work in post-production for film and entertainment content.
        </p>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
          I created Aura Inspector purely for fun — a side project to bring some humor to the
          internet and let people discover their completely unscientific aura score.
        </p>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
          This website exists because I thought it would be funny to let a futuristic government
          agency inspect people&rsquo;s vibes. Turns out, it&rsquo;s very funny.
        </p>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
          Thanks for visiting. I hope you enjoy it — and share your results.
        </p>
      </motion.div>

      {/* Instagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl glass-panel p-6 sm:p-8 text-center mb-4"
      >
        <p className="font-display uppercase tracking-widest text-sm text-white/70 mb-5">
          Follow The Creator
        </p>
        <a
          href="https://www.instagram.com/shobith_lark?igsh=MXZqdXhjYjR3cjFlZg=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Shobith Lark on Instagram"
        >
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-firered to-flame font-display font-semibold text-sm sm:text-base text-black"
          >
            <Instagram className="w-4 h-4" aria-hidden="true" /> @shobith_lark
          </motion.span>
        </a>
        <p className="mt-4 font-mono text-xs text-white/30 tracking-widest uppercase">
          instagram.com/shobith_lark
        </p>
      </motion.div>
    </div>
  );
}
