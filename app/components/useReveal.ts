"use client";

import type { RefObject } from "react";
import { useInView } from "framer-motion";

export function useReveal(
  ref: RefObject<Element | null>,
  { open, revealed, index }: { open: boolean; revealed: boolean; index: number },
) {
  // once: true  → stays visible after revealing (no re-hiding on scroll-up)
  // -60px bottom margin → card must be 60px into the viewport before animating
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return {
    visible: open && inView,
    delay: revealed ? 0 : Math.min(0.2 + index * 0.08, 0.7),
  };
}