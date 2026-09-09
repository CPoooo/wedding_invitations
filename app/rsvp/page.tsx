"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { submitRsvp, type RsvpState } from "./actions";
import { MAX_EXTRA_GUESTS } from "./config";
import { BackButton } from "../components/BackButton";

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
    // one entry per ADDITIONAL guest; the form-filler is always counted separately
    const [guests, setGuests] = useState<string[]>([]);

    if (state.status === "success") return <ThankYou attending={state.attending} />;

    const addGuest = () =>
        setGuests((g) => (g.length >= MAX_EXTRA_GUESTS ? g : [...g, ""]));
    const removeGuest = (i: number) =>
        setGuests((g) => g.filter((_, idx) => idx !== i));
    const setGuest = (i: number, value: string) =>
        setGuests((g) => g.map((v, idx) => (idx === i ? value : v)));

    return (
        <main className="min-h-screen px-6 py-16 md:py-24">
            <BackButton />
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

                    {/* additional guests — add/remove fields, no number entry */}
                    {attending === true && (
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            {guests.map((name, i) => (
                                <div key={i} className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <Field
                                            label={`Guest ${i + 1}`}
                                            name="guestName"
                                            placeholder="Full name"
                                            value={name}
                                            onChange={(e) => setGuest(i, e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeGuest(i)}
                                        aria-label={`Remove guest ${i + 2}`}
                                        className="mb-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg leading-none text-ink-soft transition-colors hover:border-wine hover:text-wine"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {guests.length < MAX_EXTRA_GUESTS ? (
                                <button
                                    type="button"
                                    onClick={addGuest}
                                    className="w-full border border-dashed border-line-strong/70 py-3 text-center text-[11px] uppercase tracking-[0.25em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                                >
                                    + Add a guest
                                </button>
                            ) : (
                                <p className="text-center font-display text-sm italic text-ink-soft">
                                    That&apos;s the whole party — up to {MAX_EXTRA_GUESTS} additional guests, please.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {attending === true && (
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <Field label="Dietary restrictions (optional)" name="dietaryRestrictions" placeholder="Share any allergies or needs" />
                            <Field label="A note for us (optional)" name="message" placeholder="Leave a few kind words" textarea />
                        </motion.div>
                    )}

                    {attending === false ? (
                        <>
                            <p className="text-center font-display text-lg italic text-ink">
                                It&apos;s okay, we don&apos;t judge, well maybe just a little... 😉
                            </p>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="eyebrow w-full border border-wine bg-wine py-4 text-surface-raised transition-colors hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isPending ? "Sealing your reply…" : "Send R.S.V.P."}
                            </button>
                        </>
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
    label, name, placeholder, textarea = false, required = false, value, onChange,
}: {
    label: string;
    name: string;
    placeholder?: string;
    textarea?: boolean;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const cls =
        "mt-2 w-full border-b border-line bg-transparent pb-2 font-display text-lg text-ink outline-none transition-colors placeholder:italic placeholder:text-ink-soft/50 focus:border-accent";

    return (
        <label className="block">
            <span className="eyebrow text-ink-soft">
                {label}
            </span>
            {textarea ? (
                <textarea name={name} rows={3} placeholder={placeholder} className={`${cls} resize-none`} />
            ) : (
                <input
                    name={name}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={cls}
                />
            )}
        </label>
    );
}

const toggle = (selected: boolean, tone: "accent" | "wine") =>
    `border py-3 text-center text-[11px] uppercase tracking-[0.25em] transition-colors hover:cursor-pointer ${selected
        ? tone === "accent"
            ? "border-accent bg-accent text-surface-raised"
            : "border-wine bg-wine text-surface-raised"
        : tone === "accent"
            ? "border-line-strong/60 bg-transparent text-ink hover:border-accent hover:text-accent"
            : "border-wine/40 bg-transparent text-ink hover:border-wine hover:text-wine"
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