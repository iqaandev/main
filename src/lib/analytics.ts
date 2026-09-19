/*
 * Google Analytics 4 wiring.
 *
 * Set NEXT_PUBLIC_GA_ID to your GA4 Measurement ID (G-XXXXXXXXXX) —
 * locally in .env.local, or as the NEXT_PUBLIC_GA_ID repository secret
 * (GitHub → Settings → Secrets and variables → Actions) so the Pages
 * deploy workflow bakes it in at build time.
 *
 * When unset, no GA script is loaded at all (dev stays clean).
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const analyticsEnabled = GA_MEASUREMENT_ID.startsWith('G-');
