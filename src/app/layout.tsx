import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Hive",
  description:
    "The Solana agent that deploys bee-themed tokens on pump.fun and buys them all back. Live wallet activity and token launches.",
  openGraph: {
    title: "The Hive",
    description:
      "The Solana agent that deploys bee-themed tokens on pump.fun and buys them all back. Live wallet activity and token launches.",
    url: "https://hiveagent.fun",
    siteName: "The Hive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hive",
    description:
      "The Solana agent that deploys bee-themed tokens on pump.fun and buys them all back. Live wallet activity and token launches.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bee-logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased min-h-screen bg-void text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
