"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";
import { alignCls, type PhotoItem } from "./collageItems";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

const frames: Record<PhotoItem["variant"], string> = {
    polaroid: "bg-surface-raised p-3 pb-12 shadow-[0_10px_24px_rgba(44,42,34,0.18)]",
    pad: "p-3 rounded-[6px] shadow-[0_0_0_5px_var(--color-surface-raised),0_12px_28px_rgba(44,42,34,0.22)]",
    bare: "rounded-[6px] overflow-hidden shadow-[0_0_0_4px_var(--color-surface-raised),0_10px_24px_rgba(44,42,34,0.2)]",
};

export function CollageCard({ item, index, open, revealed }: {
    item: PhotoItem; index: number; open: boolean; revealed: boolean;
}) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index });

    return (
        <motion.figure
            ref={ref}
            initial={{ opacity: 0, y: 70, rotate: item.rotation * 4, scale: 0.92 }}
            animate={visible
                ? { opacity: 1, y: 0, rotate: item.rotation, scale: 1 }
                : { opacity: 0, y: 70, rotate: item.rotation * 4, scale: 0.92 }}
            transition={{ ...spring, delay }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className={`relative mb-0 ${alignCls[item.align]} ${item.mt ?? "mt-6"} ${item.z ?? ""} ${item.width} ${frames[item.variant]}`}
            style={item.variant === "pad" ? { backgroundColor: item.padColor } : undefined}
        >
            {item.src ? (
                <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    className={`w-full select-none bg-well object-cover ${item.aspect}`}
                />
            ) : (
                <div className={`${item.aspect} w-full bg-well`} />
            )}

            {item.variant === "polaroid" && item.caption && (
                <figcaption className="absolute inset-x-0 bottom-3 text-center font-display text-sm italic text-ink-soft">
                    {item.caption}
                </figcaption>
            )}
        </motion.figure>
    );
}