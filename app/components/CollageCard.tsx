"use client";

import { motion } from "framer-motion";
import type { PhotoItem } from "./collageItems";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

const frames: Record<PhotoItem["variant"], string> = {
    // classic white border + deep bottom edge for the caption
    polaroid: "bg-[#fdfcfa] p-3 pb-12 shadow-[0_10px_24px_rgba(40,35,25,0.18)]",
    // colored pad + die-cut outline
    pad: "p-3 rounded-[6px] shadow-[0_0_0_5px_#fdfcfa,0_12px_28px_rgba(40,35,25,0.22)]",
    // photo IS the sticker
    bare: "rounded-[6px] overflow-hidden shadow-[0_0_0_4px_#fdfcfa,0_10px_24px_rgba(40,35,25,0.2)]",
};

export function CollageCard({ item, index, open }: { item: PhotoItem; index: number; open: boolean }) {
    return (
        <motion.figure
            initial={{ opacity: 0, y: 70, rotate: item.rotation * 4, scale: 0.92 }}
            animate={open ? { opacity: 1, y: 0, rotate: item.rotation, scale: 1 } : undefined}
            transition={{ ...spring, delay: Math.min(0.2 + index * 0.08, 0.7) }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className={`relative mb-4 break-inside-avoid ${frames[item.variant]}`}
            style={item.variant === "pad" ? { backgroundColor: item.padColor } : undefined}
        >
            {item.src ? (
                <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    className={`w-full select-none bg-stone-200 object-cover ${item.aspect}`}
                />
            ) : (
                // placeholder
                <div className={`${item.aspect} w-full bg-stone-200`} />
            )}

            {item.variant === "polaroid" && item.caption && (
                <figcaption className="absolute inset-x-0 bottom-3 text-center font-cormorant text-sm italic text-stone-600">
                    {item.caption}
                </figcaption>
            )}

            {item.tape === "top" && <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />}
            {item.tape === "corner" && <Tape className="-top-3 -left-9 -rotate-45" />}
        </motion.figure>
    );
}

function Tape({ className }: { className?: string }) {
    return (
        <div
            className={`absolute h-6 w-24 bg-[#e9e2cf]/80 shadow-sm backdrop-blur-[1px] ${className}`}
            style={{ clipPath: "polygon(1% 8%, 99% 0%, 100% 92%, 0% 100%)" }}  // torn ends
        />
    );
}