"use client";

import { MediaItem } from "@/lib/auth";
import { useState } from "react";

interface MediaCardProps {
  item: MediaItem;
}

function gdriveDirect(url: string): string {
  // Convert share URL to direct embed URL
  // https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/uc?export=view&id=FILE_ID
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  return url;
}

function gdriveEmbed(url: string): string {
  // https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/file/d/FILE_ID/preview
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

export default function MediaCard({ item }: MediaCardProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className="group rounded-xl overflow-hidden flex flex-col transition-all duration-300"
      style={{
        background: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        transform: "translateY(0) scale(1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px) scale(1.01)";
        el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,99,235,0.2)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0) scale(1)";
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
      }}
    >
      {/* Media area */}
      <div className="relative w-full overflow-hidden" style={{ background: "#0D0D0D", minHeight: "180px" }}>
        {error ? (
          <PlaceholderMedia label={item.type === "video" ? "Video" : "Image"} />
        ) : item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gdriveDirect(item.url)}
            alt={item.title}
            className="w-full h-auto object-cover"
            style={{ display: "block" }}
            onError={() => setError(true)}
          />
        ) : (
          <iframe
            src={gdriveEmbed(item.url)}
            className="w-full"
            style={{ minHeight: "220px", border: "none", display: "block" }}
            allow="autoplay"
            onError={() => setError(true)}
          />
        )}

        {/* Type badge */}
        <div
          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
          style={
            item.type === "video"
              ? { background: "rgba(37,99,235,0.85)", color: "#fff", backdropFilter: "blur(4px)" }
              : { background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)" }
          }
        >
          {item.type}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="font-semibold text-sm text-white leading-snug truncate" title={item.title}>
            {item.title}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#2563EB" }}>
            {item.client}
          </p>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#777",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderMedia({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2" style={{ minHeight: "180px", color: "#333" }}>
      {label === "Video" ? (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ) : (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      <span className="text-xs">Media unavailable</span>
    </div>
  );
}
