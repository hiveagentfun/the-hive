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
    "Tracking deploys, buybacks, and activity for the HIVE wallet on Solana.",
  openGraph: {
    title: "The Hive",
    description:
      "Tracking deploys, buybacks, and activity for the HIVE wallet on Solana.",
    url: "https://thehive.fun",
    siteName: "The Hive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hive",
    description:
      "Tracking deploys, buybacks, and activity for the HIVE wallet on Solana.",
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
