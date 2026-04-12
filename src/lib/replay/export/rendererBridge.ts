/**
 * rendererBridge.ts
 * ─────────────────────────────────────────────────────────────────────
 * Interface unique entre le worker d'export et le moteur replay.
 *
 * Contrat :
 *   ReplayEngineAdapter  — interface à implémenter par le vrai renderer
 *   StubReplayEngineAdapter — implémentation safe sans dépendance
 *   ReplayRendererBridge    — orchestre le rendu d'un clip complet
 *
 * Branchement du renderer réel (une seule ligne à changer) :
 *   Dans createReplayRendererBridge(), remplacer :
 *     new StubReplayEngineAdapter()
 *   par :
 *     new ExistingReplayEngineAdapter()
 * ─────────────────────────────────────────────────────────────────────
 */

import fs   from "node:fs/promises";
import path from "node:path";
import os   from "node:os";
import type { HighlightClip } from "@/lib/replay/highlightReel";
import type {
  SlowMotionWindow,
  TransitionType,
} from "@/lib/replay/export/cinematicPlanner";

// ─────────────────────────────────────────────
// TYPES EXPORTÉS
// ─────────────────────────────────────────────

export interface RendererCinematicOptions {
  transitionIn:  TransitionType;
  transitionOut: TransitionType;
  /** Vitesse globale du clip (1 = normale) */
  playbackRate:  number;
  /** Fenêtre de slow-motion — null si pas de ralenti */
  slowMotion:    SlowMotionWindow | null;
  /** Chemin vers le fichier HTML d'overlay broadcast */
  overlayPath:   string | null;
}

export interface RenderClipInput {
  warId:       string;
  territoryId: string | null;
  clip:        HighlightClip;
  /** Répertoire de travail temporaire */
  outputDir:   string;
  /** Chemin de sortie exact du segment MP4 */
  outputPath:  string;
  /** Metadata cinématique — optionnel (best-effort) */
  cinematic?:  RendererCinematicOptions;
}

export interface CameraFocus {
  x:      number | null;
  y:      number | null;
  unitId: string | null;
}

/**
 * Interface à implémenter par le renderer réel.
 * Toutes les méthodes sont async — le renderer peut être headless ou remote.
 */
export interface ReplayEngineAdapter {
  /** Charge le replay d'une war depuis le stockage */
  loadReplay(params: { warId: string; territoryId: string | null }): Promise<void>;
  /** Se positionne au timestamp demandé (ms depuis début) */
  seek(offsetMs: number): Promise<void>;
  /** Positionne la caméra — null = autofocus */
  focusCamera(focus: CameraFocus | null): Promise<void>;
  /** Définit la vitesse de lecture (1 = normale, 0.3 = slow-mo) */
  setPlaybackRate(rate: number): Promise<void>;
  /** Applique une fenêtre de slow-motion — null pour désactiver */
  setSlowMotionWindow(window: SlowMotionWindow | null): Promise<void>;
  /** Démarre l'enregistrement vers outputPath */
  startSegmentRecording(outputPath: string): Promise<void>;
  /** Stoppe l'enregistrement et flush le fichier */
  stopSegmentRecording(): Promise<void>;
  /** Applique une transition (in = début du clip, out = fin) */
  applyTransition(type: TransitionType, phase: "in" | "out"): Promise<void>;
  /** Compose un overlay HTML sur la frame — optionnel */
  applyOverlay?(overlayPath: string | null): Promise<void>;
  /** Libère les ressources */
  dispose(): Promise<void>;
}

// ─────────────────────────────────────────────
// STUB — safe, sans dépendance externe
// ─────────────────────────────────────────────

/**
 * Implémentation stub — écrit un fichier placeholder.
 * Toutes les opérations sont no-op sauf startSegmentRecording
 * qui crée le fichier de sortie pour que la suite du pipeline fonctionne.
 */
export class StubReplayEngineAdapter implements ReplayEngineAdapter {
  private currentOutputPath: string | null = null;

  async loadReplay(_params: { warId: string; territoryId: string | null }): Promise<void> {}
  async seek(_offsetMs: number): Promise<void> {}
  async focusCamera(_focus: CameraFocus | null): Promise<void> {}
  async setPlaybackRate(_rate: number): Promise<void> {}
  async setSlowMotionWindow(_window: SlowMotionWindow | null): Promise<void> {}
  async applyTransition(_type: TransitionType, _phase: "in" | "out"): Promise<void> {}
  async applyOverlay(_overlayPath: string | null): Promise<void> {}
  async dispose(): Promise<void> {}

