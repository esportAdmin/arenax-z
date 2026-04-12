/**
 * audioPost.ts
 * ─────────────────────────────────────────────────────────────────────
 * Post-traitement audio des segments vidéo via ffmpeg.
 *
 * Best-effort : si ffmpeg est absent, les fonctions retournent
 * immédiatement sans lancer d'exception — l'export continue
 * avec l'audio non traité.
 *
 * Opérations disponibles :
 *   normalizeAudio    — normalize loudness EBU R128 (broadcast standard)
 *   addImpactBoost    — compresseur sur moments d'impact (clutch / ACE)
 *   processAudio      — façade qui applique le bon traitement selon AudioTreatment
 * ─────────────────────────────────────────────────────────────────────
 */

import { spawn }  from "node:child_process";
import path       from "node:path";
import type { AudioTreatment } from "@/lib/replay/export/cinematicPlanner";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Vérifie si ffmpeg est disponible sur le système.
 * Résultat mis en cache — un seul spawn par process.
 */
let ffmpegAvailable: boolean | null = null;

async function checkFfmpeg(): Promise<boolean> {
  if (ffmpegAvailable !== null) return ffmpegAvailable;

  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn("ffmpeg", ["-version"], { stdio: "ignore" });
      proc.on("close", (code) => (code === 0 ? resolve() : reject()));
      proc.on("error", reject);
    });
    ffmpegAvailable = true;
  } catch {
    ffmpegAvailable = false;
    console.warn("[audioPost] ffmpeg not found — audio processing skipped");
  }

  return ffmpegAvailable;
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "pipe" });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-300)}`));
    });
  });
}

// ─────────────────────────────────────────────
// OPÉRATIONS AUDIO
// ─────────────────────────────────────────────

/**
 * Normalise le loudness selon EBU R128 — standard broadcast (-16 LUFS).
 * Retourne inputPath si ffmpeg absent (best-effort).
 */
export async function normalizeAudio(
  inputPath:  string,
  outputPath: string,
): Promise<string> {
  if (!(await checkFfmpeg())) return inputPath;

  try {
    await runFfmpeg([
      "-y", "-i", inputPath,
      "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
      outputPath,
    ]);
    return outputPath;
  } catch (err) {
    console.warn("[audioPost] normalizeAudio failed (using original):", err);
    return inputPath;
  }
}

/**
 * Compresseur audio dynamique pour amplifier les moments d'impact.
 * Retourne inputPath si ffmpeg absent.
 */
export async function addImpactBoost(
  inputPath:  string,
  outputPath: string,
): Promise<string> {
  if (!(await checkFfmpeg())) return inputPath;

  try {
    await runFfmpeg([
      "-y", "-i", inputPath,
      "-af", "acompressor=threshold=-18dB:ratio=2.5:attack=5:release=50,loudnorm=I=-14:TP=-1:LRA=11",
      outputPath,
    ]);
    return outputPath;
  } catch (err) {
    console.warn("[audioPost] addImpactBoost failed (using original):", err);
    return inputPath;
  }
}

/**
 * Façade — applique le bon traitement selon AudioTreatment.
 * Gère les fichiers temporaires intermédiaires.
 * Retourne toujours un chemin valide (inputPath en fallback).
 */
export async function processAudio(
  inputPath:  string,
  outputDir:  string,
  suffix:     string,
  treatment:  AudioTreatment,
): Promise<string> {
  if (treatment === "normal") return inputPath;

  const outputPath = path.join(outputDir, `${suffix}-audio.mp4`);

  if (treatment === "impact_boost") {
    return addImpactBoost(inputPath, outputPath);
  }

  if (treatment === "duck_ambience") {
    // Duck ambience = normalize légèrement plus agressive
    return normalizeAudio(inputPath, outputPath);
  }

  return inputPath;
}
