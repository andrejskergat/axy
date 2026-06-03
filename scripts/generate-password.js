#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/generate-password.js <password>");
  console.error("Example: node scripts/generate-password.js mypassword123");
  process.exit(1);
}

const now = new Date();
const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now

const authData = {
  password,
  expiresAt: expiresAt.toISOString(),
};

const authPath = path.join(__dirname, "..", "data", "auth.json");
const dataDir = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(authPath, JSON.stringify(authData, null, 2) + "\n");

console.log("✓ Password set successfully.");
console.log(`  Password: ${password}`);
console.log(`  Expires:  ${expiresAt.toLocaleString()} (${expiresAt.toISOString()})`);
console.log(`  Written to: ${authPath}`);
