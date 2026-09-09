"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope, type Phase } from "./Envelope";

export function EnvelopeOverlay() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const clickSound = useRef<HTMLAudioElement | null>(null);

  // scroll is locked until the envelope opens
  useEffect(() => {
    document.body.style.overflow = phase === "open" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const handleOpen = () => {
    if (phase !== "sealed") return;
    // Audio must be triggered inside the click gesture (browser autoplay rules)
    clickSound.current ??= new Audio("/sounds/open.mp3"); // drop any mp3 in public/sounds/
    clickSound.current.play().catch(() => {});
    setPhase("opening");
  };

  return (
    <AnimatePresence>
      {phase !== "open" && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#faf7f2]"
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Envelope
            phase={phase}
            onOpen={handleOpen}
            onOpened={() => setPhase("open")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}