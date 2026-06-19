"use client";

import { motion } from "framer-motion";
import type { Metric } from "@/lib/aura-engine";

export default function RadarChart({ metrics, size = 280 }: { metrics: Metric[]; size?: number }) {
  const center = size / 2;
  const radius = size * 0.36;
  const n = metrics.length;

  const points = metrics.map((m, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (m.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 26) * Math.cos(angle),
      labelY: center + (radius + 26) * Math.sin(angle),
      name: m.name,
      value: m.value,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="overflow-visible">
      {/* grid rings */}
      {rings.map((r, idx) => {
        const ringPoints = Array.from({ length: n }, (_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const rr = r * radius;
          return `${center + rr * Math.cos(angle)},${center + rr * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={idx}
            points={ringPoints}
            fill="none"
            stroke="rgba(255,107,0,0.15)"
            strokeWidth={1}
          />
        );
      })}

      {/* axis lines */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={center + radius * Math.cos((Math.PI * 2 * i) / n - Math.PI / 2)}
          y2={center + radius * Math.sin((Math.PI * 2 * i) / n - Math.PI / 2)}
          stroke="rgba(255,107,0,0.12)"
          strokeWidth={1}
        />
      ))}

      {/* data polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        points={polygonPoints}
        fill="rgba(255,107,0,0.28)"
        stroke="#FF6B00"
        strokeWidth={2}
        style={{ transformOrigin: `${center}px ${center}px`, filter: "drop-shadow(0 0 10px rgba(255,107,0,0.5))" }}
      />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#FFC857" />
      ))}

      {/* labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.028}
          fontFamily="var(--font-mono)"
          fill="rgba(255,255,255,0.55)"
        >
          {p.name.length > 14 ? p.name.split(" ")[0] : p.name}
        </text>
      ))}
    </svg>
  );
}
