"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";
import { alignCls, type RsvpItem } from "./collageItems";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function RsvpCard({ item, index, open, revealed }: {
    item: RsvpItem; index: number; open: boolean; revealed: boolean;
}) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 70, rotate: item.rotation * 4, scale: 0.92 }}
            animate={visible
                ? { opacity: 1, y: 0, rotate: item.rotation, scale: 1 }
                : { opacity: 0, y: 70, rotate: item.rotation * 4, scale: 0.92 }}
            transition={{ ...spring, delay }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 45 }}
            className={`relative mb-0 ${alignCls[item.align]} ${item.mt ?? "mt-6"} ${item.z ?? ""} ${item.width}`}
        >
            <Link
                href="/rsvp"
                aria-label="R.S.V.P. — click here to send your reply"
                className="group relative block -translate-x-3"
            >
                {/* gentle persistent pulse — draws the eye without being obnoxious */}
                <motion.div
                    aria-hidden
                    className="absolute -inset-2 rounded-lg "
                    animate={visible ? { opacity: [0.35, 0.9, 0.35] } : { opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative aspect-10/7 w-full transition-transform duration-300 group-hover:scale-[1.03]">
                    {/* back panel */}
                    <div className="absolute inset-0 rounded-xs bg-surface-sunk" />

                    {/* front face */}
                    <div className="absolute inset-0 rounded-xs bg-gradient-to-b from-surface via-surface-raised to-surface-deep shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />

                    {/* flap */}
                    <div
                        className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-surface-raised via-surface to-surface-deep [filter:drop-shadow(0_3px_2px_rgba(25,23,18,0.22))]"
                        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.5),transparent_40%)]" />
                    </div>

                    {/* script addressing — nudged below the flap tip, out of the seal's shadow */}
                    <span className="absolute inset-x-0 top-[68%] text-center font-monogram text-3xl leading-none text-ink md:text-5xl">
                        R.S.V.P.
                    </span>
                    <span className="absolute inset-x-0 bottom-[5%] text-center text-[9px] font-bold uppercase tracking-[0.28em] text-wine md:text-[11px]">
                        Click here to RSVP
                    </span>

                    {/* wax seal */}
                    <div className="absolute top-[55%] left-1/2 z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 md:h-12 md:w-12">
                        <div className="grid h-full w-full place-items-center rounded-full bg-wine shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),inset_0_-3px_4px_rgba(0,0,0,0.4),0_2px_5px_rgba(25,23,18,0.4)] transition-transform duration-300 group-hover:scale-110">
                            <span className="font-monogram text-[11px] leading-none text-surface-raised md:text-sm">
                                R&amp;C
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}