declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim();

let isInitialized = false;

function hasValidId(id: string | undefined): id is string {
  return !!id && id.startsWith('G-');
}

function ensureScriptLoaded(id: string) {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-ga4="gtag"][data-ga4-id="${id}"]`,
  );
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.setAttribute('data-ga4', 'gtag');
  script.setAttribute('data-ga4-id', id);
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (isInitialized) return;
  isInitialized = true;

  if (!hasValidId(GA4_ID)) return;

  ensureScriptLoaded(GA4_ID);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    };

  window.gtag('js', new Date());
  // SPA: opt out of automatic page_view; we can send explicit ones later if we want.
  window.gtag('config', GA4_ID, { send_page_view: false });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (!hasValidId(GA4_ID)) return;
  if (typeof window === 'undefined') return;
  if (!window.gtag) return;

  // GA4 ignores undefined values; keep it clean.
  const cleaned =
    params &&
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));

  window.gtag('event', name, cleaned || {});
}

