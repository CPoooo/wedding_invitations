import Link from "next/link";

export function BackButton({
  href = "/",
  label = "Back to the board",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface-raised shadow-[0_8px_18px_-8px_rgba(25,23,18,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent md:right-6 md:top-6"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="text-ink transition-all duration-200 group-hover:-translate-x-px group-hover:text-surface-raised"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
}