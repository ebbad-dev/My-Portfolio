export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function isUsableHref(href?: string) {
  return Boolean(href && !href.startsWith("ADD_"));
}

export function trackEvent(name: string, data?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio-event", { detail: { name, data } }));
}
