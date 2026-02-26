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
    "See what The Hive is building on Solana. Live wallet activity, token launches, and buybacks.",
  openGraph: {
    title: "The Hive",
    description:
      "See what The Hive is building on Solana. Live wallet activity, token launches, and buybacks.",
    url: "https://hiveagent.fun",
    siteName: "The Hive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hive",
    description:
      "See what The Hive is building on Solana. Live wallet activity, token launches, and buybacks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
