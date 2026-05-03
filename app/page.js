"use client";

import { motion } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import IntroHero from "@/components/IntroHero";
import MagneticButton from "@/components/MagneticButton";
import SpktrCanvas from "@/components/SpktrCanvas";

const HEADLINE = "STAY AHEAD";

export default function Page() {
  return (
    <main className="relative bg-[#050505] text-white">
      <CustomCursor />

      <IntroHero />

      <SpktrCanvas />

      <section className="relative flex h-screen flex-col overflow-hidden bg-[#050505]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.35) 50%, transparent 100%)",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(0,255,255,0.06) 0%, rgba(0,0,0,0) 65%)",
          }}
        />

        <div aria-hidden className="layer-grain" />
        <div aria-hidden className="layer-scanlines" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-8 text-center md:px-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-5 flex items-center gap-2"
            style={{ color: "#00FFFF" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#00FFFF",
                boxShadow: "0 0 8px #00FFFF",
              }}
            />
            PHASE 04 — LIVE
          </motion.div>

          <motion.h2
            className="headline-display glow-cyan select-none"
            aria-label={HEADLINE}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            style={{ fontSize: "clamp(56px, 11vw, 152px)" }}
          >
            <span className="mask-line">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "112%" },
                  visible: { y: "0%" },
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.05,
                }}
                aria-hidden
              >
                {HEADLINE}
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5,
            }}
            className="tracking-tightest mt-6 max-w-md text-base font-light leading-[1.45] text-white/65 md:text-lg"
          >
            Your digital twin is live. Surface&nbsp;3 watches every pixel and
            surfaces context the moment you need it — without ever leaving your
            machine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.7,
            }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <MagneticButton
              className="font-mono rounded-full px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.32em]"
              style={{
                backgroundColor: "#00FFFF",
                color: "#050505",
                boxShadow: "0 0 36px rgba(0,255,255,0.35)",
              }}
            >
              Request Access
            </MagneticButton>
            <MagneticButton
              className="font-mono rounded-full border border-white/15 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/85"
              style={{ backgroundColor: "transparent" }}
            >
              Read the Brief
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.85,
            }}
            className="mt-10 flex w-full max-w-4xl flex-wrap items-stretch justify-center gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10"
          >
            <FeatureCell
              tag="01"
              title="LOCAL-FIRST"
              copy="No cloud round-trips. Every pixel on your device."
            />
            <FeatureCell
              tag="02"
              title="PROACTIVE"
              copy="Surfaces context before you ask for it."
            />
            <FeatureCell
              tag="03"
              title="PERSISTENT"
              copy="One twin, stitched across every session."
            />
          </motion.div>
        </div>

        <footer className="relative shrink-0 border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 md:flex-row md:px-10">
            <div className="meta flex items-center gap-2 text-white/45">
              <span
                className="inline-block h-1 w-1 rounded-full"
                style={{ backgroundColor: "#00FFFF" }}
              />
              SPKTR · SURFACE 3
            </div>
            <div className="meta text-white/40">
              ALL SYSTEMS LIVE — © 2026
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

function FeatureCell({ tag, title, copy }) {
  return (
    <div className="min-w-0 flex-1 basis-full bg-[#050505] p-5 text-left sm:basis-0 md:p-6">
      <div className="meta text-[11px]" style={{ color: "#00FFFF" }}>
        {tag}
      </div>
      <div className="font-mono mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-white">
        {title}
      </div>
      <p className="tracking-tightest mt-2 text-[12.5px] leading-[1.5] text-white/55">
        {copy}
      </p>
    </div>
  );
}
