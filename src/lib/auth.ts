import fs from "fs";
import path from "path";

export interface AuthData {
  adminPassword: string;
  clientPassword: string;
  expiresAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  client: string;
  type: "image" | "video";
  url: string;
  mimeType?: string;
  tags: string[];
}

export type Role = "admin" | "client";

const AUTH_PATH = path.join(process.cwd(), "data", "auth.json");
const MEDIA_PATH = path.join(process.cwd(), "data", "media.json");

export function getAuthData(): AuthData | null {
  try {
    const raw = fs.readFileSync(AUTH_PATH, "utf-8");
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
}

export function validatePassword(password: string): { valid: boolean; role?: Role; reason?: string } {
  const auth = getAuthData();

  if (!auth) return { valid: false, reason: "No auth configuration found." };

  const now = new Date();
  const expiresAt = new Date(auth.expiresAt);

  if (now > expiresAt) return { valid: false, reason: "Access link has expired. Please request a new one." };

  if (password === auth.adminPassword) return { valid: true, role: "admin" };
  if (password === auth.clientPassword) return { valid: true, role: "client" };

  return { valid: false, reason: "Incorrect password." };
}

export function validateSession(sessionValue: string): { valid: boolean; role?: Role; reason?: string } {
  // session cookie format: "role:password"
  const sep = sessionValue.indexOf(":");
  if (sep === -1) return validatePassword(sessionValue); // legacy
  const password = sessionValue.slice(sep + 1);
  return validatePassword(password);
}

export function getRoleFromSession(sessionValue: string): Role | null {
  const result = validateSession(sessionValue);
  return result.valid ? (result.role ?? null) : null;
}

export function getMediaData(): MediaItem[] {
  try {
    const raw = fs.readFileSync(MEDIA_PATH, "utf-8");
    return JSON.parse(raw) as MediaItem[];
  } catch {
    return [];
  }
}

export const SESSION_COOKIE = "sb_session";
