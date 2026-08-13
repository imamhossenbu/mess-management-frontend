// app/(dashboard)/marketings/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  useMonthlyMarketing,
  useDeleteMarketing,
} from "@/lib/hooks/useMarketings";
import { MarketingsHeader } from "./_components/MarketingsHeader";
import { MarketingForm } from "./_components/MarketingForm";
import { MarketingSummaryCards } from "./_components/MarketingSummaryCards";
import { MarketingTable } from "./_components/MarketingTable";
import { MarketingsSkeleton } from "./_components/MarketingsSkeleton";

export default function MarketingsPage() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const canEdit = isManager;

  // Get monthly marketing data
  const {
    data: monthlyData,
    isLoading,
    refetch,
  } = useMonthlyMarketing(selectedYear, selectedMonth);

  // Delete mutation
  const deleteMarketing = useDeleteMarketing();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bazar entry?")) {
      deleteMarketing.mutate(id, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleFormSuccess = () => {
    refetch();
    setShowAddForm(false);
  };

  if (isLoading) {
    return <MarketingsSkeleton />;
  }

  // ✅ Log data for debugging
  console.log("📊 Monthly Data:", monthlyData);
  console.log("📊 Marketings:", monthlyData?.marketings);

  return (
    <div className="space-y-6">
      <MarketingsHeader
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        canEdit={canEdit}
      />

      {showAddForm && (
        <MarketingForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(false)}
          canEdit={canEdit}
        />
      )}

      <MarketingSummaryCards data={monthlyData} />

      <MarketingTable
        data={monthlyData}
        canEdit={canEdit}
        onDelete={handleDelete}
        isDeleting={deleteMarketing.isPending}
      />
    </div>
  );
}
