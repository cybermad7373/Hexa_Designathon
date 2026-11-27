import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/manrope";
import "./globals.css";
import { ProgressBar } from "@/components/progress-bar";

export const metadata: Metadata = {
  title: {
    default: "Hexa Designathon OS",
    template: "%s · Hexa",
  },
  description:
    "A phase-gated operating system for turning a raw problem statement into a deployed, demo-ready product in ten hours.",
  applicationName: "Hexa Designathon OS",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f8f8f9",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className="bg-canvas font-sans text-fg antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-2 pb-4 border-b border-line/60 bg-canvas/90 backdrop-blur backdrop-blur-lg">
          <ProgressBar value={60} label="Discovery → Build" compact />
        </div>
        {children}
      </body>
    </html>
  );
}
