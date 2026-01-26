declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const cleaned =
    params &&
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));

  window.gtag('event', name, cleaned || {});
}

export function trackPageView(pagePath?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const path =
    pagePath ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}
