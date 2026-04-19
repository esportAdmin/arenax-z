/**
 * broadcastOverlay.ts
 * ─────────────────────────────────────────────────────────────────────
 * Génère les fichiers HTML d'overlay broadcast pour chaque clip.
 * Ces fichiers sont passés au renderer qui les compose sur la vidéo.
 *
 * Design : fond transparent, typographie esport, couleur par accent.
 * Compatible avec : puppeteer screenshot, OBS browser source, ffmpeg drawtext.
 * ─────────────────────────────────────────────────────────────────────
 */

import fs from "node:fs/promises";
import type { OverlayAccent } from "@/lib/replay/export/cinematicPlanner";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface OverlayData {
  /** Titre principal en majuscules : "ACE MOMENT" */
  title:    string;
  /** Ligne secondaire : "02:14 · Clutch ⚡" */
  subtitle: string;
  accent:   OverlayAccent;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────

const ACCENT_COLORS: Record<OverlayAccent, { primary: string; glow: string }> = {
  danger:  { primary: "#f87171", glow: "rgba(248,113,113,0.35)" },
  accent:  { primary: "#22d3ee", glow: "rgba(34,211,238,0.35)"  },
  success: { primary: "#34d399", glow: "rgba(52,211,153,0.30)"  },
  neutral: { primary: "#ffffff", glow: "rgba(255,255,255,0.15)" },
};

// ─────────────────────────────────────────────
// TEMPLATE
// ─────────────────────────────────────────────

function buildOverlayHtml(data: OverlayData): string {
  const { primary, glow } = ACCENT_COLORS[data.accent];

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: transparent;
    font-family: "Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .overlay {
    display: inline-flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px 28px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }
  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${primary};
    box-shadow: 0 0 6px ${glow};
  }
  .title {
    font-size: 44px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${primary};
    text-shadow: 0 0 40px ${glow}, 0 0 80px ${glow};
  }
  .subtitle {
    font-size: 15px;
    font-weight: 500;
    color: rgba(255,255,255,0.60);
    letter-spacing: 0.01em;
  }
</style>
</head>
<body>
  <div class="overlay">
    <div class="badge">
      <span class="badge-dot"></span>
      ArenaX Broadcast
    </div>
    <div class="title">${escapeHtml(data.title)}</div>
    <div class="subtitle">${escapeHtml(data.subtitle)}</div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

/**
 * Écrit le fichier HTML d'overlay au chemin demandé.
 * Le renderer le lira depuis ce chemin pour le composer sur la vidéo.
 */
export async function writeOverlayCard(params: {
  filePath: string;
  data:     OverlayData;
}): Promise<string> {
  const html = buildOverlayHtml(params.data);
  await fs.writeFile(params.filePath, html, "utf8");
  return params.filePath;
}
