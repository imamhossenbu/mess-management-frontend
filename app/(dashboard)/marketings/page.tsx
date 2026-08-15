/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MarketingViewModal } from "./_components/MarketingViewModal";
import { MarketingEditModal } from "./_components/MarketingEditModal";
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
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const canEdit = true;

  const {
    data: monthlyData,
    isLoading,
    refetch,
  } = useMonthlyMarketing(selectedYear, selectedMonth);

  const deleteMarketing = useDeleteMarketing();

  // ✅ No native confirm() here — MarketingTable's DeleteConfirmModal
  // handles confirmation. This returns a Promise so MarketingTable
  // can wrap it with toast.promise() for loading/success/error toasts.
  const handleDelete = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      deleteMarketing.mutate(id, {
        onSuccess: (data) => {
          refetch();
          resolve(data);
        },
        onError: (err) => {
          reject(err);
        },
      });
    });
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
    setShowAddForm(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditModalOpen(false);
  };

  if (isLoading) {
    return <MarketingsSkeleton />;
  }

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
        onView={handleView}
        onEdit={handleEdit}
        isDeleting={deleteMarketing.isPending}
      />

      {/* View Modal */}
      <MarketingViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedItem}
      />

      {/* Edit Modal */}
      <MarketingEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={selectedItem}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
