"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CollageCard } from "./CollageCard";
import { RsvpCard } from "./RsvpCard";
import { SectionBadge } from "./SectionBadge";
import { useReveal } from "./useReveal";
import { collageItems, alignCls, type CollageItem, type StickerItem } from "./collageItems";
import { CountdownBanner } from "./CountdownBanner";
import { OpenedEnvelope } from "./OpenedEnvelope";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function CollageBoard({ open, revealed }: { open: boolean; revealed: boolean }) {
    // keep original array index for the stagger, split by column
    const withIndex = collageItems.map((item, i) => ({ item, i }));
    const left = withIndex.filter(({ item }) => item.col === "left");
    const right = withIndex.filter(({ item }) => item.col === "right");

    return (
        <section className="min-h-screen px-6 py-16">
            <OpenedEnvelope open={open} revealed={revealed} />

            {/* dense two-column board — pulled up so the envelope reads as part of the board */}
            <div className="mx-auto -mt-6 flex max-w-3xl items-start gap-4">
                <div className="flex w-1/2 flex-col">
                    {left.map(({ item, i }) => <BoardItem key={item.id} item={item} index={i} open={open} revealed={revealed} />)}
                </div>
                <div className="mt-24 flex w-1/2 flex-col">   {/* offset = the zigzag */}
                    {right.map(({ item, i }) => <BoardItem key={item.id} item={item} index={i} open={open} revealed={revealed} />)}
                </div>
            </div>

            <CountdownBanner open={open} revealed={revealed} />
        </section>
    );
}

function BoardItem({ item, index, open, revealed }: {
    item: CollageItem; index: number; open: boolean; revealed: boolean;
}) {
    if (item.kind === "rsvp") return <RsvpCard item={item} index={index} open={open} revealed={revealed} />;
    if (item.kind === "badge") return <SectionBadge item={item} index={index} open={open} revealed={revealed} />;
    if (item.kind === "sticker") return <LooseSticker item={item} index={index} open={open} revealed={revealed} />;
    return <CollageCard item={item} index={index} open={open} revealed={revealed} />;
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
            className={`relative mb-0 block ${alignCls[item.align]} ${item.mt ?? "mt-4"} ${item.z ?? ""} ${item.width} select-none drop-shadow-lg`}
        />
    );
}