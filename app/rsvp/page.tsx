"use client";
import { useState } from "react";

// can we just make this into a Server Action? 

export default function RsvpPage() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        attending: attending === true,
        guestCount: Number(form.get("guestCount") ?? 1),
        guestNames: form.getAll("guestName").filter(Boolean),
        dietaryRestrictions: form.get("dietaryRestrictions"),
        message: form.get("message"),
      }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") return <p className="grid min-h-screen place-items-center text-2xl">Thank you! 💌</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 p-8">
      <input name="name" required placeholder="Your name" className="w-full border p-2" />

      <div className="flex gap-4">
        <button type="button" onClick={() => setAttending(true)}  className={attending === true ? "underline" : ""}>Joyfully accepts</button>
        <button type="button" onClick={() => setAttending(false)} className={attending === false ? "underline" : ""}>Regretfully declines</button>
      </div>

      {attending === true && (
        <>
          <input name="guestCount" type="number" min={1} defaultValue={1} className="w-full border p-2" placeholder="Total guests (incl. you)" />
          {/* one input per extra guest, name="guestName" — iterate up to guestCount - 1 */}
        </>
      )}

      {attending !== null && (
        <>
          <input name="dietaryRestrictions" placeholder="Dietary restrictions (optional)" className="w-full border p-2" />
          <textarea name="message" placeholder="A note for the couple (optional)" className="w-full border p-2" />
          <button disabled={status === "sending"} className="w-full bg-rose-200 p-2">
            {status === "sending" ? "Sending…" : "Send RSVP"}
          </button>
        </>
      )}
    </form>
  );
}