// app/(dashboard)/utility-bills/_components/MonthSelector.tsx
"use client";

interface MonthSelectorProps {
    selectedYear: number;
    selectedMonth: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function MonthSelector({
    selectedYear,
    selectedMonth,
    onYearChange,
    onMonthChange,
}: MonthSelectorProps) {
    return (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
                className="px-2 py-1.5 bg-white border-0 text-sm font-semibold text-slate-700 outline-none focus:ring-0"
            >
                {months.map((m, idx) => (
                    <option key={idx} value={idx + 1}>{m}</option>
                ))}
            </select>

            <select
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="px-2 py-1.5 bg-white border-0 border-l border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:ring-0"
            >
                {[...Array(5)].map((_, i) => {
                    const yr = new Date().getFullYear() - 2 + i;
                    return <option key={yr} value={yr}>{yr}</option>;
                })}
            </select>
        </div>
    );
}