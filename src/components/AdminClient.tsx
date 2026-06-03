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

interface AddedItem {
  id: string;
  title: string;
  client: string;
  type: "image" | "video";
}

const EMPTY: FormState = { title: "", client: "", type: "image", url: "", tags: "" };

export default function AdminClient() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
          >
            S
          </div>
          <span className="font-bold tracking-tight">Social<span className="text-[#2563EB]">fin</span></span>
          <span className="text-white/30">/</span>
          <span className="text-white/50 text-sm">Add Creative</span>
        </div>
        <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors">
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Add a Creative</h1>
        <p className="text-white/40 text-sm mb-8">
          Upload your file to Google Drive, set sharing to <strong className="text-white/60">"Anyone with the link"</strong>, then paste the link here.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Google Drive URL *</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/file/d/..."
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Title *</label>
              <input
                type="text"
                required
                placeholder="Campaign name"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Client *</label>
              <input
                type="text"
                required
                placeholder="Client name"
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Type *</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as "image" | "video")}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Tags</label>
              <input
                type="text"
                placeholder="instagram, static"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
              />
            </div>
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {status === "saving" ? "Saving…" : "Add to Dashboard"}
          </button>
        </form>

        {/* Added items */}
        {added.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Added this session</p>
            <div className="space-y-2">
              {added.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/40">{item.client} · {item.type}</p>
                  </div>
                  <span className="text-green-400 text-xs">✓ Added</span>
                </div>
              ))}
            </div>
            <Link
              href="/"
              className="mt-4 inline-block w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              View Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
