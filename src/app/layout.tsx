import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IQAAN — Software, built with conviction.",
  description:
    "IQAAN is a software & product studio. We design and engineer custom software, SaaS platforms, and products for companies that refuse to ship the ordinary.",
  keywords: [
    "IQAAN",
    "software studio",
    "product studio",
    "software development",
    "SaaS platforms",
    "custom software",
    "product engineering",
    "enterprise software",
  ],
  authors: [{ name: "IQAAN" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "IQAAN — Software, built with conviction.",
    description:
      "A software & product studio designing and engineering custom software, SaaS platforms, and products — for companies that refuse to ship the ordinary.",
    siteName: "IQAAN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "IQAAN — Software, built with conviction.",
    description:
      "A software & product studio designing and engineering custom software, SaaS platforms, and products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
