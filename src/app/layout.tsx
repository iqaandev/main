import type { Metadata } from "next";
import Script from "next/script";
import {
  Amiri,
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "./globals.css";
import { GA_MEASUREMENT_ID, analyticsEnabled } from "@/lib/analytics";

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

/* Arabic faces — calligraphic Naskh for display, Plex for body/UI.
   Arabic-only subsets give correct per-glyph fallback in the composite
   stacks: Arabic glyphs render Amiri/Plex, Latin stays Fraunces/Geist. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${amiri.variable} ${plexArabic.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        {analyticsEnabled && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
