"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type Phase = "sealed" | "opening" | "open";

const CTA_TEXT = "Click to Open...";

/* ── typewriter loop: type → hold → erase → rest → repeat ── */
function useTypewriter(text: string, enabled: boolean) {
    const [count, setCount] = useState(0);
    const [mode, setMode] = useState<"type" | "hold" | "erase" | "rest">("type");

    useEffect(() => {
        if (!enabled) return;
        let t: ReturnType<typeof setTimeout>;

        if (mode === "type") {
            t = count < text.length
                ? setTimeout(() => setCount(c => c + 1), 90)      // typing speed
                : setTimeout(() => setMode("hold"), 300);
        } else if (mode === "hold") {
            t = setTimeout(() => setMode("erase"), 3400);          // pause, fully typed
        } else if (mode === "erase") {
            t = count > 0
                ? setTimeout(() => setCount(c => c - 1), 32)       // delete is faster than type
                : setTimeout(() => setMode("rest"), 250);
        } else {
            t = setTimeout(() => setMode("type"), 1100);           // empty pause before retype
        }
        return () => clearTimeout(t);
    }, [count, mode, text, enabled]);

    return enabled ? text.slice(0, count) : text;
}

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
    const reduced = useReducedMotion();
    const typed = useTypewriter(CTA_TEXT, sealed && !reduced);

    return (
        <motion.button
            type="button"
            onClick={onOpen}
            disabled={!sealed}
            aria-label="Open the invitation"
            className="group relative flex select-none cursor-pointer flex-col items-center"
            whileHover={sealed ? { y: -6 } : undefined}
            whileTap={sealed ? { scale: 0.985 } : undefined}
            animate={phase === "opening" ? { scale: 1.06, rotate: -1.5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => {
                if (phase === "opening") onOpened();
            }}
        >
            {/* letterhead */}
            <p className="text-base font-medium uppercase tracking-[0.35em] text-ink text-halo md:text-xl">
                You're Invited!
            </p>
            <p className="mt-4 font-display text-5xl italic font-medium leading-tight text-ink text-halo md:text-6xl">
                Rachel <span className="font-normal">&amp;</span>
                <br />
                Cameron
            </p>

            {/* ── the envelope ────────────────────────────── */}
            <div className="relative mt-8 aspect-[10/7] w-[min(430px,84vw)]">
                {/* z-0 · ground shadow — softer, so the envelope melts into the board */}
                <div className="absolute inset-x-6 -bottom-3 z-0 h-6 rounded-[50%] bg-ink/15 blur-lg" />

                {/* z-10 · back panel (interior — dark, seen when flap opens) */}
                <div className="absolute inset-0 z-10 rounded-[3px] bg-surface-sunk" />

                {/* z-20 · the letter — hidden for now, slides out later */}
                <div className="absolute inset-x-6 top-8 bottom-6 z-20 rounded-[2px] bg-surface-raised shadow-sm" />

                {/* z-30 · front face — darker at the bottom for depth */}
                <div className="absolute inset-0 z-30 rounded-[3px] bg-gradient-to-b from-surface-deep to-surface-sunk shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />

                {/* z-40 · flap — lighter than the front, catching light from above */}
                <div
                    className="absolute inset-x-0 top-0 z-40 h-[58%] bg-gradient-to-b from-surface-raised via-surface to-surface-deep [filter:drop-shadow(0_4px_3px_rgba(25,23,18,0.3))]"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.55),transparent_38%),linear-gradient(245deg,rgba(120,110,95,0.12),transparent_38%)]" />
                </div>

                {/* z-50 · seal */}
                <div className="absolute top-[58%] left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                    <div className="grid h-[4.75rem] w-[3.6rem] -rotate-4 place-items-center rounded-[50%] border border-line-strong bg-surface-raised shadow-[0_2px_8px_rgba(25,23,18,0.35)]">
                        <span className="font-monogram text-[1.35rem] leading-none text-accent">
                            R&amp;C
                        </span>
                    </div>
                </div>
            </div>

            {/* ── call to action — typed out ──────────────── */}
            <p aria-hidden className="relative font-bold mt-10 text-lg  uppercase tracking-[0.3em] text-ink text-halo md:text-2xl">
                {/* invisible sizer reserves the full width, so the left text edge
                    stays fixed while typing instead of drifting from center */}
                <span className="invisible">{CTA_TEXT}</span>
                <span className="absolute inset-0">
                    {typed}
                    {sealed && !reduced && (
                        <motion.span
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                            className="ml-[0.2em] inline-block h-[1.05em] w-[0.12em] translate-y-[0.15em] bg-current"
                        />
                    )}
                </span>
            </p>
        </motion.button>
    );
}