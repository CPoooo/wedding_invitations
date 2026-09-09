"use client";

import { motion } from "framer-motion";
import { CollageCard } from "./CollageCard";
import { RsvpCard } from "./RsvpCard";
import { collageItems, type StickerItem } from "./collageItems";

const spring = { type: "spring" as const, stiffness: 110, damping: 14 };

export function CollageBoard({ open }: { open: boolean }) {
  return (
    <section className="min-h-screen px-6 py-16">
      <h1 className="mb-10 text-center font-serif text-4xl">Rachel &amp; Cameron</h1>
      <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3">
        {collageItems.map((item, i) => {
          if (item.kind === "rsvp") {
            return <RsvpCard key={item.id} rotation={item.rotation} index={i} open={open} />;
          }
          if (item.kind === "sticker") {
            return <LooseSticker key={item.id} item={item} open={open} />;
          }
          return <CollageCard key={item.id} item={item} index={i} open={open} />;
        })}
      </div>
    </section>
  );
}

function LooseSticker({ item, open }: { item: StickerItem; open: boolean }) {
  return (
    <motion.img
      src={item.src}
      alt=""
      draggable={false}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={open ? { opacity: 1, scale: 1, rotate: item.rotation } : undefined}
      transition={spring}
      whileHover={{ scale: 1.15, rotate: 0 }}
      className={`mb-4 break-inside-avoid ml-auto block ${item.width} select-none drop-shadow-lg`}
    />
  );
}