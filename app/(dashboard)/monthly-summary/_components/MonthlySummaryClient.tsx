/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/monthly-summary/_components/MonthlySummaryClient.tsx
"use client";

import { useState, lazy, Suspense } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monthlySummaryApi } from "@/lib/api/monthly-summary";
import {
  RefreshCw,
  FileSpreadsheet,
  Trash2,
  ShoppingBag,
  CreditCard,
  Utensils,
  TrendingDown,
  TrendingUp,
  Download,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

// ✅ Lazy-load heavy tabs — only loaded when tab is clicked
const SummaryTab   = lazy(() => import("./tabs/SummaryTab").then(m => ({ default: m.SummaryTab })));
const BazarTab     = lazy(() => import("./tabs/BazarTab").then(m => ({ default: m.BazarTab })));
const PaymentsTab  = lazy(() => import("./tabs/PaymentsTab").then(m => ({ default: m.PaymentsTab })));
const MealsTab     = lazy(() => import("./tabs/MealsTab").then(m => ({ default: m.MealsTab })));

type TabKey = "summary" | "bazar" | "payments" | "meals";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "summary",  label: "Summary Sheet", icon: FileSpreadsheet },
  { key: "bazar",    label: "Bazar Details", icon: ShoppingBag },
  { key: "payments", label: "Payments",       icon: CreditCard },
  { key: "meals",    label: "Meal Count",     icon: Utensils },
];

const TabFallback = () => (
  <div className="space-y-3">
    {[0,1,2].map(i => <SkeletonCard key={i} />)}
  </div>
);

