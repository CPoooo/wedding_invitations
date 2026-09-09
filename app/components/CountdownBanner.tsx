"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";
import { collageItems } from "./collageItems";

/* 10 July 2027 — month is 0-indexed (6 = July). Set the ceremony hour here. */
const WEDDING_DATE = new Date(2027, 6, 10, 11, 0, 0);

type Parts = { months: number; days: number; hours: number; minutes: number; seconds: number };
const ZEROS: Parts = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

/* calendar-aware month diff — addMonths clamps day overflow (Jan 31 + 1mo → Feb 28) */
function addMonths(date: Date, months: number) {
    const d = new Date(date);
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return d;
}

function getTimeParts(target: Date, now: Date): Parts {
    if (now >= target) return ZEROS;
    let months =
        (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    let anchor = addMonths(now, months);
    if (anchor.getTime() > target.getTime()) {
        months -= 1;
        anchor = addMonths(now, months);
    }
    let ms = target.getTime() - anchor.getTime();
    const days = Math.floor(ms / 86_400_000); ms -= days * 86_400_000;
    const hours = Math.floor(ms / 3_600_000); ms -= hours * 3_600_000;
    const minutes = Math.floor(ms / 60_000); ms -= minutes * 60_000;
    const seconds = Math.floor(ms / 1_000);
    return { months, days, hours, minutes, seconds };
}

/* hydration-safe: null until mounted, so server and first client render match */
function useCountdown(target: Date) {
    const [parts, setParts] = useState<Parts | null>(null);
    useEffect(() => {
        const tick = () => setParts(getTimeParts(target, new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);
    return parts ?? ZEROS;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CountdownBanner({ open, revealed }: { open: boolean; revealed: boolean }) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index: collageItems.length });
    const p = useCountdown(WEDDING_DATE);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className="-mx-6 mt-8 px-6 py-16"
        >
            {/* ── hero ─────────────────────────────────── */}
            <div className="text-center text-halo">
                <p className="text-2xl font-medium uppercase tracking-[0.35em] text-ink md:text-4xl">
                    With love,
                </p>
                <p className="mt-3 font-display text-5xl italic font-medium text-ink md:text-7xl">
                    Rachel &amp; Cameron
                </p>
                <div aria-hidden className="mt-6 flex items-center justify-center gap-4">
                    <span className="h-px w-16 bg-ink" />
                    <span className="font-display text-4xl italic text-ink md:text-7xl">10 July 2027</span>
                    <span className="h-px w-16 bg-ink" />
                </div>
            </div>

            {/* ── the plaque ───────────────────────────── */}
            <div className="relative mx-auto mt-14 max-w-3xl rounded-[3rem] border border-line-strong bg-surface-raised/95 px-6 py-14 shadow-[0_30px_70px_-40px_rgba(25,23,18,0.55)] backdrop-blur-[2px]">
                {/* inner hairline — double rule */}
                <div aria-hidden className="pointer-events-none absolute inset-[10px] rounded-[2.4rem] border border-line" />

                {/* ornaments sitting on the frame */}
                <Lozenge className="-top-5" />
                <Lozenge className="-bottom-5" />

                <p className="text-center text-base font-medium uppercase tracking-[0.3em] text-ink md:text-2xl">
                    Until the big day
                </p>

                <div className="mt-6 flex items-start justify-center gap-2.5 md:gap-5">
                    <Unit value={p.months} label="Months" />
                    <Colon />
                    <Unit value={p.days} label="Days" />
                    <Colon />
                    <Unit value={p.hours} label="Hours" />
                    <Colon />
                    <Unit value={p.minutes} label="Minutes" />
                    <Colon />
                    <Unit value={p.seconds} label="Seconds" />
                </div>
            </div>
        </motion.div>
    );
}

function Unit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="w-[2ch] text-center font-display text-4xl leading-none text-ink tabular-nums md:w-[3.2ch] md:text-7xl">
                {pad(value)}
            </span>
            <span className="mt-3 whitespace-nowrap text-[7px] font-medium uppercase tracking-[0.2em] text-ink md:text-[10px] md:tracking-[0.28em]">
                {label}
            </span>
        </div>
    );
}

function Colon() {
    return (
        <span className="mt-0.5 font-display text-3xl leading-none text-gold md:mt-1 md:text-6xl">
            :
        </span>
    );
}

function Lozenge({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`absolute left-1/2 grid h-10 w-10 -translate-x-1/2 rotate-45 place-items-center border border-line-strong bg-surface-raised ${className}`}
        >
            <span className="-rotate-45 text-lg leading-none text-gold">❦</span>
        </div>
    );
}