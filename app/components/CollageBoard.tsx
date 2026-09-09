"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CollageCard } from "./CollageCard";
import { RsvpCard } from "./RsvpCard";
import { useReveal } from "./useReveal";
import { collageItems, type StickerItem } from "./collageItems";
import { CountdownBanner } from "./CountdownBanner";
import { OpenedEnvelope } from "./OpenedEnvelope";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function CollageBoard({ open, revealed }: { open: boolean; revealed: boolean }) {
    return (
        <section className="min-h-screen px-6 py-16">
            <OpenedEnvelope open={open} revealed={revealed} />
            <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3">
                {collageItems.map((item, i) => {
                    if (item.kind === "rsvp") {
                        return <RsvpCard key={item.id} rotation={item.rotation} index={i} open={open} revealed={revealed} />;
                    }
                    if (item.kind === "sticker") {
                        return <LooseSticker key={item.id} item={item} index={i} open={open} revealed={revealed} />;
                    }
                    return <CollageCard key={item.id} item={item} index={i} open={open} revealed={revealed} />;
                })}
            </div>
            <CountdownBanner open={open} revealed={revealed} />
        </section>
    );
}

function LooseSticker({ item, index, open, revealed }: {
    item: StickerItem; index: number; open: boolean; revealed: boolean;
}) {
    const ref = useRef(null);
    const { visible, delay } = useReveal(ref, { open, revealed, index });

    return (
        <motion.img
            ref={ref}
            src={item.src}
            alt=""
            draggable={false}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={visible ? { opacity: 1, scale: 1, rotate: item.rotation } : { opacity: 0, scale: 0.5 }}
            transition={{ ...spring, delay }}
            whileHover={{ scale: 1.15, rotate: 0 }}
            className={`mb-4 break-inside-avoid ml-auto block ${item.width} select-none drop-shadow-lg`}
        />
    );
}