export const COLORS = {
  bg: {
    ocean:     "#0a1628",
    panel:     "#1A2132",
    panelDark: "#202A3C",
    card:      "#1e293b",
  },
  territory: {
    france:  { base: "#FF0000", glow: "rgba(255,0,0,0.6)",     border: "#dc2626" },
    spain:   { base: "#FFA500", glow: "rgba(255,165,0,0.5)",   border: "#ff8c00" },
    poland:  { base: "#FFFF00", glow: "rgba(255,255,0,0.5)",   border: "#ffd700" },
    italy:   { base: "#ADD8E6", glow: "rgba(173,216,230,0.4)", border: "#87ceeb" },
    inactive:{ base: "#3A4555", glow: "rgba(58,69,85,0.2)",    border: "#4b5563" },
  },
  club: {
    alpha: "#2196F3",
    omega: "#FF0000",
    sigma: "#FFFF00",
    gamma: "#4CAF50",
  },
  priority: {
    critical: "#FF0000",
    high:     "#4CAF50",
    medium:   "#6B7280",
  },
  ui: {
    gold:    "#FFD700",
    xpBar:   "#2196F3",
    success: "#4CAF50",
    warning: "#FFA500",
  },
  text: {
    primary:   "#FFFFFF",
    secondary: "#CBD5E1",
    muted:     "#64748B",
  },
} as const;
