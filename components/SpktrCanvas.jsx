"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const FRAME_COUNT = 224;

const framePath = (i) =>
  `/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.webp`;

const SHATTER_PEAK = 0.48;
const SNAP_PEAK = 0.82;
const IMPACT_HALF = 0.025;

function shakeAt(v, peak, amp, freq) {
  const d = Math.abs(v - peak);
  if (d > IMPACT_HALF) return 0;
  const fall = 1 - d / IMPACT_HALF;
  return Math.sin(v * freq) * amp * fall * fall;
}

export default function SpktrCanvas() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef(0);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // Non-linear frame mapping with three plateaus at the key poses.
  // Phase 01 (assembled): 0.00 → 0.20  → frames 0 → 32
  // Plateau (mid-shatter pose):    → frame ~36 (held briefly)
  // Phase 02 (decompression):       → frames 36 → 108
  // Plateau (peak shatter):                 → frame ~118 (held briefly)
  // Phase 03 (re-assembly):                 → frames 118 → 198
  // Plateau (lockup):                                  → frame ~205 (held briefly)
  // Phase 04 (settle):                                 → frames 205 → 223
  const frameProgress = useTransform(
    smooth,
    [0.0, 0.18, 0.22, 0.46, 0.52, 0.78, 0.85, 1.0],
    [0, 32, 36, 108, 118, 198, 205, 223]
  );

  const beatA = useTransform(
    smooth,
    [0.0, 0.04, 0.16, 0.22],
    [1, 1, 1, 0]
  );
  const beatALine1 = useTransform(smooth, [0.0, 0.05], ["110%", "0%"]);
  const beatALine2 = useTransform(smooth, [0.02, 0.07], ["110%", "0%"]);
  const beatALine3 = useTransform(smooth, [0.04, 0.1], ["110%", "0%"]);

  const beatB = useTransform(
    smooth,
    [0.22, 0.27, 0.46, 0.52],
    [0, 1, 1, 0]
  );
  const beatBLine1 = useTransform(smooth, [0.22, 0.27], ["110%", "0%"]);
  const beatBLine2 = useTransform(smooth, [0.24, 0.3], ["110%", "0%"]);
  const beatBLine3 = useTransform(smooth, [0.26, 0.33], ["110%", "0%"]);

  const beatC = useTransform(
    smooth,
    [0.52, 0.57, 0.78, 0.84],
    [0, 1, 1, 0]
  );
  const beatCLine1 = useTransform(smooth, [0.52, 0.57], ["110%", "0%"]);
  const beatCLine2 = useTransform(smooth, [0.54, 0.6], ["110%", "0%"]);
  const beatCLine3 = useTransform(smooth, [0.56, 0.63], ["110%", "0%"]);

  const phaseLabel = useTransform(smooth, (v) => {
    if (v < 0.22) return "01";
    if (v < 0.52) return "02";
    if (v < 0.85) return "03";
    return "04";
  });

  const railProgressWidth = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const scrollPct = useTransform(
    smooth,
    (v) => `${String(Math.round(v * 100)).padStart(2, "0")}%`
  );

  const flashOpacity = useTransform(smooth, (v) => {
    let o = 0;
    const ds = Math.abs(v - SHATTER_PEAK);
    const dn = Math.abs(v - SNAP_PEAK);
    if (ds < IMPACT_HALF) o += (1 - ds / IMPACT_HALF) * 0.18;
    if (dn < IMPACT_HALF) o += (1 - dn / IMPACT_HALF) * 0.16;
    return o;
  });

  const shakeX = useTransform(smooth, (v) => {
    return shakeAt(v, SHATTER_PEAK, 7, 900) + shakeAt(v, SNAP_PEAK, 9, 900);
  });
  const shakeY = useTransform(smooth, (v) => {
    return shakeAt(v, SHATTER_PEAK, 4, 720) + shakeAt(v, SNAP_PEAK, 6, 720);
  });

  const scale = useTransform(smooth, (v) => {
    const ds = Math.abs(v - SHATTER_PEAK);
    const dn = Math.abs(v - SNAP_PEAK);
    let s = 1;
    if (ds < IMPACT_HALF) s += (1 - ds / IMPACT_HALF) * 0.012;
    if (dn < IMPACT_HALF) s += (1 - dn / IMPACT_HALF) * 0.018;
    return s;
  });

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs = new Array(FRAME_COUNT);

    const tick = () => {
      count += 1;
      if (cancelled) return;
      if (count % 4 === 0 || count === FRAME_COUNT) setLoaded(count);
      if (count === FRAME_COUNT) setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      img.onload = tick;
      img.onerror = tick;
      imgs[i] = img;
    }

    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setRevealed(true), 450);
    return () => clearTimeout(t);
  }, [ready]);

  const drawFrame = (idx) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw, dh, dx, dy;
    if (ir > cr) {
      dw = w;
      dh = w / ir;
      dx = 0;
      dy = (h - dh) / 2;
    } else {
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";
      const idx = Math.max(0, currentFrameRef.current);
      drawFrame(idx);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!ready) return;
    currentFrameRef.current = 0;
    drawFrame(0);
  }, [ready]);

  useMotionValueEvent(frameProgress, "change", (v) => {
    if (!ready) return;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(v)));
    if (idx === currentFrameRef.current) return;
    currentFrameRef.current = idx;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(idx));
  });

  const progressPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
        initial={{ opacity: 1 }}
        animate={{ opacity: revealed ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: revealed ? "none" : "auto" }}
      >
        <div className="eyebrow mb-8 text-white/50">INITIALIZING SEQUENCE</div>
        <div className="relative h-px w-72 overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              backgroundColor: "#00FFFF",
              boxShadow: "0 0 12px #00FFFF",
            }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.18, ease: "linear" }}
          />
        </div>
        <div className="meta mt-5 flex items-center gap-3 text-white/40">
          <span style={{ color: "#00FFFF" }}>
            {String(loaded).padStart(3, "0")}
          </span>
          <span className="text-white/20">/</span>
          <span>{FRAME_COUNT}</span>
          <span className="text-white/20">FRAMES</span>
        </div>
        <div className="tracking-tightest mt-12 text-2xl font-semibold lowercase text-white/40">
          spktr
        </div>
      </motion.div>

      <section
        ref={wrapperRef}
        className="relative"
        style={{ height: "600vh" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
          <motion.div
            className="absolute inset-0"
            style={{ x: shakeX, y: shakeY, scale }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            />
          </motion.div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          <div aria-hidden className="layer-scanlines" />
          <div aria-hidden className="layer-grain" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{ backgroundColor: "#00FFFF", opacity: flashOpacity }}
          />

          {/* LEFT RAIL */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-[16vw] min-w-[148px] max-w-[260px] flex-col justify-between p-6 md:p-10">
            <div>
              <div className="eyebrow flex items-center gap-2 text-white/75">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: "#00FFFF",
                    boxShadow: "0 0 8px #00FFFF",
                  }}
                />
                SPKTR
              </div>
              <div className="meta mt-1.5 text-[9px] text-white/30">
                SURFACE 3
              </div>
            </div>

            <div className="relative h-36">
              <motion.div
                style={{ opacity: beatA }}
                className="absolute inset-0"
              >
                <div className="mask-line">
                  <motion.div
                    className="eyebrow"
                    style={{
                      color: "#00FFFF",
                      y: beatALine1,
                    }}
                  >
                    PHASE 01
                  </motion.div>
                </div>
                <div className="mask-line mt-3">
                  <motion.div
                    className="meta text-[9px] text-white/40"
                    style={{ y: beatALine2 }}
                  >
                    GUARDIAN
                  </motion.div>
                </div>
                <div className="mask-line mt-5">
                  <motion.div
                    className="tracking-tightest text-[15px] font-medium leading-[1.25] text-white/90"
                    style={{ y: beatALine3 }}
                  >
                    Proactive Context.
                    <br />
                    Local-First Intelligence.
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                style={{ opacity: beatC }}
                className="absolute inset-0"
              >
                <div className="mask-line">
                  <motion.div
                    className="eyebrow"
                    style={{
                      color: "#00FFFF",
                      y: beatCLine1,
                    }}
                  >
                    PHASE 03
                  </motion.div>
                </div>
                <div className="mask-line mt-3">
                  <motion.div
                    className="meta text-[9px] text-white/40"
                    style={{ y: beatCLine2 }}
                  >
                    RE-ASSEMBLY
                  </motion.div>
                </div>
                <div className="mask-line mt-5">
                  <motion.div
                    className="tracking-tightest text-[15px] font-medium leading-[1.25] text-white/90"
                    style={{ y: beatCLine3 }}
                  >
                    Surface 3 HUD.
                    <br />
                    Context Memory, mapped to your workflow.
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div>
              <div className="relative mb-3 h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 h-full"
                  style={{
                    width: railProgressWidth,
                    backgroundColor: "#00FFFF",
                  }}
                />
              </div>
              <div className="meta flex items-baseline justify-between text-white/45">
                <span>SCROLL</span>
                <motion.span style={{ color: "#00FFFF" }}>
                  {scrollPct}
                </motion.span>
              </div>
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-[16vw] min-w-[148px] max-w-[260px] flex-col justify-between p-6 text-right md:p-10">
            <div>
              <div className="meta text-white/55">v.01 — 2026</div>
              <div className="meta mt-1.5 text-[9px] text-white/25">
                LOCAL · LIVE
              </div>
            </div>

            <div className="relative h-36">
              <motion.div
                style={{ opacity: beatB }}
                className="absolute inset-0"
              >
                <div className="mask-line">
                  <motion.div
                    className="eyebrow"
                    style={{
                      color: "#00FFFF",
                      y: beatBLine1,
                    }}
                  >
                    PHASE 02
                  </motion.div>
                </div>
                <div className="mask-line mt-3">
                  <motion.div
                    className="meta text-[9px] text-white/40"
                    style={{ y: beatBLine2 }}
                  >
                    DECOMPRESSION
                  </motion.div>
                </div>
                <div className="mask-line mt-5">
                  <motion.div
                    className="tracking-tightest text-[15px] font-medium leading-[1.25] text-white/90"
                    style={{ y: beatBLine3 }}
                  >
                    Deconstructed.
                    <br />
                    Analyzing every screen pixel in real-time.
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div>
              <div
                className="font-mono text-[20px] font-medium tabular-nums tracking-[0.1em] text-white/85"
                style={{ fontFeatureSettings: '"zero", "ss02"' }}
              >
                <motion.span style={{ color: "#00FFFF" }}>
                  {phaseLabel}
                </motion.span>
                <span className="mx-1.5 text-white/20">/</span>
                <span className="text-white/45">04</span>
              </div>
              <div className="meta mt-2 text-[9px] text-white/30">PHASE</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

