"use client";

interface FilterBarProps {
  selectedType: "all" | "image" | "video";
  onTypeChange: (type: "all" | "image" | "video") => void;
  totalCount: number;
  filteredCount: number;
}

const TYPE_OPTIONS: { value: "all" | "image" | "video"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
];

export default function FilterBar({
  selectedType,
  onTypeChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Type pills */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg shrink-0"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
            style={
              selectedType === opt.value
                ? {
                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                  }
                : { color: "#666", cursor: "pointer" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="ml-auto text-xs" style={{ color: "#444" }}>
        {filteredCount === totalCount ? (
          <span>{totalCount} creative{totalCount !== 1 ? "s" : ""}</span>
        ) : (
          <span>{filteredCount} of {totalCount} creative{totalCount !== 1 ? "s" : ""}</span>
        )}
      </div>
    </div>
  );
}
