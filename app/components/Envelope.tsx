"use client";

import { motion } from "framer-motion";

export type Phase = "sealed" | "opening" | "open";

export function Envelope({
  phase, onOpen, onOpened,
}: { phase: Phase; onOpen: () => void; onOpened: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      aria-label="Open the invitation"
      className="relative h-56 w-96 cursor-pointer"
      animate={phase === "opening" ? { scale: 1.06, rotate: -1 } : { scale: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => { if (phase === "opening") onOpened(); }}
    >
      {/* layer 1: back panel */}
      <div className="absolute inset-0 z-0 rounded bg-[#e8ddcb] shadow-xl" />
      {/* layer 2: the card that will slide out later */}
      <div className="absolute inset-x-6 top-3 bottom-6 z-10 rounded-sm bg-white" />
      {/* layer 3: front pocket */}
      <div className="absolute inset-0 z-20 rounded bg-[#d9c9a8]" />
      {/* layer 4: flap — later gets rotateX with perspective */}
      <div className="absolute inset-x-0 top-0 z-30 h-28 rounded-t bg-[#cbb392]" />
    </motion.button>
  );
}