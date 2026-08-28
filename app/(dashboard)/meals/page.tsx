// app/(dashboard)/meals/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { MealsClient } from "./_components/MealsClient";

export const metadata: Metadata = {
  title: "Meals | Mess Management",
  description: "Daily and monthly meal tracking for all members",
};

export default function MealsPage() {
  return <MealsClient />;
}
