import type { Metadata } from "next";
import { Crimson_Text, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const displayFont = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Eyeverse Character Bible",
  description: "Lore archive and character index for the Eyeverse universe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
