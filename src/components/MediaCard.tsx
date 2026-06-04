"use client";

import { MediaItem } from "@/lib/auth";
import { useState } from "react";

function gdriveDirect(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
  return url;
}

function gdriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([^/]+)/);
  return match ? match[1] : null;
}

export default function MediaCard({ item }: { item: MediaItem }) {
  const [imgError, setImgError] = useState(false);
  const fileId = gdriveFileId(item.url);

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
        {item.type === "image" ? (
          imgError || !fileId ? (
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
          /* Videos: show thumbnail + play button that opens in Google Drive */
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full"
            style={{ minHeight: "220px" }}
          >
            {fileId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w800`}
                alt={item.title}
                className="w-full h-auto object-cover"
                style={{ display: "block", minHeight: "220px" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {/* Play button overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(18,33,58,0.35)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              >
                <svg className="w-6 h-6 ml-1" style={{ color: "#12213A" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Opens in Drive label */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
              Opens in Drive ↗
            </div>
          </a>
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

function Placeholder({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
      style={{ minHeight: "180px", color: "#A8A29E", textDecoration: "none" }}
    >
      <span className="text-sm">{label === "video" ? "▶ Open video" : "Open image"} ↗</span>
    </a>
  );
}
