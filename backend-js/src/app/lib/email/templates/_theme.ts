export const theme = {
  bg: {
    darkest: "#0e0b16",
    dark: "#1a1626",
    surface: "#231d35",
    elevated: "#2d2545",
  },
  accent: {
    primary: "#7c3aed",
    hover: "#6d28d9",
    light: "#a78bfa",
    subtle: "#3d2960",
  },
  text: {
    primary: "#f5f3ff",
    secondary: "#a89dc4",
    muted: "#6b5b8a",
    onAccent: "#ffffff",
  },
  border: {
    normal: "#3d3358",
    strong: "#5a4b81",
    focus: "#7c3aed",
  },
  status: {
    pending: { fg: "#f59e0b", bg: "#3d2e0a" },
    assigned: { fg: "#3b82f6", bg: "#0f1f3d" },
    inTransit: { fg: "#a78bfa", bg: "#2d1f4d" },
    delivered: { fg: "#10b981", bg: "#0a2e20" },
    undelivered: { fg: "#f97316", bg: "#3d1f0a" },
    failed: { fg: "#ef4444", bg: "#3d0f0f" },
    login: { fg: "#fbbf24", bg: "#3d2e0a" },
    neutral: { fg: "#a78bfa", bg: "#2d1f4d" },
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "18px",
    pill: "9999px",
  },
  shadow: {
    card: "0 24px 60px rgba(0, 0, 0, 0.48)",
    glow: "0 18px 36px rgba(124, 58, 237, 0.22)",
  },
  font:
    "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
} as const;

export type StatusPalette = (typeof theme.status)[keyof typeof theme.status];
