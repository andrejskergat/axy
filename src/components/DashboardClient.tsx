"use client";

import { useState, useMemo } from "react";
import { MediaItem } from "@/lib/auth";
import Header from "./Header";
import FilterBar from "./FilterBar";
import MediaCard from "./MediaCard";

interface DashboardClientProps {
  initialMedia: MediaItem[];
}

export default function DashboardClient({ initialMedia }: DashboardClientProps) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all");

  const clients = useMemo(() => {
    const set = new Set(initialMedia.map((m) => m.client));
    return Array.from(set).sort();
  }, [initialMedia]);

  const filtered = useMemo(() => {
    return initialMedia.filter((item) => {
      const matchClient = !selectedClient || item.client === selectedClient;
      const matchType = selectedType === "all" || item.type === selectedType;
      return matchClient && matchType;
    });
  }, [initialMedia, selectedClient, selectedType]);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Header />

      <main>
        {initialMedia.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FilterBar
              clients={clients}
              selectedClient={selectedClient}
              selectedType={selectedType}
              onClientChange={setSelectedClient}
              onTypeChange={setSelectedType}
              totalCount={initialMedia.length}
              filteredCount={filtered.length}
            />

            <div className="p-6">
              {filtered.length === 0 ? (
                <NoResultsState
                  onReset={() => {
                    setSelectedClient("");
                    setSelectedType("all");
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.15)",
        }}
      >
        <svg
          className="w-9 h-9"
          style={{ color: "#2563EB" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">No creatives uploaded yet</h2>
      <p className="text-sm max-w-sm leading-relaxed" style={{ color: "#555" }}>
        Run the upload script to add media.{" "}
        <span
          className="font-mono px-1.5 py-0.5 rounded text-xs"
          style={{ background: "#1A1A1A", color: "#888", border: "1px solid #222" }}
        >
          data/media.json
        </span>{" "}
        holds the metadata and files go in{" "}
        <span
          className="font-mono px-1.5 py-0.5 rounded text-xs"
          style={{ background: "#1A1A1A", color: "#888", border: "1px solid #222" }}
        >
          public/media/
        </span>
        .
      </p>
    </div>
  );
}

function NoResultsState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: "#444" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-white mb-1">No results</p>
      <p className="text-xs mb-4" style={{ color: "#555" }}>
        No creatives match the current filters.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150"
        style={{
          background: "rgba(37,99,235,0.1)",
          color: "#2563EB",
          border: "1px solid rgba(37,99,235,0.2)",
          cursor: "pointer",
        }}
      >
        Clear filters
      </button>
    </div>
  );
}
