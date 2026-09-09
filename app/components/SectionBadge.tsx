"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";
import { alignCls, type BadgeItem } from "./collageItems";

/* n semicircular bulges around a circle — the scalloped seal silhouette */
function scallopPath(n: number, R: number, cx = 100, cy = 100) {
    const pts = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const;
    });
    const r = R * Math.sin(Math.PI / n);
    let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 1; i <= n; i++) {
        const [x, y] = pts[i % n];
        d += ` A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return d + " Z";
}

const OUTER = scallopPath(14, 96);
const INNER = scallopPath(14, 87);

export function SectionBadge({ item, index, open, revealed }: {
    item: BadgeItem; index: number; open: boolean; revealed: boolean;
}) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.7, rotate: item.rotation * 3 }}
            animate={visible
                ? { opacity: 1, scale: 1, rotate: item.rotation }
                : { opacity: 0, scale: 0.7, rotate: item.rotation * 3 }}
            transition={{ type: "spring", stiffness: 110, damping: 14, delay }}
            whileHover={{ scale: 1.06, rotate: 0, zIndex: 50 }}
            className={`relative ${alignCls[item.align]} ${item.mt ?? "mt-6"} ${item.z ?? ""}`}
        >
            <Link
                href={item.href}
                aria-label={`${item.kicker} ${item.title}`}
                className="group relative block w-44 md:w-52"
            >
                <svg viewBox="-20 -20 240 240" className="block w-full drop-shadow-[0_14px_24px_rgba(25,23,18,0.3)]">
                    <path d={OUTER} className="fill-sage transition-colors duration-300 group-hover:fill-sage-deep" />
                    <path d={INNER} fill="none" stroke="var(--color-surface-raised)" strokeOpacity="0.55" strokeWidth="1.5" />
                </svg>
                <span className="absolute inset-0 grid place-items-center px-6 text-center">
                    <span>
                        <span className="block font-display text-xl italic leading-none text-surface-raised">
                            {item.kicker}
                        </span>
                        <span className="mt-1 block font-display text-4xl font-semibold italic leading-none text-surface-raised md:text-5xl">
                            {item.title}
                        </span>
                        <span className="mt-3 block text-[9px] font-medium uppercase tracking-[0.3em] text-surface-raised/80 transition-colors group-hover:text-surface-raised">
                            Click here
                        </span>
                    </span>
                </span>
            </Link>
        </motion.div>
    );
}