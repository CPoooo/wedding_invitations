"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function OpenedEnvelope({ open, revealed }: { open: boolean; revealed: boolean }) {
    const ref = useRef(null);
    // index -2 → reveals before any grid card (delay ≈ 0.04s)
    const { visible, delay } = useReveal(ref, { open, revealed, index: -2 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-36 w-[min(430px,84vw)]"
        >
            {/* z-0 · ground shadow */}
            <div className="absolute inset-x-6 -bottom-3 z-0 h-6 rounded-[50%] bg-ink/25 blur-lg" />

            {/* z-10 · open flap — interior side, apex up, mostly hidden behind the card */}
            <div
                className="absolute inset-x-0 bottom-full z-10 h-[38%] bg-gradient-to-b from-surface-sunk to-surface-deep [filter:drop-shadow(0_2px_2px_rgba(25,23,18,0.18))]"
                style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
            />

            {/* z-40 · names — calligraphy addressing on the envelope front */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.6, delay: delay + 0.35 }}
                className="pointer-events-none absolute inset-x-0 top-[55%] z-40 px-4 text-center"
            >
                <span className="font-monogram text-3xl text-ink md:text-5xl">
                    Rachel &amp; Cameron
                </span>
            </motion.h1>

            {/* z-20 · the invitation — rises out of the pocket after the section lands */}
            <motion.div
                initial={{ y: 26 }}
                animate={visible ? { y: 0 } : { y: 26 }}
                transition={{ ...spring, delay: delay + 0.25 }}
                className="absolute inset-x-0 bottom-[10%] z-20 mx-auto h-[140%] w-[76%] rounded-[2px] bg-surface-raised px-5 pt-7 text-center shadow-[0_2px_10px_rgba(25,23,18,0.18)]"
            >
                <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink-soft">
                    We are getting married
                </p>
                <p className="mt-2 font-display text-3xl font-medium text-ink md:text-4xl">
                    07.10.2027
                </p>
                <Flourish />
                <p className="mt-2 font-display text-base italic text-ink-soft md:text-lg">
                    Actual address in Oregon here after site login added
                </p>
            </motion.div>

            {/* z-30 · the pocket — same face/colors as the closed envelope's front,
               with the classic V-notch where the card emerges */}
            <div
                className="relative z-30 aspect-[10/6.8] bg-gradient-to-b from-surface-deep to-surface-sunk shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                style={{ clipPath: "polygon(0 0, 50% 26%, 100% 0, 100% 100%, 0 100%)" }}
            >
                {/* interior depth — darkens the notch where the card slides in */}
                <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-ink/20 to-transparent" />
            </div>
        </motion.div>
    );
}

/* engraved-style flourish divider — swap for a Canva PNG anytime */
function Flourish() {
    return (
        <svg viewBox="0 0 160 24" fill="none" aria-hidden className="mx-auto mt-3 w-36 text-gold">
            <path
                d="M4 12 C 40 12, 52 4, 72 8 C 82 10, 80 16, 74 15 C 68 14, 74 7, 88 8 C 108 9.5, 124 12, 156 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}