#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const adminPassword = process.argv[2];
const clientPassword = process.argv[3];

if (!adminPassword || !clientPassword) {
  console.error("Usage: node scripts/generate-password.js <admin-password> <client-password>");
  console.error("Example: node scripts/generate-password.js adminSecret123 clientpass456");
  process.exit(1);
}

const now = new Date();
const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);

const authData = { adminPassword, clientPassword, expiresAt: expiresAt.toISOString() };

const authPath = path.join(__dirname, "..", "data", "auth.json");
const dataDir = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(authPath, JSON.stringify(authData, null, 2) + "\n");

console.log("✓ Passwords set successfully.");
console.log(`  Admin password:  ${adminPassword}`);
console.log(`  Client password: ${clientPassword}`);
console.log(`  Expires: ${expiresAt.toLocaleString()}`);
