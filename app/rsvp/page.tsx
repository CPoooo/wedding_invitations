"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { submitRsvp, type RsvpState } from "./actions";

const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

export default function RsvpPage() {
    const [state, formAction, isPending] = useActionState<RsvpState, FormData>(
        submitRsvp,
        { status: "idle" },
    );
    const [attending, setAttending] = useState<boolean | null>(null);
    const [guestCount, setGuestCount] = useState(1);

    if (state.status === "success") return <ThankYou attending={state.attending} />;

    // plus-one only: guestCount clamps to 1–2, so at most one "Guest 2" field
    const extras = attending === true ? Math.min(Math.max(guestCount, 1), 2) - 1 : 0;

    return (
        <main className="min-h-screen px-6 py-16 md:py-24">
            {/* ── letterhead ─────────────────────────── */}
            <motion.header {...rise(0)} className="mx-auto max-w-lg text-center">
                <div className="mx-auto grid h-16 w-12 place-items-center rounded-[50%] border border-line-strong bg-surface-raised shadow-[0_8px_18px_-8px_rgba(25,23,18,0.45)]">
                    <span className="font-monogram text-lg leading-none text-accent">R&amp;C</span>
                </div>
                <p className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-ink text-halo">
                    Répondez s&apos;il vous plaît
                </p>
                <h1 className="mt-3 font-display text-5xl italic font-medium text-ink text-halo md:text-6xl">
                    Rachel &amp; Cameron
                </h1>
                <Ornament />
            </motion.header>

            {/* ── the reply card ─────────────────────── */}
            <motion.div
                {...rise(0.15)}
                className="relative mx-auto mt-8 max-w-lg border border-line-strong/60 bg-surface-raised px-7 py-10 shadow-[0_30px_70px_-40px_rgba(25,23,18,0.45)] md:px-12"
            >
                {/* inner hairline — the double-rule stationery frame */}
                <div aria-hidden className="pointer-events-none absolute inset-2 border border-line" />

                <form action={formAction} className="relative space-y-8">
                    <input type="hidden" name="attending" value={attending === true ? "true" : "false"} />

                    <Field label="Your name" name="name" placeholder="Full name" required />

                    {/* accept / decline */}
                    <fieldset>
                        <legend className="eyebrow text-ink">Will you be joining us?</legend>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAttending(true)}
                                aria-pressed={attending === true}
                                className={toggle(attending === true, "accent")}
                            >
                                Accept
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttending(false)}
                                aria-pressed={attending === false}
                                className={toggle(attending === false, "wine")}
                            >
                                Decline
                            </button>
                        </div>
                    </fieldset>

                    {attending === true && (
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <label className="block">
                                <span className="eyebrow text-ink-soft">Total guests, including yourself</span>
                                <input
                                    name="guestCount"
                                    type="number"
                                    min={1}
                                    max={2}
                                    value={guestCount}
                                    onChange={(e) =>
                                        setGuestCount(Math.min(2, Math.max(1, Number(e.target.value) || 1)))
                                    }
                                    className="mt-2 w-24 border-b border-line bg-transparent py-2 text-center font-display text-xl text-ink outline-none transition-colors focus:border-accent"
                                />
                            </label>

                            {Array.from({ length: extras }).map((_, i) => (
                                <Field key={i} label={`Guest ${i + 2}`} name="guestName" placeholder="Full name" />
                            ))}
                        </motion.div>
                    )}

                    {attending === true && (
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <Field label="Dietary restrictions" name="dietaryRestrictions" placeholder="Share any allergies or needs" />
                            <Field label="A note for the couple" name="message" placeholder="Leave a few kind words" textarea />
                        </motion.div>
                    )}

                    {attending === false ? (
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full border border-wine bg-wine p-4 font-display text-lg italic text-surface-raised transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isPending
                                ? "Sealing your reply…"
                                : "It's okay, we don't judge, well maybe just a little... 😉"}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isPending || attending === null}
                            className="eyebrow w-full border border-accent bg-accent py-4 text-surface-raised transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isPending ? "Sealing your reply…" : "Send R.S.V.P."}
                        </button>
                    )}

                    {state.status === "error" && (
                        <p className="text-center font-display text-sm italic text-wine">{state.message}</p>
                    )}

                    <p className="text-center font-display text-sm italic text-ink-soft">
                        Kindly reply by May 1st
                    </p>
                </form>
            </motion.div>
        </main>
    );
}

/* ── pieces ─────────────────────────────────── */

function Ornament() {
    return (
        <div aria-hidden className="mt-6 text-2xl text-halo flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-line-strong/60" />
            <span className="text-accent">❦</span>
            <span className="h-px w-16 bg-line-strong/60" />
        </div>
    );
}

function Field({
    label, name, placeholder, textarea = false, required = false,
}: {
    label: string;
    name: string;
    placeholder?: string;
    textarea?: boolean;
    required?: boolean;
}) {
    const cls =
        "mt-2 w-full border-b border-line bg-transparent pb-2 font-display text-lg text-ink outline-none transition-colors placeholder:italic placeholder:text-ink-soft/50 focus:border-accent";

    return (
        <label className="block">
            <span className="eyebrow text-ink-soft">
                {label}
                {!required && <span className="text-ink-soft/60"> · optional</span>}
            </span>
            {textarea ? (
                <textarea name={name} rows={3} placeholder={placeholder} className={`${cls} resize-none`} />
            ) : (
                <input name={name} required={required} placeholder={placeholder} className={cls} />
            )}
        </label>
    );
}

const toggle = (selected: boolean, tone: "accent" | "wine") =>
    `border py-3 text-center text-[11px] uppercase tracking-[0.25em] transition-colors ${selected
        ? tone === "accent"
            ? "border-accent bg-accent text-surface-raised"
            : "border-wine bg-wine text-surface-raised"
        : "border-line-strong/60 bg-transparent text-ink hover:border-accent hover:text-accent"
    }`;

function ThankYou({ attending }: { attending: boolean }) {
    return (
        <main className="grid min-h-screen place-items-center px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-lg border border-line-strong/60 bg-surface-raised px-7 py-16 text-center shadow-[0_30px_70px_-40px_rgba(25,23,18,0.45)] md:px-12"
            >
                {/* inner hairline — same double-rule frame as the reply card */}
                <div aria-hidden className="pointer-events-none absolute inset-2 border border-line" />

                <div className="relative">
                    <div className="mx-auto grid h-20 w-16 place-items-center rounded-[50%] border border-line-strong bg-surface shadow-[0_8px_18px_-8px_rgba(25,23,18,0.45)]">
                        <span className="font-monogram text-2xl leading-none text-accent">R&amp;C</span>
                    </div>

                    <p className="mt-10 text-base font-medium uppercase tracking-[0.35em] text-ink md:text-lg">
                        Reply received
                    </p>

                    <p className="mt-4 font-monogram text-7xl text-accent md:text-8xl">
                        Thank you
                    </p>

                    <Ornament />

                    <p className="mx-auto mt-8 max-w-md font-display text-xl italic leading-relaxed text-ink md:text-2xl">
                        {attending
                            ? "We are delighted — we look forward to celebrating with you."
                            : "Your reply has been received — we'll miss you! 💐"}
                    </p>

                    <Link
                        href="/"
                        className="mt-12 inline-block border border-accent bg-accent px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-surface-raised transition-colors hover:bg-accent-deep"
                    >
                        Return to the board
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}