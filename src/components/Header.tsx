"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(240,235,225,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(18,33,58,0.08)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight" style={{ color: "#12213A" }}>
          <span style={{ color: "#1B6BF0" }}>social</span>fin
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(27,107,240,0.08)", color: "#1B6BF0" }}>
          Ad Creatives
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#1B6BF0", background: "rgba(27,107,240,0.08)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Creative
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#7A7A7A", background: "rgba(18,33,58,0.05)" }}
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
