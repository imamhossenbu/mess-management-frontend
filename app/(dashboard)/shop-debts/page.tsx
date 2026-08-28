// app/(dashboard)/shop-debts/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { ShopDebtsClient } from "./_components/ShopDebtsClient";

export const metadata: Metadata = {
  title: "Shop Debts | Mess Management",
  description: "Log and manage credit bills due to local groceries or shops",
};

export default function ShopDebtsPage() {
  return <ShopDebtsClient />;
}
