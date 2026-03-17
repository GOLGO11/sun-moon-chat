import type { AnalyticsEventName, DemoEvent, DemoSession } from "@/src/types/demo";

const sessionKey = "sun-moon-demo-session";
const analyticsKey = "sun-moon-demo-events";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readDemoSession(): DemoSession | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(sessionKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function storeDemoSession(session: DemoSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function trackDemoEvent(
  name: AnalyticsEventName,
  metadata?: Record<string, boolean | number | string>,
) {
  if (!isBrowser()) {
    return;
  }

  const existing = exportDemoEvents();
  const next: DemoEvent[] = [
    ...existing,
    {
      name,
      timestamp: new Date().toISOString(),
      metadata,
    },
  ];

  window.localStorage.setItem(analyticsKey, JSON.stringify(next));
}

export function exportDemoEvents(): DemoEvent[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(analyticsKey);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as DemoEvent[];
  } catch {
    return [];
  }
}

export function resetDemoStorage() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(sessionKey);
  window.localStorage.removeItem(analyticsKey);
}
