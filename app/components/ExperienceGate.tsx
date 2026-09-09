"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope, type Phase } from "./Envelope";
import { CollageBoard } from "./CollageBoard";

// If someone really wants to view the opening again I can add that later I suppose
/* One open per browser session: navigating (RSVP → board) stays open,
   but every fresh visit starts sealed so the ritual isn't lost. */
const STORAGE_KEY = "rc-invitation-opened";

export function ExperienceGate() {
    const [phase, setPhase] = useState<Phase>("sealed");
    const [revealed, setRevealed] = useState(false);
    const [ready, setReady] = useState(false);
    const sound = useRef<HTMLAudioElement | null>(null);

    // decide sealed vs open once, after mount (storage doesn't exist during SSR)
    useEffect(() => {
        if (sessionStorage.getItem(STORAGE_KEY) === "1") setPhase("open");
        setReady(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = phase === "open" ? "" : "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [phase]);

    // mark opened + end the entrance-stagger window
    useEffect(() => {
        if (phase !== "open") return;
        sessionStorage.setItem(STORAGE_KEY, "1");
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
                {ready && phase !== "open" && (
                    <motion.div
                        className="fixed inset-0 z-50 grid place-items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.4 } }}
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