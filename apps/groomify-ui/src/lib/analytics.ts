const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const IS_DEV = import.meta.env.DEV;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
    __ga4Status?: {
      enabled: boolean;
      measurementIdPresent: boolean;
      scriptInjected: boolean;
      scriptLoaded?: boolean;
      scriptLoadError?: boolean;
    };
  }
}

const isEnabled = Boolean(GA_MEASUREMENT_ID);

function gtag(...args: any[]) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag(...args);
}

export function initGA() {
  if (typeof window === "undefined") return;
  window.__ga4Status = {
    enabled: isEnabled,
    measurementIdPresent: Boolean(GA_MEASUREMENT_ID),
    scriptInjected: false,
    scriptLoaded: false,
    scriptLoadError: false,
  };
  if (!isEnabled) return;
  if (document.getElementById("ga4-script")) return;

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    if (window.__ga4Status) {
      window.__ga4Status.scriptLoaded = true;
      window.__ga4Status.scriptLoadError = false;
    }
  };
  script.onerror = () => {
    if (window.__ga4Status) {
      window.__ga4Status.scriptLoaded = false;
      window.__ga4Status.scriptLoadError = true;
    }
  };
  document.head.appendChild(script);
  window.__ga4Status.scriptInjected = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: any[]) {
      window.dataLayer?.push(args);
    };

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: IS_DEV,
  });
}

export function trackPageView(path: string) {
  if (!isEnabled) return;
  gtag("event", "page_view", {
    debug_mode: IS_DEV,
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : "",
    page_title: typeof document !== "undefined" ? document.title : "",
  });
}

export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {},
) {
  if (!isEnabled) return;
  gtag("event", eventName, {
    debug_mode: IS_DEV,
    ...params,
  });
}
