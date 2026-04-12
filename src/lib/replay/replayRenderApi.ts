/**
 * replayRenderApi.ts
 * ─────────────────────────────────────────────────────────────────────
 * Types partagés pour window.__REPLAY_API__.
 *
 * Importé par :
 *   - app/replay/render/page.tsx  (expose l'API sur window)
 *   - existingReplayEngineAdapter.ts (typage des appels page.evaluate)
 *
 * Aucune dépendance externe — module de types pur.
 * ─────────────────────────────────────────────────────────────────────
 */

export interface ReplayApiFocus {
  x:      number | null;
  y:      number | null;
  unitId: string | null;
}

export interface ReplayApiSlowMotion {
  startOffsetMs: number;
  endOffsetMs:   number;
  playbackRate:  number;
}

/**
 * Contrat de l'API exposée sur window.__REPLAY_API__ par la page headless.
 * Toutes les méthodes retournent Promise<void> pour être await-ables
 * depuis page.evaluate() de Puppeteer.
 */
export interface ReplayApi {
  /** Charge le replay d'une war */
  loadReplay(params: { warId: string; territoryId: string | null }): Promise<void>;
  /** Se positionne au timestamp (ms depuis début du match) */
  seek(offsetMs: number): Promise<void>;
  /** Positionne la caméra — null = autofocus */
  focusCamera(focus: ReplayApiFocus | null): Promise<void>;
  /** Vitesse de lecture (1 = normale, 0.3 = slow-mo) */
  setPlaybackRate(rate: number): Promise<void>;
  /** Fenêtre de slow motion — null pour désactiver */
  setSlowMotionWindow(window: ReplayApiSlowMotion | null): Promise<void>;
  /** Lance l'enregistrement — retourne un token de session */
  startRecording(): Promise<string>;
  /** Arrête l'enregistrement — retourne les frames encodées en base64 */
  stopRecording(): Promise<string>;
}

declare global {
  interface Window {
    __REPLAY_API__?: ReplayApi;
  }
}
