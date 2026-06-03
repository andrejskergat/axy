import fs from "fs";
import path from "path";

export interface AuthData {
  password: string;
  expiresAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  client: string;
  type: "image" | "video";
  filename: string;
  tags: string[];
}

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

export function validatePassword(password: string): { valid: boolean; reason?: string } {
  const auth = getAuthData();

  if (!auth) {
    return { valid: false, reason: "No auth configuration found. Run the generate-password script first." };
  }

  const now = new Date();
  const expiresAt = new Date(auth.expiresAt);

  if (now > expiresAt) {
    return { valid: false, reason: "Access link has expired. Please request a new one." };
  }

  if (password !== auth.password) {
    return { valid: false, reason: "Incorrect password." };
  }

  return { valid: true };
}

export function validateSession(sessionPassword: string): { valid: boolean; reason?: string } {
  return validatePassword(sessionPassword);
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
