"use client";

/**
 * useAnalytics.ts
 * ─────────────────────────────────────────────────────────────────────
 * Hook client pour tracker les événements produit vers /api/analytics.
 *
 * Events standards :
 *   page_view, match_started, match_abandoned, queue_joined,
 *   queue_cancelled, profile_updated, highlight_clicked, export_started
 * ─────────────────────────────────────────────────────────────────────
 */

import { useCallback, useRef } from "react";

type EventProperties = Record<string, string | number | boolean | null>;

interface AnalyticsEvent {
  event_type:  string;
  properties?: EventProperties;
}

// ─────────────────────────────────────────────
// BATCH QUEUE — envoie en batch pour éviter le spam réseau
// ─────────────────────────────────────────────

const eventQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (eventQueue.length === 0) return;
  const batch = eventQueue.splice(0, eventQueue.length);

  fetch("/api/analytics/batch", {
    method:    "POST",
    headers:   { "Content-Type": "application/json" },
    body:      JSON.stringify({ events: batch }),
    keepalive: true, // survit à la fermeture de page
  }).catch(() => {});
}

function queueEvent(event: AnalyticsEvent) {
  eventQueue.push(event);

  if (flushTimer) clearTimeout(flushTimer);
  // Flush après 2s d'inactivité ou quand 10 events sont accumulés
  if (eventQueue.length >= 10) {
    flush();
  } else {
    flushTimer = setTimeout(flush, 2_000);
  }
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAnalytics() {
  const sessionId = useRef<string>(
    typeof crypto !== "undefined"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10),
  );

  const track = useCallback((
    eventType:  string,
    properties: EventProperties = {},
  ) => {
    queueEvent({
      event_type:  eventType,
      properties: {
        ...properties,
        session_id: sessionId.current,
        url:        typeof window !== "undefined" ? window.location.pathname : "",
        ts:         Date.now(),
      },
    });
  }, []);

  const trackPageView = useCallback((page?: string) => {
    track("page_view", { page: page ?? (typeof window !== "undefined" ? window.location.pathname : "") });
  }, [track]);

  return { track, trackPageView };
}
