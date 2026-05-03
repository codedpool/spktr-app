"use client";

const WORD = "spktr";

export default function IntroHero() {
  const chars = WORD.split("");

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% 60%, rgba(0,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      <div aria-hidden className="layer-grain" />
      <div aria-hidden className="layer-scanlines" />

      <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
        <div
          className="eyebrow flex items-center gap-2 text-white/55 fade-up"
          style={{ "--reveal-delay": "100ms" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "#00FFFF",
              boxShadow: "0 0 8px #00FFFF",
            }}
          />
          SPKTR · SURFACE 3
        </div>
      </div>

      <div className="absolute right-6 top-6 z-10 md:right-10 md:top-10">
        <div
          className="meta text-white/45 fade-up"
          style={{ "--reveal-delay": "180ms" }}
        >
          v.01 — 2026
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="eyebrow mb-10 text-white/45 fade-up"
          style={{ "--reveal-delay": "120ms" }}
        >
          PROACTIVE CONTEXT — LOCAL FIRST
        </div>

        <div
          className="flex items-center justify-center"
          style={{ gap: "clamp(8px, 1.4vw, 22px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/glyphspktr.png"
            alt=""
            width={500}
            height={500}
            loading="eager"
            decoding="sync"
            draggable="false"
            aria-hidden="true"
            className="fade-up block shrink-0 select-none"
            style={{
              height: "clamp(120px, 22vw, 360px)",
              width: "auto",
              marginTop: "clamp(6px, 1.1vw, 18px)",
              "--reveal-delay": "240ms",
            }}
          />

          <h1
            className="headline-display select-none lowercase text-white"
            style={{
              fontSize: "clamp(120px, 22vw, 360px)",
              lineHeight: 0.85,
            }}
          >
            <span className="mask-line">
              {chars.map((c, i) => (
                <span
                  key={i}
                  className="char-reveal"
                  style={{ "--reveal-delay": `${320 + i * 80}ms` }}
                  aria-hidden="true"
                >
                  {c}
                </span>
              ))}
            </span>
            <span className="sr-only">{WORD}</span>
          </h1>
        </div>

        <div
          className="mt-12 max-w-md fade-up"
          style={{ "--reveal-delay": "880ms" }}
        >
          <p className="tracking-tightest text-base font-light leading-[1.5] text-white/65 md:text-lg">
            The proactive context engine for Surface&nbsp;3.
            <br />
            Local. Live. Always one step ahead.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center">
        <div
          className="fade-up flex flex-col items-center gap-3"
          style={{ "--reveal-delay": "1280ms" }}
        >
          <span className="meta text-white/45">SCROLL TO ENGAGE</span>
          <span
            className="block h-9 w-px hint-down"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #00FFFF, transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
