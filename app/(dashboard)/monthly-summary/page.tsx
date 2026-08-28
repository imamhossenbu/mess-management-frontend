// app/(dashboard)/monthly-summary/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { MonthlySummaryClient } from "./_components/MonthlySummaryClient";

export const metadata: Metadata = {
  title: "Monthly Report | Mess Management",
  description: "Full financial breakdown — bazar, meals, payments and member balances",
};

export default function MonthlySummaryPage() {
  return <MonthlySummaryClient />;
}
