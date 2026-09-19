/*
 * Form delivery for the static site — Web3Forms (https://web3forms.com).
 *
 * Create an access key once: web3forms.com → enter hello@iqaan.com →
 * copy the key. Then either paste it here as the fallback below, or set
 * NEXT_PUBLIC_WEB3FORMS_KEY (.env.local for dev, or the same-named repo
 * secret for Pages deploys). Keys are designed to be public in client
 * code — spam is filtered by the honeypot field, not key secrecy.
 *
 * Until a key exists, submissions fail honestly: the form shows the
 * direct-email fallback instead of pretending to send.
 */
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

export async function submitToWeb3Forms(
  payload: Record<string, string>
): Promise<boolean> {
  if (!WEB3FORMS_KEY) return false;
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
    });
    const data = (await response.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}
