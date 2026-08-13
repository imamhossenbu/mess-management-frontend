// app/(dashboard)/dashboard/page.tsx
import { Suspense, cache } from "react";
import { cookies } from "next/headers";
import { DashboardWrapper } from "./_components/DashboardWrapper";
import DashboardLoading from "./loading";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Mess Management",
  description: "Your mess management dashboard",
};

// ✅ Cache the user data to prevent re-fetching
const getUserData = cache(async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const token = cookieStore.get("accessToken");

  let user = null;
  let role = "MEMBER";

  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value);
      role = user?.role || "MEMBER";
    } catch {
      // Invalid JSON
    }
  }

  return { user, token, role };
});

export default async function DashboardPage() {
  const { user, token, role } = await getUserData();

  if (!user || !token) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardWrapper user={user} role={role} />
    </Suspense>
  );
}
