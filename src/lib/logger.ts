type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
}

const isDevelopment = process.env.NODE_ENV === "development";

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

function formatLogEntry(entry: LogEntry): string {
  const timestamp = entry.timestamp.toISOString();
  const base = `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  return entry.data !== undefined
    ? `${base} | data=${safeStringify(entry.data)}`
    : base;
}

function log(level: LogLevel, message: string, data?: unknown) {
  const entry: LogEntry = { level, message, data, timestamp: new Date() };

  // En prod : on limite aux warnings / erreurs
  if (!isDevelopment && level !== "warn" && level !== "error") return;

  const formatted = formatLogEntry(entry);

  if (level === "error") console.error(formatted);
  else if (level === "warn") console.warn(formatted);
  else if (level === "info") console.info(formatted);
  else console.debug(formatted);
}

export const logger = {
  debug: (message: string, data?: unknown) => log("debug", message, data),
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
};
