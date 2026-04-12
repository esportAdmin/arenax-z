/**
 * existingReplayEngineAdapter.ts
 * ─────────────────────────────────────────────────────────────────────
 * Adapter concret — pilote le moteur replay existant via Puppeteer.
 *
 * Architecture :
 *   Worker (Node.js)
 *     → ExistingReplayEngineAdapter
 *       → puppeteer.launch()
 *         → /replay/render?secret=...  (page headless)
 *           → window.__REPLAY_API__   (moteur replay réel)
 *
 * Enregistrement vidéo :
 *   MediaRecorder (navigateur) capture le canvas WebGL du viewer.
 *   Les frames sont transférées en base64 via page.evaluate().
 *   Converties en Buffer Node.js puis écrites sur disque (outputPath).
 *   ffmpeg concat les segments ensuite.
 *
 * Pré-requis :
 *   npm install puppeteer
 *   Variable d'env : NEXT_PUBLIC_APP_URL, REPLAY_RENDERER_SECRET
 * ─────────────────────────────────────────────────────────────────────
 */

import fs                from "node:fs/promises";
import path              from "node:path";
import type { Browser, Page } from "puppeteer";
import type {
  ReplayEngineAdapter,
  CameraFocus,
}                        from "@/lib/replay/export/rendererBridge";
import type {
  SlowMotionWindow,
  TransitionType,
}                        from "@/lib/replay/export/cinematicPlanner";
import type { ReplayApi } from "@/lib/replay/replayRenderApi";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

function getRendererUrl(): string {
  const base   = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const secret = process.env.REPLAY_RENDERER_SECRET ?? "";
  return `${base}/replay/render${secret ? `?secret=${encodeURIComponent(secret)}` : ""}`;
}

/** Timeout d'attente que la page headless expose window.__REPLAY_API__ */
const API_READY_TIMEOUT_MS = 15_000;

// ─────────────────────────────────────────────
// ADAPTER
// ─────────────────────────────────────────────

export class ExistingReplayEngineAdapter implements ReplayEngineAdapter {
  private browser:  Browser | null = null;
  private page:     Page    | null = null;
  private readonly signal: AbortSignal | null;

  constructor(options?: { signal?: AbortSignal }) {
    this.signal = options?.signal ?? null;
  }

  private checkAborted(): void {
    if (this.signal?.aborted) {
      throw new Error("Replay export aborted (timeout)");
    }
  }

