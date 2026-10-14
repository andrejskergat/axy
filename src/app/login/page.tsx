"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F0EBE1" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/socialfin-logo.webp?v=2" alt="SocialFin" width={160} height={48} style={{ height: "40px", width: "auto", objectFit: "contain", display: "block" }} />
          </div>
          <p className="text-sm mt-2" style={{ color: "#7A7A7A" }}>
            Confidential Client Creatives
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#fff",
            border: "1px solid rgba(18,33,58,0.08)",
            boxShadow: "0 4px 24px rgba(18,33,58,0.08)",
          }}
        >
          <h2 className="text-lg font-semibold mb-1" style={{ color: "#12213A" }}>Enter your password</h2>
          <p className="text-sm mb-6" style={{ color: "#9A9A9A" }}>
            This link expires 48 hours after it was shared.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access password"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: "#F6F3EE",
                border: error ? "1.5px solid #E07B5A" : "1.5px solid transparent",
                color: "#12213A",
              }}
              onFocus={(e) => { if (!error) e.target.style.border = "1.5px solid #1B6BF0"; }}
              onBlur={(e) => { if (!error) e.target.style.border = "1.5px solid transparent"; }}
            />

            {error && (
              <p className="text-sm" style={{ color: "#E07B5A" }}>{error}</p>
            )}

            <label className="flex items-start gap-3 text-xs leading-relaxed cursor-pointer" style={{ color: "#5F6470" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1B6BF0]"
              />
              <span>I have read the confidentiality notice and agree not to copy or share the materials, access link or password.</span>
            </label>

            <button
              type="submit"
              disabled={loading || !password || !agreed}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200"
              style={{
                background: loading || !password || !agreed ? "#A0B4E0" : "#1B6BF0",
                cursor: loading || !password || !agreed ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying…" : "View Portfolio →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#B0A99F" }}>
          Socialfin — For authorised recipients only
        </p>
        <div className="mt-8 pt-5 border-t" style={{ borderColor: "rgba(18,33,58,0.12)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#12213A" }}>Confidentiality Notice</p>
          <div className="space-y-2 text-xs leading-relaxed" style={{ color: "#7A7A7A" }}>
            <p>SocialFin provides access to this portfolio solely for the authorised recipient’s private review. The portfolio contains client work and confidential materials.</p>
            <p>You must not copy, download, screenshot, record, reproduce, publish, distribute or otherwise share any materials without SocialFin’s prior written permission. You must not share the access link or password with anyone else.</p>
            <p>All intellectual property rights remain with their respective owners. Access does not grant permission to reuse or adapt any materials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
