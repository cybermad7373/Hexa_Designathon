import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/manrope";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
