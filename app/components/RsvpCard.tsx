"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function RsvpCard({
    rotation = 0,
    index,
    open,
    revealed,
}: {
    rotation?: number;
    index: number;
    open: boolean;
    revealed: boolean;
}) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 70, rotate: rotation * 4, scale: 0.92 }}
            animate={visible
                ? { opacity: 1, y: 0, rotate: rotation, scale: 1 }
                : { opacity: 0, y: 70, rotate: rotation * 4, scale: 0.92 }}
            transition={{ ...spring, delay }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className="mb-4 break-inside-avoid"
        >
            <Link
                href="/rsvp"
                className="block rounded-[6px] bg-accent/10 p-4 shadow-[0_0_0_5px_var(--color-surface-raised),0_12px_28px_rgba(44,42,34,0.22)]"
            >
                <div className="grid aspect-[4/5] w-full place-items-center rounded-[3px] bg-accent/20 text-center">
                    <p className="font-display text-2xl italic text-accent-deep">RSVP here →</p>
                </div>
            </Link>
        </motion.div>
    );
}