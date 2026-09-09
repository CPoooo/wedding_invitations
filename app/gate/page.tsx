import { unlock } from "./actions";

export default async function GatePage({
    searchParams,
}: {
    searchParams: Promise<{ e?: string; from?: string }>;
}) {
    const { e, from } = await searchParams;

    return (
        <main className="grid min-h-screen place-items-center px-6">
            <div className="relative w-full max-w-sm border border-line-strong/60 bg-surface-raised px-7 py-12 text-center shadow-[0_30px_70px_-40px_rgba(25,23,18,0.45)] md:px-10">
                <div aria-hidden className="pointer-events-none absolute inset-2 border border-line" />

                <div className="relative">
                    <div className="mx-auto grid h-16 w-12 place-items-center rounded-[50%] border border-line-strong bg-surface shadow-[0_8px_18px_-8px_rgba(25,23,18,0.45)]">
                        <span className="font-monogram text-lg leading-none text-accent">R&amp;C</span>
                    </div>

                    <p className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-ink">
                        A private celebration
                    </p>
                    <p className="mx-auto mt-4 max-w-xs font-display text-lg italic leading-relaxed text-ink-soft">
                        This invitation is personal. Kindly enter the word from your invitation to step inside.
                    </p>

                    <form action={unlock} className="mt-8 space-y-6">
                        <input type="hidden" name="from" value={from ?? "/"} />
                        <input
                            name="password"
                            type="password"
                            required
                            autoFocus
                            placeholder="The word"
                            className="w-full border-b border-line bg-transparent pb-2 text-center font-display text-xl text-ink outline-none transition-colors placeholder:italic placeholder:text-ink-soft/50 focus:border-accent"
                        />
                        {e === "1" && (
                            <p className="font-display text-sm italic text-wine">
                                That word doesn&apos;t open this door — check your invitation.
                            </p>
                        )}
                        <button
                            type="submit"
                            className="eyebrow w-full border border-accent bg-accent py-4 text-surface-raised transition-colors hover:bg-accent-deep"
                        >
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}