/**
 * videoConcat.ts
 * ─────────────────────────────────────────────────────────────────────
 * Concatène des segments MP4 via ffmpeg (codec copy — pas de re-encode).
 *
 * Pré-requis : ffmpeg installé et dans le PATH.
 * Si ffmpeg absent → erreur explicite (concat est bloquant, pas best-effort).
 * ─────────────────────────────────────────────────────────────────────
 */

import fs   from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "pipe" });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", (err) => reject(new Error(`ffmpeg spawn error: ${err.message}`)));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg concat exited ${code}: ${stderr.slice(-500)}`));
    });
  });
}

/**
 * Concatène des segments MP4 vers outputPath.
 *
 * Cas particulier :
 *   - 0 segments → erreur
 *   - 1 segment  → copie directe (pas de ffmpeg)
 *   - N segments → concat via ffmpeg filter_complex concat ou concat demuxer
 */
export async function concatVideoSegments(params: {
  segmentPaths: string[];
  outputPath:   string;
}): Promise<string> {
  const { segmentPaths, outputPath } = params;

  if (segmentPaths.length === 0) {
    throw new Error("[videoConcat] No segments to concatenate");
  }

  // Créer le dossier de sortie si nécessaire
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Segment unique — copie directe
  if (segmentPaths.length === 1) {
    await fs.copyFile(segmentPaths[0], outputPath);
    return outputPath;
  }

  // Fichier de liste pour le concat demuxer ffmpeg
  // Format : file '/abs/path/to/segment.mp4'
  const listPath = path.join(path.dirname(outputPath), `concat-${Date.now()}.txt`);

  const listContent = segmentPaths
    .map((p) => `file '${p.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`)
    .join("\n");

  await fs.writeFile(listPath, listContent, "utf8");

  try {
    await runFfmpeg([
      "-y",
      "-f",     "concat",
      "-safe",  "0",
      "-i",     listPath,
      "-c",     "copy",   // pas de re-encode — rapide
      outputPath,
    ]);
  } finally {
    // Nettoyer le fichier liste même en cas d'erreur
    await fs.unlink(listPath).catch(() => {});
  }

  return outputPath;
}
