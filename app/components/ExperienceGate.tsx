"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope, type Phase } from "./Envelope";
import { CollageBoard } from "./CollageBoard";

export function ExperienceGate() {
    const [phase, setPhase] = useState<Phase>("sealed");
    const [revealed, setRevealed] = useState(false);
    const sound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        document.body.style.overflow = phase === "open" ? "" : "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [phase]);

    useEffect(() => {
        if (phase !== "open") return;
        const t = setTimeout(() => setRevealed(true), 1200);
        return () => clearTimeout(t);
    }, [phase]);

    const handleOpen = () => {
        if (phase !== "sealed") return;
        sound.current ??= new Audio("/sounds/open.mp3");
        sound.current.play().catch(() => { });
        setPhase("opening");
    };

    return (
        <>
            <AnimatePresence>
                {phase !== "open" && (
                    <motion.div
                        className="fixed inset-0 z-50 grid place-items-center"
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Envelope phase={phase} onOpen={handleOpen} onOpened={() => setPhase("open")} />
                    </motion.div>
                )}
            </AnimatePresence>

            <CollageBoard open={phase === "open"} revealed={revealed} />
        </>
    );
}