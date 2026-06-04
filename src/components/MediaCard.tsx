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

export default function MediaCard({ item }: { item: MediaItem }) {
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && item.type === "video" && (
        <VideoModal item={item} onClose={() => setShowModal(false)} />
      )}

      <div
        className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
        style={{
          background: "#fff",
          border: "1px solid rgba(18,33,58,0.08)",
          boxShadow: "0 2px 8px rgba(18,33,58,0.06)",
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
        <div className="relative w-full overflow-hidden" style={{ background: "#F6F3EE", minHeight: "140px" }}>
          {item.type === "image" ? (
            imgError ? (
              <Placeholder label="image" url={item.url} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gdriveDirect(item.url)}
                alt={item.title}
                className="w-full h-auto object-cover"
                style={{ display: "block" }}
                onError={() => setImgError(true)}
              />
            )
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="block relative w-full text-left"
              style={{ minHeight: "140px", cursor: "pointer" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gdriveThumbnail(item.url)}
                alt={item.title}
                className="w-full h-auto object-cover"
                style={{ display: "block", minHeight: "140px" }}
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
          <p className="font-semibold text-xs truncate" style={{ color: "#12213A" }} title={item.title}>
            {item.title}
          </p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: "#F0EBE1", color: "#7A7A7A" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
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
