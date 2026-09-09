"use client";
import Link from "next/link";

export function RsvpCard({ rotation = 0 }: { rotation?: number }) {
  return (
    <div style={{ rotate: `${rotation}deg` }} className="mb-4 break-inside-avoid">
      <Link
        href="/rsvp"
        className="block bg-rose-100 p-3 pb-10 shadow-lg transition-transform hover:scale-[1.03]"
      >
        <div className="grid aspect-4/5 w-full place-items-center bg-rose-200 text-center">
          <p className="font-serif text-xl">RSVP here →</p>
        </div>
      </Link>
    </div>
  );
}