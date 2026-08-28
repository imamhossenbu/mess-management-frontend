// app/(dashboard)/users/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { UsersClient } from "./_components/UsersClient";

export const metadata: Metadata = {
  title: "Members | Mess Management",
  description: "Manage all mess members, their roles, and account status",
};

export default function UsersPage() {
  return <UsersClient />;
}
