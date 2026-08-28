// app/(dashboard)/notifications/page.tsx
// ✅ Server Component — no "use client"
import type { Metadata } from "next";
import { NotificationsClient } from "./_components/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | Mess Management",
  description: "Your recent activity and alerts",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
