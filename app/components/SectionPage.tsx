import { BackButton } from "./BackButton";

export function SectionPage({
    kicker, title, children,
}: {
    kicker: string;
    title: string;
    children?: React.ReactNode;
}) {
    return (
        <main className="min-h-screen px-6 py-16 md:py-24">
            <BackButton />
            <div className="relative mx-auto mt-10 max-w-lg border border-line-strong/60 bg-surface-raised px-7 py-12 text-center shadow-[0_30px_70px_-40px_rgba(25,23,18,0.45)] md:px-12">
                <div aria-hidden className="pointer-events-none absolute inset-2 border border-line" />
                <p className="eyebrow text-ink-soft">{kicker}</p>
                <h1 className="mt-3 font-display text-4xl italic font-medium text-ink md:text-5xl">{title}</h1>
                <div className="mt-8 font-display text-lg italic leading-relaxed text-ink-soft">
                    {children ?? <p>Coming soon — the fine print is still being lettered.</p>}
                </div>
            </div>
        </main>
    );
}