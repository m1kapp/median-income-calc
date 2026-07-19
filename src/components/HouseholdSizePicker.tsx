import { User } from "lucide-react";

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7];

export interface HouseholdSizePickerProps {
  value: number;
  onChange: (size: number) => void;
  className?: string;
}

export function HouseholdSizePicker({ value, onChange, className = "" }: HouseholdSizePickerProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">가족구성원</span>
        <span className="text-[13px] font-bold" style={{ color: "var(--kit-accent)" }}>
          {value}인가구
        </span>
      </div>

      <div className="flex justify-between gap-1">
        {HOUSEHOLD_SIZES.map((n) => {
          const lit = n <= value;
          const active = n === value;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={lit}
              aria-label={`${n}인 가구`}
              onClick={() => onChange(n)}
              className="flex flex-1 flex-col items-center gap-1 py-0.5"
            >
              <User
                size={24}
                strokeWidth={2}
                fill={lit ? "currentColor" : "none"}
                className={`transition-all duration-200 ${active ? "scale-110" : ""} ${
                  lit ? "" : "text-zinc-200 dark:text-zinc-700"
                }`}
                style={{
                  color: lit ? "var(--kit-accent)" : undefined,
                  filter: active ? "drop-shadow(0 0 5px var(--kit-accent))" : undefined,
                }}
              />
              <span
                className={`text-[10px] font-bold transition-colors ${lit ? "" : "text-zinc-300 dark:text-zinc-600"}`}
                style={lit ? { color: "var(--kit-accent)" } : undefined}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