export function MonthlySummaryClient() {
  const { isManager } = useAuth();
  const queryClient = useQueryClient();
  const now = new Date();
  const [selectedYear,  setSelectedYear]  = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ── Only fetch the compiled summary sheet ──
  const { data: summary, isLoading } = useQuery({
    queryKey: ["monthly-summary-sheet", selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await monthlySummaryApi.getByMonth(selectedYear, selectedMonth);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: () => monthlySummaryApi.generate({ year: selectedYear, month: selectedMonth }),
    onSuccess: () => {
      toast.success("Monthly summary generated!");
      queryClient.invalidateQueries({ queryKey: ["monthly-summary-sheet", selectedYear, selectedMonth] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to generate summary"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => monthlySummaryApi.deleteByMonth(selectedYear, selectedMonth),
    onSuccess: () => {
      toast.success("Monthly summary cleared!");
      queryClient.invalidateQueries({ queryKey: ["monthly-summary-sheet", selectedYear, selectedMonth] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to clear summary"),
  });

  const handleDelete = () => {
    setShowClearConfirm(true);
  };

  const handleClearConfirm = () => {
    deleteMutation.mutate();
    setShowClearConfirm(false);
  };

  const handleExportCSV = () => {
    if (!summary || !summary.userSummaries) return;
    const headers = [
      "Member Name",
      "Total Meals",
      "Meal Bill (TK)",
      "Utility Share (TK)",
      "Total Bill (TK)",
      "Deposited (TK)",
      "Previous Due (TK)",
      "Current Balance (TK)"
    ];
    const csvRows = [headers.join(",")];
    summary.userSummaries.forEach((u: any) => {
      const name = `"${u.userName.replace(/"/g, '""')}"`;
      const row = [
        name,
        u.totalMeal,
        Number(u.mealBill).toFixed(2),
        Number(u.utilityShare).toFixed(2),
        Number(u.totalBill).toFixed(2),
        Number(u.totalPaid).toFixed(2),
        Number(u.previousDue).toFixed(2),
        Number(u.currentDue).toFixed(2)
      ];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mess_report_${MONTHS[selectedMonth - 1]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    if (!summary) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocker prevented opening print window!");
      return;
    }

    const rowsHtml = summary.userSummaries?.map((u: any) => {
      const statusText = Number(u.currentDue) > 0
        ? `Due: ৳${Number(u.currentDue).toLocaleString()}`
        : Number(u.currentDue) < 0
          ? `Adv: ৳${Math.abs(Number(u.currentDue)).toLocaleString()}`
          : "Cleared";
      const statusClass = Number(u.currentDue) > 0
        ? "text-rose-600 font-bold"
        : Number(u.currentDue) < 0
          ? "text-emerald-600 font-bold"
          : "text-slate-500";

      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${u.userName}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${u.totalMeal}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(u.mealBill).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(u.utilityShare).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">৳ ${Number(u.totalBill).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: #16a34a;">৳ ${Number(u.totalPaid).toLocaleString()}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(u.previousDue).toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;" class="${statusClass}">${statusText}</td>
        </tr>
      `;
    }).join("");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mess Monthly Summary - ${summary.month} ${summary.year}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 40px;
            color: #1e293b;
            line-height: 1.5;
            background-color: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #334155;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 6px 0 0;
            color: #64748b;
            font-size: 13px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }
          .metric-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }
          .metric-card .label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
          }
          .metric-card .value {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 12px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-transform: uppercase;
            padding: 8px;
            border: 1px solid #cbd5e1;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .footer-row {
            font-weight: bold;
            background-color: #e2e8f0 !important;
          }
          .text-rose-600 { color: #dc2626; font-weight: bold; }
          .text-emerald-600 { color: #16a34a; font-weight: bold; }
          .text-slate-500 { color: #64748b; }
          @media print {
            body { margin: 20px; }
            .metric-card { background: #fff !important; border: 1px solid #cbd5e1 !important; }
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MESS MONTHLY FINANCIAL REPORT</h1>
          <p>Report Period: ${summary.month} ${summary.year} | Compiled on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="label">Meal Rate</div>
            <div class="value" style="color: #2563eb;">৳ ${Number(summary.mealRate).toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="label">Total Meals</div>
            <div class="value">${summary.totalMeals}</div>
          </div>
          <div class="metric-card">
            <div class="label">Bazar Cost</div>
            <div class="value">৳ ${Number(summary.totalMealBill).toLocaleString()}</div>
          </div>
          <div class="metric-card">
            <div class="label">Utilities</div>
            <div class="value">৳ ${Number(summary.totalUtilityBill).toLocaleString()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Member Name</th>
              <th>Meals</th>
              <th style="text-align: right;">Meal Bill</th>
              <th style="text-align: right;">Utility</th>
              <th style="text-align: right;">Total Bill</th>
              <th style="text-align: right;">Deposited</th>
              <th style="text-align: right;">Prev Due</th>
              <th style="text-align: right;">Balance Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
            <tr class="footer-row">
              <td style="padding: 8px; border: 1px solid #cbd5e1;">TOTAL</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${summary.totalMeals}</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(summary.totalMealBill).toLocaleString()}</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(summary.totalUtilityBill).toLocaleString()}</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">৳ ${Number(summary.totalBill).toLocaleString()}</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: #16a34a;">৳ ${Number(summary.totalPaid).toLocaleString()}</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">—</td>
              <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; color: #dc2626;">৳ ${Number(summary.totalDue).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
          Generated automatically by Mess Management System. Document is valid without signature.
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };



  // ── When month/year changes, prefetch related tab data ──
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setActiveTab("summary");
  };
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setActiveTab("summary");
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Report</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Full financial breakdown — bazar, meals, payments and balances
          </p>
        </div>

        {/* Month/Year Picker */}
        <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border-0 text-sm font-semibold text-slate-700 outline-none flex-1 sm:flex-none"
          >
            {MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>
          <div className="w-px h-8 bg-slate-200" />
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border-0 text-sm font-semibold text-slate-700 outline-none"
          >
            {[...Array(5)].map((_, i) => {
              const yr = now.getFullYear() - 2 + i;
              return <option key={yr} value={yr}>{yr}</option>;
            })}
          </select>
        </div>
      </div>

      {/* ── Loading state ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : summary?.isGenerated ? (
        <>
          {/* ── Metric Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Meal Rate"        value={`৳ ${Number(summary.mealRate).toFixed(2)}`} accent="text-primary-600" sub="per meal" />
            <MetricCard label="Total Meals"      value={String(summary.totalMeals)}                 accent="text-slate-800"   sub="this month" />
            <MetricCard label="Total Bazar Cost" value={`৳ ${Number(summary.totalMealBill).toLocaleString()}`} accent="text-slate-800" sub="market expense" />
            <MetricCard label="Utility Bills"    value={`৳ ${Number(summary.totalUtilityBill).toLocaleString()}`} accent="text-slate-800" sub="shared cost" />
          </div>

          {/* ── Due / Advance ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DueAdvanceCard userSummaries={summary.userSummaries} type="due" />
            <DueAdvanceCard userSummaries={summary.userSummaries} type="advance" />
          </div>

          {/* ── Actions Bar (Export, Print, Recalculate, Clear) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 print:hidden">
            {/* Left side: Export / Print Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-primary-600" />
                Export CSV
              </button>
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print / Save PDF
              </button>

            </div>

            {/* Right side: Manager Actions */}
            {isManager && (
              <div className="flex gap-2">
                <button
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                  Recalculate
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Sheet
                </button>
              </div>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="border-b border-slate-100">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === key
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content — lazy loaded ── */}
          <Suspense fallback={<TabFallback />}>
            {activeTab === "summary"  && <SummaryTab  summary={summary} />}
            {activeTab === "bazar"    && <BazarTab    year={selectedYear} month={selectedMonth} />}
            {activeTab === "payments" && <PaymentsTab year={selectedYear} month={selectedMonth} />}
            {activeTab === "meals"    && <MealsTab    year={selectedYear} month={selectedMonth} />}
          </Suspense>
        </>
      ) : (
        /* ── Not generated yet ── */
        <NotGeneratedPrompt
          month={selectedMonth}
          year={selectedYear}
          isManager={isManager}
          isPending={generateMutation.isPending}
          onGenerate={() => generateMutation.mutate()}
          onViewTab={setActiveTab}
          activeTab={activeTab}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      )}

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearConfirm}
        title="Clear Monthly Summary Sheet"
        message="Are you sure you want to clear this month's compiled summary? Raw data (meals, bazaar, payments) will NOT be deleted, but the calculations will be cleared."
        confirmText="Confirm Clear"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

// ─── Pure display sub-components ───────────────────────────────────────────

function MetricCard({ label, value, accent, sub }: {
  label: string; value: string; accent: string; sub: string;
}) {
  return (
    <Card className="p-4 bg-white border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-extrabold mt-1 ${accent}`}>{value}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
    </Card>
  );
}

function DueAdvanceCard({ userSummaries, type }: { userSummaries: any[]; type: "due" | "advance" }) {
  if (!userSummaries) return null;
  const filtered = userSummaries.filter(u =>
    type === "due" ? Number(u.currentDue) > 0 : Number(u.currentDue) < 0
  );
  const totalAmount = filtered.reduce((sum, u) => sum + Math.abs(Number(u.currentDue)), 0);
  const isDue = type === "due";

  return (
    <Card className={`p-5 border ${isDue ? "border-rose-100 bg-rose-50/30" : "border-emerald-100 bg-emerald-50/30"}`}>
      <div className="flex items-center gap-2 mb-3">
        {isDue
          ? <TrendingDown className="w-4 h-4 text-rose-500" />
          : <TrendingUp   className="w-4 h-4 text-emerald-500" />}
        <h3 className="text-sm font-bold text-slate-700">{isDue ? "Pending Due" : "Advance Balance"}</h3>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
          isDue ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
        }`}>
          ৳ {totalAmount.toLocaleString()}
        </span>
      </div>
      {filtered.length === 0 ? (
        <p className="text-xs text-slate-400">{isDue ? "No pending dues 🎉" : "No advance balances"}</p>
      ) : (
        <div className="space-y-1.5">
          {filtered.map(u => (
            <div key={u.userId} className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">{u.userName}</span>
              <span className={`text-xs font-bold ${isDue ? "text-rose-600" : "text-emerald-600"}`}>
                {isDue ? "-" : "+"} ৳{Math.abs(Number(u.currentDue)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function NotGeneratedPrompt({
  month, year, isManager, isPending, onGenerate, onViewTab, activeTab, selectedYear, selectedMonth,
}: {
  month: number; year: number; isManager: boolean;
  isPending: boolean; onGenerate: () => void;
  onViewTab: (tab: TabKey) => void; activeTab: TabKey;
  selectedYear: number; selectedMonth: number;
}) {
  return (
    <div className="space-y-6">
      <div className="py-12 max-w-md mx-auto">
        <Card className="p-8 bg-white border border-slate-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Sheet Not Generated</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            The monthly summary for <strong>{MONTHS[month - 1]} {year}</strong> has not been compiled yet.
          </p>
          {isManager ? (
            <button
              onClick={onGenerate}
              disabled={isPending}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><RefreshCw className="w-4 h-4" /> Calculate & Compile Sheet</>
              )}
            </button>
          ) : (
            <p className="text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg">
              ⚠️ Only managers or admins can generate this sheet.
            </p>
          )}

          <div className="w-full mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3">You can still view raw data:</p>
            <div className="flex gap-2">
              <button
                onClick={() => onViewTab("bazar")}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Bazar Details
              </button>
              <button
                onClick={() => onViewTab("payments")}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
              >
                Payments
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Still show tabs even before generate */}
      <Suspense fallback={<TabFallback />}>
        {activeTab === "bazar"    && <BazarTab    year={selectedYear} month={selectedMonth} />}
        {activeTab === "payments" && <PaymentsTab year={selectedYear} month={selectedMonth} />}
        {activeTab === "meals"    && <MealsTab    year={selectedYear} month={selectedMonth} />}
      </Suspense>
    </div>
  );
}
