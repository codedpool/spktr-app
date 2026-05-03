"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 700, damping: 38, mass: 0.35 });

  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(hover: hover) and (pointer: fine)");
    const set = () => setEnabled(m.matches);
    set();
    m.addEventListener?.("change", set);
    return () => m.removeEventListener?.("change", set);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e) => {
      const t = e.target?.closest?.("[data-cursor='hover']");
      setHover(Boolean(t));
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down, { passive: true });
    window.addEventListener("mouseup", up, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = hover ? 60 : 22;
  const dotSize = pressed ? 8 : hover ? 4 : 4;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
        animate={{
          width: ringSize,
          height: ringSize,
          borderColor: hover
            ? "rgba(0,255,255,0.95)"
            : "rgba(0,255,255,0.55)",
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{
          borderWidth: 1,
          boxShadow: hover ? "0 0 22px rgba(0,255,255,0.35)" : "none",
        }}
      />
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ width: dotSize, height: dotSize }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          backgroundColor: "#00FFFF",
          boxShadow: "0 0 8px rgba(0,255,255,0.6)",
        }}
      />
    </motion.div>
  );
}
