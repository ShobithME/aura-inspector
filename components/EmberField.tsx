"use client";

import { useState, useEffect } from "react";

type Ember = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export default function EmberField() {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="ember-field" aria-hidden="true">
      <div className="smoke-layer" />
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember-particle"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
      <div className="grain-texture absolute inset-0" />
    </div>
  );
}