  // ── Initialisation de la page headless ─────────────────────────
  private async ensurePage(): Promise<Page> {
    if (this.page) return this.page;

    this.checkAborted();

    // Import dynamique — puppeteer n'est pas bundlé par Next.js
    const puppeteer = (await import("puppeteer")).default;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",           // pas de GPU en headless CI
        "--window-size=1280,720",
      ],
    });

    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Timeout étendu pour le chargement initial du viewer
    await page.goto(getRendererUrl(), {
      waitUntil: "networkidle0",
      timeout:   API_READY_TIMEOUT_MS,
    });

    // Attendre que window.__REPLAY_API__ soit exposé par la page
    await page.waitForFunction(
      () => !!(window as Window & { __REPLAY_READY__?: boolean }).__REPLAY_READY__,
      { timeout: API_READY_TIMEOUT_MS },
    );

    this.page = page;
    return page;
  }

  /**
   * Appelle une méthode de window.__REPLAY_API__ depuis le contexte navigateur.
   * Type-safe : fn reçoit le type ReplayApi et retourne le bon type.
   */
  private async call<R>(
    fn: (api: ReplayApi, ...args: unknown[]) => Promise<R>,
    ...args: unknown[]
  ): Promise<R> {
    this.checkAborted();
    const page = await this.ensurePage();

    return page.evaluate(
      async (fnSrc: string, fnArgs: unknown[]) => {
        const api = (window as Window & { __REPLAY_API__?: unknown }).__REPLAY_API__;
        if (!api) throw new Error("__REPLAY_API__ not available");
        // Reconstruit la fonction depuis sa source — seul moyen en page.evaluate
        const fn = new Function("api", "args", `return (${fnSrc})(api, ...args)`);
        return fn(api, fnArgs) as Promise<R>;
      },
      fn.toString(),
      args,
    ) as Promise<R>;
  }

  // ─────────────────────────────────────────────────────────────────
  // IMPLÉMENTATION ReplayEngineAdapter
  // ─────────────────────────────────────────────────────────────────

  async loadReplay(params: { warId: string; territoryId: string | null }): Promise<void> {
    await this.call(
      (api, warId, territoryId) => (api as ReplayApi).loadReplay({
        warId:       warId as string,
        territoryId: territoryId as string | null,
      }),
      params.warId,
      params.territoryId,
    );
  }

  async seek(offsetMs: number): Promise<void> {
    await this.call(
      (api, ms) => (api as ReplayApi).seek(ms as number),
      offsetMs,
    );
  }

  async focusCamera(focus: CameraFocus | null): Promise<void> {
    await this.call(
      (api, f) => (api as ReplayApi).focusCamera(
        f as { x: number | null; y: number | null; unitId: string | null } | null,
      ),
      focus,
    );
  }

  async setPlaybackRate(rate: number): Promise<void> {
    await this.call(
      (api, r) => (api as ReplayApi).setPlaybackRate(r as number),
      rate,
    );
  }

  async setSlowMotionWindow(slomo: SlowMotionWindow | null): Promise<void> {
    await this.call(
      (api, w) => (api as ReplayApi).setSlowMotionWindow(
        w as { startOffsetMs: number; endOffsetMs: number; playbackRate: number } | null,
      ),
      slomo,
    );
  }

  async startSegmentRecording(outputPath: string): Promise<void> {
    // Stocker outputPath — utilisé par stopSegmentRecording pour écrire le fichier
    this._currentOutputPath = outputPath;

    // Lance MediaRecorder côté navigateur — les frames sont bufferisées
    // dans recordedChunksRef jusqu'à stopSegmentRecording().
    await this.call(
      (api) => (api as ReplayApi).startRecording(),
    );
  }

  /**
   * Arrête MediaRecorder, récupère les frames en base64, écrit le fichier.
   * Le champ outputPath est stocké dans le contexte de renderClip —
   * ici on lit depuis l'instance courante (set lors de startSegmentRecording).
   */
  async stopSegmentRecording(): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    const base64 = await this.call(
      (api) => (api as ReplayApi).stopRecording(),
    );

    if (!this._currentOutputPath) {
      throw new Error("No outputPath set — call startSegmentRecording first");
    }

    // Décoder le base64 en Buffer et écrire sur disque
    const buffer = Buffer.from(base64 as string, "base64");
    await fs.mkdir(path.dirname(this._currentOutputPath), { recursive: true });
    await fs.writeFile(this._currentOutputPath, buffer);

    this._currentOutputPath = null;
  }

  /** Chemin de sortie du segment courant — set par startSegmentRecording */
  private _currentOutputPath: string | null = null;

  async applyTransition(_type: TransitionType, _phase: "in" | "out"): Promise<void> {
    // Les transitions sont implémentées via CSS/canvas dans la page headless.
    // TODO — si le viewer supporte les transitions : appeler via __REPLAY_API__.
  }

  async applyOverlay(overlayPath: string | null): Promise<void> {
    if (!overlayPath || !this.page) return;

    // Injecter le contenu HTML de l'overlay comme une couche transparente
    // par-dessus le canvas du viewer via page.evaluate.
    try {
      const html = await fs.readFile(overlayPath, "utf8");
      await this.page.evaluate((overlayHtml: string) => {
        const existing = document.getElementById("__replay-overlay__");
        if (existing) existing.remove();

        const div  = document.createElement("div");
        div.id     = "__replay-overlay__";
        div.style.cssText = [
          "position:fixed", "top:0", "left:0",
          "width:100%",     "height:100%",
          "pointer-events:none", "z-index:9999",
        ].join(";");
        div.innerHTML = overlayHtml;
        document.body.appendChild(div);
      }, html);
    } catch {
      // Non-bloquant — l'overlay est cosmétique
    }
  }

  async dispose(): Promise<void> {
    try {
      await this.page?.close();
      await this.browser?.close();
    } catch {
      // Silencieux — le process Puppeteer peut déjà être terminé
    } finally {
      this.page    = null;
      this.browser = null;
    }
  }
}
