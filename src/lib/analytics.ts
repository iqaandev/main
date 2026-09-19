/*
 * Google Analytics 4 wiring.
 *
 * Measurement ID for iqaan.com (GA IDs are public by design — they appear
 * in every page's source). NEXT_PUBLIC_GA_ID overrides it if ever needed
 * (.env.local locally, or the repo secret for Pages deploys).
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-MYFLYMSTJP';
export const analyticsEnabled = GA_MEASUREMENT_ID.startsWith('G-');
