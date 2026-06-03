"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

interface UploadItem {
  file: File;
  title: string;
  client: string;
  tags: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  preview: string;
}

export default function AdminClient() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const newItems: UploadItem[] = arr.map((file) => ({
      file,
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      client: "",
      tags: "",
      status: "pending",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const updateItem = (index: number, field: keyof UploadItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== "pending") continue;
      if (!items[i].client.trim()) {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error", error: "Client name is required" } : item
          )
        );
        continue;
      }

      setItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: "uploading" } : item))
      );

      const fd = new FormData();
      fd.append("file", items[i].file);
      fd.append("title", items[i].title || items[i].file.name);
      fd.append("client", items[i].client);
      fd.append("tags", items[i].tags);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setItems((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: "done" } : item))
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setItems((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: "error", error: message } : item))
        );
      }
    }
  };

  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tight">
            Social<span className="text-[#2563EB]">fin</span>
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/60 text-sm">Upload Creatives</span>
        </div>
        <Link
          href="/"
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-14 text-center mb-8 ${
            dragging
              ? "border-[#2563EB] bg-[#2563EB]/10"
              : "border-white/20 hover:border-white/40 hover:bg-white/5"
          }`}
        >
          <div className="text-5xl mb-4">+</div>
          <p className="text-white/70 text-lg font-medium">Drop images & videos here</p>
          <p className="text-white/30 text-sm mt-1">or click to browse — JPG, PNG, GIF, WEBP, MP4, MOV, WEBM</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>

        {/* File list */}
        {items.length > 0 && (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 flex gap-4 items-start transition-colors ${
                    item.status === "done"
                      ? "border-green-500/30 bg-green-500/5"
                      : item.status === "error"
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {/* Preview */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
                    {item.preview ? (
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">▶</span>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => updateItem(i, "title", e.target.value)}
                      disabled={item.status !== "pending"}
                      className="col-span-2 bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50"
                    />
                    <input
                      type="text"
                      placeholder="Client *"
                      value={item.client}
                      onChange={(e) => updateItem(i, "client", e.target.value)}
                      disabled={item.status !== "pending"}
                      className="bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50"
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={item.tags}
                      onChange={(e) => updateItem(i, "tags", e.target.value)}
                      disabled={item.status !== "pending"}
                      className="col-span-2 bg-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50"
                    />
                    <div className="flex items-center justify-end">
                      {item.status === "pending" && (
                        <button
                          onClick={() => removeItem(i)}
                          className="text-white/30 hover:text-red-400 text-sm transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      {item.status === "uploading" && (
                        <span className="text-[#2563EB] text-sm animate-pulse">Uploading…</span>
                      )}
                      {item.status === "done" && (
                        <span className="text-green-400 text-sm">✓ Uploaded</span>
                      )}
                      {item.status === "error" && (
                        <span className="text-red-400 text-xs">{item.error}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pendingCount > 0 && (
              <button
                onClick={uploadAll}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Upload {pendingCount} file{pendingCount !== 1 ? "s" : ""}
              </button>
            )}

            {pendingCount === 0 && items.every((i) => i.status === "done") && (
              <div className="text-center py-4">
                <p className="text-green-400 font-medium mb-4">All files uploaded successfully!</p>
                <Link
                  href="/"
                  className="inline-block bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  View Dashboard →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
