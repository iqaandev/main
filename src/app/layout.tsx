import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IQAAN | Premium Software Development, SaaS & Product Solutions",
  description:
    "IQAAN delivers world-class custom software development, SaaS platforms, and high-end product solutions. We transform visionary ideas into powerful digital products that drive growth and innovation.",
  keywords: [
    "IQAAN",
    "software development",
    "SaaS",
    "product solutions",
    "custom software",
    "web development",
    "mobile apps",
    "cloud solutions",
    "digital transformation",
    "enterprise software",
  ],
  authors: [{ name: "IQAAN" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "IQAAN | Premium Software Development & SaaS Solutions",
    description:
      "World-class custom software development, SaaS platforms, and high-end product solutions.",
    siteName: "IQAAN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQAAN | Premium Software Development & SaaS Solutions",
    description:
      "World-class custom software development, SaaS platforms, and high-end product solutions.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
