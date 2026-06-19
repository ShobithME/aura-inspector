"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScannerOverlay({ scanning }: { scanning: boolean }) {
  const [lensVal, setLensVal] = useState("00");

  useEffect(() => {
    if (!scanning) return;
    const iv = setInterval(() => {
      setLensVal(String(Math.floor(Math.random() * 9)).padStart(2, "0"));
    }, 600);
    return () => clearInterval(iv);
  }, [scanning]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <span className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-flame/80 rounded-tl-sm" />
      <span className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-flame/80 rounded-tr-sm" />
      <span className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-flame/80 rounded-bl-sm" />
      <span className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-flame/80 rounded-br-sm" />

      <motion.div
        animate={scanning ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[55%] aspect-square max-w-[280px]"
      >
        <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-ember" />
        <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-ember" />
        <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-ember" />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-ember" />
        <span className="absolute inset-0 border border-ember/30 rounded" />

        {scanning && (
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 origin-center"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,200,87,0.8) 0deg, transparent 60deg, transparent 360deg)",
              }}
            />
          </div>
        )}
      </motion.div>

      {scanning && (
        <motion.div
          initial={{ top: "10%" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-transparent via-ember to-transparent shadow-[0_0_16px_rgba(255,200,87,0.9)]"
        />
      )}

      <div className="absolute top-1/2 left-3 -translate-y-1/2 space-y-2 font-mono text-[9px] sm:text-[10px] text-flame/80 uppercase tracking-wider">
        <p>SIG: {scanning ? "ACQUIRING" : "STANDBY"}</p>
        <p>LNS: 0{lensVal}</p>
      </div>
      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-right space-y-2 font-mono text-[9px] sm:text-[10px] text-flame/80 uppercase tracking-wider">
        <p>AIB-CAM</p>
        <p>{scanning ? "REC ●" : "IDLE"}</p>
      </div>
    </div>
  );
}
