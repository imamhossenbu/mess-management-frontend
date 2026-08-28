// app/(dashboard)/utility-bills/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { UtilityBillsClient } from "./_components/UtilityBillsClient";

export const metadata: Metadata = {
  title: "Utility Bills | Mess Management",
  description: "Track electricity, internet, rent, water, and other shared costs",
};

export default function UtilityBillsPage() {
  return <UtilityBillsClient />;
}