  async startSegmentRecording(outputPath: string): Promise<void> {
    this.currentOutputPath = outputPath;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
  }

  async stopSegmentRecording(): Promise<void> {
    if (!this.currentOutputPath) return;
    // Fichier placeholder — le pipeline concat doit gérer un contenu vide
    await fs.writeFile(this.currentOutputPath, Buffer.alloc(0));
    this.currentOutputPath = null;
  }
}

// ─────────────────────────────────────────────
// BRIDGE
// ─────────────────────────────────────────────

import { ExistingReplayEngineAdapter } from "@/lib/replay/export/existingReplayEngineAdapter";

type EngineFactory = (signal?: AbortSignal) => Promise<ReplayEngineAdapter>;

export class ReplayRendererBridge {
  constructor(private readonly engineFactory: EngineFactory) {}

  /**
   * Rend un clip complet avec toutes les options cinématiques.
   * - signal : AbortSignal du worker — si déclenché (timeout), le rendu
   *   est coupé proprement via checkAborted() dans l'adapter.
   * - Chaque étape cinématique est best-effort (.catch) — pas de crash
   *   si le renderer ne supporte pas encore la méthode.
   */
  async renderClip(input: RenderClipInput, signal?: AbortSignal): Promise<string> {
    const engine = await this.engineFactory(signal);

    try {
      await engine.loadReplay({ warId: input.warId, territoryId: input.territoryId });

      // ── Seek ──────────────────────────────────────────────────────
      await engine.seek(input.clip.startOffsetMs);

      // ── Caméra ────────────────────────────────────────────────────
      // focusX/Y issus de aim_lng/aim_lat dans battle_abilities.
      // unitId non disponible dans le schéma DB actuel (battle_abilities
      // ne stocke pas d'unit_id) — extension future si le schéma évolue.
      const focus: CameraFocus = {
        x:      input.clip.focusX  ?? null,
        y:      input.clip.focusY  ?? null,
        unitId: null,
      };
      await engine.focusCamera(focus);

      // ── Options cinématiques (best-effort) ────────────────────────
      if (input.cinematic) {
        await engine.setPlaybackRate(input.cinematic.playbackRate).catch(() => {});
        await engine.setSlowMotionWindow(input.cinematic.slowMotion).catch(() => {});

        if (input.cinematic.overlayPath && engine.applyOverlay) {
          await engine.applyOverlay(input.cinematic.overlayPath).catch(() => {});
        }

        await engine.applyTransition(input.cinematic.transitionIn, "in").catch(() => {});
      }

      // ── Enregistrement ────────────────────────────────────────────
      await engine.startSegmentRecording(input.outputPath);

      const clipDurationMs = Math.max(
        1_000,
        input.clip.endOffsetMs - input.clip.startOffsetMs,
      );
      await new Promise<void>((resolve) => setTimeout(resolve, clipDurationMs));

      if (input.cinematic) {
        await engine.applyTransition(input.cinematic.transitionOut, "out").catch(() => {});
      }

      await engine.stopSegmentRecording();

      return input.outputPath;
    } finally {
      await engine.dispose().catch(() => {});
    }
  }
}

// ─────────────────────────────────────────────
// FACTORY & HELPERS
// ─────────────────────────────────────────────

/**
 * Factory — instancie le bridge branché sur ExistingReplayEngineAdapter.
 *
 * Pour brancher le vrai moteur, modifier uniquement ExistingReplayEngineAdapter
 * dans src/lib/replay/export/existingReplayEngineAdapter.ts.
 * Ce fichier n'a pas besoin d'être touché.
 */
export async function createReplayRendererBridge(): Promise<ReplayRendererBridge> {
  return new ReplayRendererBridge(
    async (signal) => new ExistingReplayEngineAdapter({ signal }),
  );
}

/** Crée (ou réutilise) un répertoire temporaire isolé par jobId */
export async function createTemporaryRenderDirectory(jobId: string): Promise<string> {
  const dir = path.join(os.tmpdir(), "arena-replay-export", jobId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}
