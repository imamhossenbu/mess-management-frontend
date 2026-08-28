/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingsClient.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  useMonthlyMarketing,
  useDeleteMarketing,
} from "@/lib/hooks/useMarketings";
import { MarketingsHeader } from "./MarketingsHeader";
import { MarketingForm } from "./MarketingForm";
import { MarketingSummaryCards } from "./MarketingSummaryCards";
import { MarketingTable } from "./MarketingTable";
import { MarketingsSkeleton } from "./MarketingsSkeleton";

// ✅ Lazy load heavy modals — only mount when needed
const MarketingViewModal = dynamic(
  () => import("./MarketingViewModal").then(m => ({ default: m.MarketingViewModal })),
  { ssr: false },
);
const MarketingEditModal = dynamic(
  () => import("./MarketingEditModal").then(m => ({ default: m.MarketingEditModal })),
  { ssr: false },
);

export function MarketingsClient() {
  const { user, isAdmin, isManager } = useAuth();
  const [selectedYear,  setSelectedYear]  = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const canEditAll = isAdmin || isManager;

  const { data: monthlyData, isLoading, refetch } = useMonthlyMarketing(selectedYear, selectedMonth);
  const deleteMarketing = useDeleteMarketing();

  const handleDelete = (id: string): Promise<any> =>
    new Promise((resolve, reject) => {
      deleteMarketing.mutate(id, {
        onSuccess: (data) => { refetch(); resolve(data); },
        onError:   (err)  => reject(err),
      });
    });

  const handleView = (item: any) => { setSelectedItem(item); setViewModalOpen(true); };
  const handleEdit = (item: any) => { setSelectedItem(item); setEditModalOpen(true); };
  const handleFormSuccess = () => { refetch(); setShowAddForm(false); };
  const handleEditSuccess = () => { refetch(); setEditModalOpen(false); };

  if (isLoading) return <MarketingsSkeleton />;

  return (
    <div className="space-y-6">
      <MarketingsHeader
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        canEdit={true}
      />

      {showAddForm && (
        <MarketingForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddForm(false)}
          canEdit={true}
        />
      )}

      <MarketingSummaryCards data={monthlyData} />

      <MarketingTable
        data={monthlyData}
        canEdit={canEditAll}
        currentUserId={user?.id}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        isDeleting={deleteMarketing.isPending}
      />

      {/* ✅ Only mount when open */}
      {viewModalOpen && (
        <MarketingViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          data={selectedItem}
        />
      )}
      {editModalOpen && (
        <MarketingEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          data={selectedItem}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
