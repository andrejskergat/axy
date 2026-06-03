"use client";

import { MediaItem } from "@/lib/auth";
import { useState } from "react";

function gdriveDirect(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  return url;
}

function gdriveEmbed(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
}

export default function MediaCard({ item }: { item: MediaItem }) {
  const [error, setError] = useState(false);

  return (
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
      <div className="relative w-full overflow-hidden" style={{ background: "#F6F3EE", minHeight: "180px" }}>
        {error ? (
          <Placeholder label={item.type} />
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
          />
        )}

        {/* Type badge */}
        <div
          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
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
      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-sm truncate" style={{ color: "#12213A" }} title={item.title}>
          {item.title}
        </p>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "#F0EBE1", color: "#7A7A7A" }}
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

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "180px", color: "#C5BFB5" }}>
      <span className="text-sm">{label === "video" ? "▶ Video unavailable" : "Image unavailable"}</span>
    </div>
  );
}
