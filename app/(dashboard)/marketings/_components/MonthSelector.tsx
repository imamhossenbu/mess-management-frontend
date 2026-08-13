// app/(dashboard)/marketings/_components/MonthSelector.tsx
"use client";

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthSelector({
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
}: MonthSelectorProps) {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        className="px-3 py-1.5 bg-white border-0 text-sm font-semibold text-slate-700 outline-none focus:ring-0 cursor-pointer"
      >
        {MONTHS.map((m, idx) => (
          <option key={idx} value={idx + 1}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="px-3 py-1.5 bg-white border-0 border-l border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:ring-0 cursor-pointer"
      >
        {[...Array(5)].map((_, i) => {
          const yr = new Date().getFullYear() - 2 + i;
          return (
            <option key={yr} value={yr}>
              {yr}
            </option>
          );
        })}
      </select>
    </div>
  );
}
