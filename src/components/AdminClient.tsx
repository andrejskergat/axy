"use client";

import { useState } from "react";
import Link from "next/link";

interface FormState {
  title: string;
  client: string;
  type: "image" | "video";
  url: string;
  tags: string;
}

interface AddedItem { id: string; title: string; type: "image" | "video"; }

const EMPTY: FormState = { title: "", client: "", type: "image", url: "", tags: "" };

export default function AdminClient() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [added, setAdded] = useState<AddedItem[]>([]);

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          client: form.client,
          type: form.type,
          url: form.url,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setAdded((prev) => [...prev, data.item]);
      setForm(EMPTY);
      setStatus("idle");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0EBE1" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(240,235,225,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(18,33,58,0.08)" }}
      >
        <span className="text-xl font-bold" style={{ color: "#12213A" }}>
          <span style={{ color: "#1B6BF0" }}>social</span>fin
          <span className="text-sm font-normal ml-2" style={{ color: "#A8A29E" }}>/ Add Creative</span>
        </span>
        <Link href="/" className="text-sm font-medium" style={{ color: "#7A7A7A" }}>← Dashboard</Link>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#12213A" }}>Add a Creative</h1>
        <p className="text-sm mb-4" style={{ color: "#9A9A9A" }}>
          Upload to Google Drive → right-click → Share → <strong>Anyone with the link</strong> → paste URL below.
        </p>
        <div className="rounded-xl px-4 py-3 mb-6 text-sm" style={{ background: "#FEF3EE", border: "1px solid #F5C9B3", color: "#C05A2A" }}>
          <strong>Videos must be MP4.</strong> MOV files cannot be embedded or protected. Convert to MP4 before uploading.
        </div>

        <div className="rounded-2xl p-8" style={{ background: "#fff", border: "1px solid rgba(18,33,58,0.08)", boxShadow: "0 2px 12px rgba(18,33,58,0.06)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A7A7A" }}>Google Drive URL *</label>
              <input
                type="url" required
                placeholder="https://drive.google.com/file/d/..."
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{ background: "#F6F3EE", border: "1.5px solid transparent", color: "#12213A" }}
                onFocus={(e) => e.target.style.border = "1.5px solid #1B6BF0"}
                onBlur={(e) => e.target.style.border = "1.5px solid transparent"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A7A7A" }}>Title *</label>
                <input
                  type="text" required placeholder="Campaign name"
                  value={form.title} onChange={(e) => set("title", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={{ background: "#F6F3EE", border: "1.5px solid transparent", color: "#12213A" }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #1B6BF0"}
                  onBlur={(e) => e.target.style.border = "1.5px solid transparent"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A7A7A" }}>Type *</label>
                <select
                  value={form.type} onChange={(e) => set("type", e.target.value as "image" | "video")}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={{ background: "#F6F3EE", border: "1.5px solid transparent", color: "#12213A" }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A7A7A" }}>Tags (comma separated)</label>
              <input
                type="text" placeholder="facebook, static, tiktok"
                value={form.tags} onChange={(e) => set("tags", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: "#F6F3EE", border: "1.5px solid transparent", color: "#12213A" }}
                onFocus={(e) => e.target.style.border = "1.5px solid #1B6BF0"}
                onBlur={(e) => e.target.style.border = "1.5px solid transparent"}
              />
            </div>

            {status === "error" && <p className="text-sm" style={{ color: "#E07B5A" }}>{error}</p>}

            <button
              type="submit" disabled={status === "saving"}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors"
              style={{ background: status === "saving" ? "#A0B4E0" : "#1B6BF0", cursor: status === "saving" ? "not-allowed" : "pointer" }}
            >
              {status === "saving" ? "Saving…" : "Add to Dashboard"}
            </button>
          </form>
        </div>

        {added.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "#A8A29E" }}>Added this session</p>
            <div className="space-y-2">
              {added.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#fff", border: "1px solid rgba(18,33,58,0.08)" }}>
                  <span className="text-sm font-medium" style={{ color: "#12213A" }}>{item.title}</span>
                  <span className="text-xs" style={{ color: "#1B6BF0" }}>✓ Added</span>
                </div>
              ))}
            </div>
            <Link href="/" className="mt-4 block text-center py-3 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: "#12213A" }}>
              View Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
