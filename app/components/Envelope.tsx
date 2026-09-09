"use client";

import { motion } from "framer-motion";

export type Phase = "sealed" | "opening" | "open";

export function Envelope({
  phase,
  onOpen,
  onOpened,
}: {
  phase: Phase;
  onOpen: () => void;
  onOpened: () => void;
}) {
  const sealed = phase === "sealed";

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={!sealed}
      aria-label="Open the invitation"
      className="group relative flex select-none cursor-pointer flex-col items-center focus:outline-none"
      whileHover={sealed ? { y: -6 } : undefined}
      whileTap={sealed ? { scale: 0.985 } : undefined}
      animate={phase === "opening" ? { scale: 1.06, rotate: -1.5 } : { scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (phase === "opening") onOpened();
      }}
    >
      {/* ── letterhead ──────────────────────────────── */}
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-500">
        You're Invited!
      </p>
      <p className="mt-3 font-cormorant text-5xl italic leading-tight text-stone-800 md:text-6xl">
        Rachel <span className="font-normal">&amp;</span>
        <br />
        Cameron  
      </p>

      {/* ── the envelope ────────────────────────────── */}
      <div className="relative mt-8 aspect-[10/7] w-[min(430px,84vw)]">
        {/* z-0 · ground shadow */}
        <div className="absolute inset-x-8 bottom-0 z-0 h-8 translate-y-4 rounded-[50%] bg-stone-900/25 blur-xl" />

        {/* z-10 · back panel (only seen once the flap opens) */}
        <div className="absolute inset-0 z-10 rounded-[3px] bg-[#dcd8cf]" />

        {/* z-20 · the letter — hidden for now, slides out later */}
        <div className="absolute inset-x-6 top-8 bottom-6 z-20 rounded-[2px] bg-[#fdfcfa] shadow-sm" />

        {/* z-30 · front face (the visible body) */}
        <div className="absolute inset-0 z-30 rounded-[3px] bg-gradient-to-b from-[#eceae4] via-[#e7e4dd] to-[#dedad1] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" />

        {/* z-40 · flap */}
        <div
          className="absolute inset-x-0 top-0 z-40 h-[58%] bg-gradient-to-b from-[#e9e6df] to-[#e0dcd3] [filter:drop-shadow(0_3px_2px_rgba(60,55,45,0.18))]"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        >
          {/* subtle creases running from corners to tip */}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.55),transparent_38%),linear-gradient(245deg,rgba(120,110,95,0.12),transparent_38%)]" />
        </div>

        {/* z-50 · seal */}
        <div className="absolute top-[58%] left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="grid h-[4.75rem] w-[3.6rem] -rotate-4 place-items-center rounded-[50%] border border-stone-300/90 bg-[#f7f5f0] shadow-[0_2px_6px_rgba(60,55,45,0.25)]">
            <span className="font-script text-[1.35rem] leading-none text-stone-500">
              R&amp;C
            </span>
          </div>
        </div>

        {/* z-60 · florals — uncomment once PNGs are in /public/images
        <img src="/images/florals-left.png" alt="" draggable={false}
             className="pointer-events-none absolute -top-28 -left-24 z-[60] w-56 select-none" />
        <img src="/images/florals-lily.png" alt="" draggable={false}
             className="pointer-events-none absolute -bottom-10 right-6 z-[60] w-44 rotate-6 select-none" />
        */}
      </div>

      {/* ── call to action ──────────────────────────── */}
      <motion.p
        animate={sealed ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="mt-10 text-xs uppercase tracking-[0.3em] text-stone-600 md:text-sm"
      >
        Click to Open
      </motion.p>
    </motion.button>
  );
}