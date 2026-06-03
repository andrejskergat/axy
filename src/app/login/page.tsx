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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #2563EB 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, #111111 0%, #161616 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.1)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                  }}
                >
                  S
                </div>
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: "#2563EB", boxShadow: "0 0 8px #2563EB" }}
                />
              </div>
            </div>
            <h1
              className="text-3xl font-bold tracking-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Socialfin
            </h1>
            <p className="text-sm font-medium mt-1.5" style={{ color: "#2563EB" }}>
              Creative Intelligence
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
          />

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Welcome back</h2>
            <p className="text-sm mt-1" style={{ color: "#666" }}>
              Enter your access password to view creatives
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-2 uppercase tracking-wider"
                style={{ color: "#888" }}
              >
                Access Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 outline-none transition-all duration-200 text-sm"
                style={{
                  background: "#0A0A0A",
                  border: error
                    ? "1px solid rgba(239,68,68,0.6)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                }}
                onFocus={(e) => {
                  if (!error)
                    e.target.style.border = "1px solid rgba(37,99,235,0.6)";
                }}
                onBlur={(e) => {
                  if (!error)
                    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#FCA5A5",
                }}
              >
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading || !password
                  ? "rgba(37,99,235,0.4)"
                  : "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                boxShadow: loading || !password
                  ? "none"
                  : "0 4px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                cursor: loading || !password ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: "#444" }}>
            Socialfin &mdash; Confidential Client Materials
          </p>
        </div>
      </div>
    </div>
  );
}
