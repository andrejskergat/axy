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

export default function FilterBar({ selectedType, onTypeChange, totalCount, filteredCount }: FilterBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-3"
      style={{ borderBottom: "1px solid rgba(18,33,58,0.08)" }}
    >
      <div
        className="flex items-center gap-1 p-1 rounded-lg"
        style={{ background: "rgba(18,33,58,0.06)" }}
      >
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150"
            style={
              selectedType === opt.value
                ? { background: "#1B6BF0", color: "#fff" }
                : { color: "#7A7A7A", cursor: "pointer" }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <span className="ml-auto text-xs" style={{ color: "#A8A29E" }}>
        {filteredCount === totalCount
          ? `${totalCount} creative${totalCount !== 1 ? "s" : ""}`
          : `${filteredCount} of ${totalCount}`}
      </span>
    </div>
  );
}
