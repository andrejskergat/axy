"use client";

import { MediaItem } from "@/lib/auth";
import { useState } from "react";

function gdriveThumbnail(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  return "";
}

function gdriveEmbed(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

function gdriveDirect(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  return url;
}

function ImageModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(18,33,58,0.9)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
      >
        ✕
      </button>
      <div
        className="relative flex flex-col items-center"
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gdriveDirect(item.url)}
          alt={item.title}
          style={{ maxWidth: "90vw", maxHeight: "80vh", width: "auto", height: "auto", display: "block", borderRadius: "12px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
        />
        <p className="mt-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>{item.title}</p>
      </div>
    </div>
  );
}

function VideoModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(18,33,58,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{ background: "#000", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
        >
          ✕
        </button>

        {/* Embed */}
        <div style={{ paddingTop: "56.25%", position: "relative" }}>
          <iframe
            src={gdriveEmbed(item.url)}
            allow="autoplay"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>

        {/* Title */}
        <div className="px-4 py-3" style={{ background: "#111" }}>
          <p className="text-sm font-semibold text-white">{item.title}</p>
          {item.tags.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.08)", color: "#aaa" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaCard({ item, isAdmin, onDeleted }: { item: MediaItem; isAdmin: boolean; onDeleted?: (id: string) => void }) {
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    onDeleted?.(item.id);
  }

  async function saveTitle() {
    if (title.trim() === item.title || !title.trim()) { setEditing(false); setTitle(item.title); return; }
    setSaving(true);
    await fetch("/api/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, title: title.trim() }),
    });
    setSaving(false);
    setEditing(false);
  }

  return (
    <>
      {showModal && item.type === "video" && <VideoModal item={item} onClose={() => setShowModal(false)} />}
      {showModal && item.type === "image" && <ImageModal item={item} onClose={() => setShowModal(false)} />}

      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
        onContextMenu={!isAdmin ? (e) => e.preventDefault() : undefined}
        style={{
          background: "#fff",
          border: "1px solid rgba(18,33,58,0.08)",
          boxShadow: "0 2px 8px rgba(18,33,58,0.06)",
          userSelect: isAdmin ? undefined : "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(18,33,58,0.12)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(18,33,58,0.06)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Media */}
        <div className="relative w-full overflow-hidden" style={{ background: "#F6F3EE", height: "160px" }}>
          {item.type === "image" ? (
            imgError ? (
              <Placeholder label="image" url={item.url} />
            ) : (
              <button onClick={() => setShowModal(true)} className="group relative" style={{ width: "100%", height: "100%", cursor: "zoom-in", border: "none", padding: 0, display: "block" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gdriveDirect(item.url)}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(18,33,58,0.25)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)" }}>
                    <svg className="w-4 h-4" style={{ color: "#12213A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </button>
            )
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="block relative w-full text-left"
              style={{ height: "160px", cursor: "pointer", overflow: "hidden" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gdriveThumbnail(item.url)}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
              />
              {/* Play overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-150"
                style={{ background: "rgba(18,33,58,0.3)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
                >
                  <svg className="w-4 h-4 ml-0.5" style={{ color: "#12213A" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}

          {/* Type badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
            style={
              item.type === "video"
                ? { background: "#1B6BF0", color: "#fff" }
                : { background: "rgba(255,255,255,0.85)", color: "#12213A" }
            }
          >
            {item.type}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 flex flex-col gap-1.5">
          {isAdmin && confirmDelete && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs" style={{ color: "#E07B5A" }}>Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ background: "#E07B5A", color: "#fff" }}
              >
                {deleting ? "…" : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-medium"
                style={{ color: "#A8A29E" }}
              >
                Cancel
              </button>
            </div>
          )}
          {isAdmin && editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditing(false); setTitle(item.title); } }}
              className="text-xs font-semibold w-full outline-none rounded px-1"
              style={{ color: "#12213A", border: "1.5px solid #1B6BF0", background: "#F6F3EE" }}
            />
          ) : (
            <p
              className={`font-semibold text-xs truncate transition-colors ${isAdmin ? "cursor-pointer hover:text-[#1B6BF0]" : ""}`}
              style={{ color: saving ? "#A8A29E" : "#12213A" }}
              title={isAdmin ? "Click to edit" : item.title}
              onClick={() => isAdmin && setEditing(true)}
            >
              {saving ? "Saving…" : title}
            </p>
          )}
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {item.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: "#F0EBE1", color: "#7A7A7A" }}>
                  {tag}
                </span>
              ))}
            </div>
            {isAdmin && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors"
                style={{ background: "#F0EBE1", color: "#C5BFB5" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#FDEAE4"; e.currentTarget.style.color = "#E07B5A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F0EBE1"; e.currentTarget.style.color = "#C5BFB5"; }}
                title="Delete"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Placeholder({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center" style={{ minHeight: "140px", color: "#A8A29E" }}>
      <span className="text-xs">Open {label} ↗</span>
    </a>
  );
}
