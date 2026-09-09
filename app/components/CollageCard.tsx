"use client";
import { motion } from "framer-motion";

export function CollageCard({ rotation = 0, caption }: { rotation?: number; caption?: string }) {
  return (
    <motion.figure
      style={{ rotate: `${rotation}deg` }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="mb-4 break-inside-avoid bg-white p-3 pb-10 shadow-lg"
    >
      {/* placeholder — becomes <img src={...} /> later */}
      <div className="aspect-4/5 w-full bg-neutral-200" />
      {caption && <figcaption className="pt-3 text-center text-sm italic">{caption}</figcaption>}
    </motion.figure>
  );
}