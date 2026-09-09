import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",   // ← consumed by --font-display in globals.css
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const script = Pinyon_Script({
  variable: "--font-script",      // ← consumed by --font-monogram in globals.css
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rachel & Cameron",
  description: "Wedding invitation for Rachel and Cameron's wedding",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${script.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}