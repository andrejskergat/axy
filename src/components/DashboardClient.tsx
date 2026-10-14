"use client";

import { useState, useMemo } from "react";
import { MediaItem } from "@/lib/auth";
import Header from "./Header";
import FilterBar from "./FilterBar";
import MediaCard from "./MediaCard";

export default function DashboardClient({ initialMedia, isAdmin }: { initialMedia: MediaItem[]; isAdmin: boolean }) {
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all");
  const [media, setMedia] = useState(initialMedia);

  const filtered = useMemo(() =>
    selectedType === "all" ? media : media.filter((i) => i.type === selectedType),
    [media, selectedType]
  );

  function handleDeleted(id: string) {
    setMedia((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="min-h-screen" style={{ background: "#F0EBE1" }}>
      <Header isAdmin={isAdmin} />
      <main>
        {initialMedia.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FilterBar
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              totalCount={media.length}
              filteredCount={filtered.length}
            />
            <div className="p-6">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm" style={{ color: "#A8A29E" }}>No creatives match this filter.</p>
                  <button onClick={() => setSelectedType("all")} className="mt-3 text-sm font-medium" style={{ color: "#1B6BF0" }}>
                    Clear filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {filtered.map((item) => <MediaCard key={item.id} item={item} isAdmin={isAdmin} onDeleted={handleDeleted} />)}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-6 pb-8 pt-6 mt-8 border-t" style={{ borderColor: "rgba(18,33,58,0.12)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#12213A" }}>Confidentiality Notice</p>
        <div className="space-y-2 text-xs leading-relaxed" style={{ color: "#7A7A7A" }}>
          <p>SocialFin provides access to this portfolio solely for the authorised recipient’s private review. The portfolio contains client work and confidential materials.</p>
          <p>You must not copy, download, screenshot, record, reproduce, publish, distribute or otherwise share any materials without SocialFin’s prior written permission. You must not share the access link or password with anyone else.</p>
          <p>All intellectual property rights remain with their respective owners. Access does not grant permission to reuse or adapt any materials.</p>
        </div>
      </footer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="text-lg font-semibold mb-1" style={{ color: "#12213A" }}>No creatives yet</p>
      <p className="text-sm" style={{ color: "#A8A29E" }}>Go to /admin to add your first creative.</p>
    </div>
  );
}
