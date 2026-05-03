"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({
  children,
  className,
  style,
  onClick,
  type = "button",
  radius = 110,
  strength = 0.4,
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 520, damping: 30, mass: 0.28 });
  const sy = useSpring(y, { stiffness: 520, damping: 30, mass: 0.28 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let active = false;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const r = radius + Math.max(rect.width, rect.height) / 2;
      const dist = Math.hypot(dx, dy);

      if (dist < r) {
        active = true;
        x.set(dx * strength);
        y.set(dy * strength);
      } else if (active) {
        active = false;
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [radius, strength, x, y]);

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      data-cursor="hover"
      className={className}
      style={{
        ...style,
        x: sx,
        y: sy,
        willChange: "transform",
      }}
    >
      {children}
    </motion.button>
  );
}
