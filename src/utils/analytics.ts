declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === 'undefined') return null;

  // Ensure commands can be queued before the GA script loads.
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  return window.gtag;
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  const gtag = getGtag();
  if (!gtag) return;

  const cleaned =
    params &&
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));

  gtag('event', name, cleaned || {});
}

export function trackPageView(pagePath?: string) {
  const gtag = getGtag();
  if (!gtag) return;

  const path =
    pagePath ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}
