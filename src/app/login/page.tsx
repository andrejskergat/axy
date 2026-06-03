"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          <span className="text-3xl font-bold tracking-tight" style={{ color: "#12213A" }}>
            <span style={{ color: "#1B6BF0" }}>social</span>fin
          </span>
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
            This link expires 72 hours after it was shared.
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

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200"
              style={{
                background: loading || !password ? "#A0B4E0" : "#1B6BF0",
                cursor: loading || !password ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying…" : "Access Dashboard →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#B0A99F" }}>
          Socialfin — For authorised recipients only
        </p>
      </div>
    </div>
  );
}
