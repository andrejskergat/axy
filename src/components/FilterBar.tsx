"use client";

interface FilterBarProps {
  clients: string[];
  selectedClient: string;
  selectedType: "all" | "image" | "video";
  onClientChange: (client: string) => void;
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
  clients,
  selectedClient,
  selectedType,
  onClientChange,
  onTypeChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4"
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

      {/* Client filter */}
      <div className="relative">
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium outline-none transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: selectedClient ? "#fff" : "#666",
            cursor: "pointer",
          }}
        >
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c} value={c} style={{ background: "#111" }}>
              {c}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          style={{ color: "#555" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Count */}
      <div className="sm:ml-auto text-xs" style={{ color: "#444" }}>
        {filteredCount === totalCount ? (
          <span>{totalCount} creative{totalCount !== 1 ? "s" : ""}</span>
        ) : (
          <span>
            {filteredCount} of {totalCount} creative{totalCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
