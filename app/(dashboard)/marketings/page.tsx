/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/page.tsx
// ✅ Server Component
import type { Metadata } from "next";
import { MarketingsClient } from "./_components/MarketingsClient";

export const metadata: Metadata = {
  title: "Bazar | Mess Management",
  description: "Track all bazar purchases and marketing expenses",
};

export default function MarketingsPage() {
  return <MarketingsClient />;
}
