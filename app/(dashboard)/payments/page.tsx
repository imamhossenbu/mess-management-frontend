// app/(dashboard)/payments/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { PaymentsClient } from "./_components/PaymentsClient";

export const metadata: Metadata = {
  title: "Payments | Mess Management",
  description: "Track all member payments and balance sheet",
};

export default function PaymentsPage() {
  return <PaymentsClient />;
}