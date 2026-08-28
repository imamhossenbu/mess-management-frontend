/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/utility-bills/_components/UtilityBillsClient.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/hooks/useAuth";
import { useMonthlyUtilityBills, useDeleteUtilityBill } from "@/lib/hooks/useUtilityBills";
import { UtilityBillHeader } from "./UtilityBillHeader";
import { MonthSelector } from "./MonthSelector";
import { UtilityBillForm } from "./UtilityBillForm";
import { UtilityBillStats } from "./UtilityBillStats";
import { BillBreakdown } from "./BillBreakdown";
import { BillList } from "./BillList";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

// ✅ Lazy load edit modal
const EditUtilityBillModal = dynamic(
  () => import("./EditUtilityBillModal").then(m => ({ default: m.EditUtilityBillModal })),
  { ssr: false },
);

export function UtilityBillsClient() {
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [editingBill, setEditingBill] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: monthlySummary, isLoading, refetch } = useMonthlyUtilityBills(
    selectedYear,
    selectedMonth
  );

  const deleteMutation = useDeleteUtilityBill();

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          refetch();
          setDeleteId(null);
          setDeleteName("");
        },
      });
    }
  };

  const handleCloseModal = () => {
    if (!deleteMutation.isPending) {
      setDeleteId(null);
      setDeleteName("");
    }
  };

  const handleEditClick = (bill: any) => {
    setEditingBill(bill);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setEditingBill(null);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    refetch();
  };

  const bills = monthlySummary?.bills || [];

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <UtilityBillHeader onAddClick={() => setShowAddForm(!showAddForm)} canEdit={canEdit} />

          <MonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {/* Add Form */}
        {showAddForm && canEdit && (
          <UtilityBillForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Stats */}
        <UtilityBillStats
          totalAmount={monthlySummary?.totalAmount || 0}
          perPersonShare={monthlySummary?.perPersonShare || 0}
          totalBills={bills.length}
          isLoading={isLoading}
        />

        {/* Bill Breakdown */}
        <BillBreakdown
          totalCurrent={monthlySummary?.totalCurrent || 0}
          totalWifi={monthlySummary?.totalWifi || 0}
          totalRent={monthlySummary?.totalRent || 0}
          totalWater={monthlySummary?.totalWater || 0}
          totalKhala={monthlySummary?.totalKhala || 0}
          isLoading={isLoading}
        />

        {/* Bill List */}
        <BillList
          bills={bills}
          isLoading={isLoading}
          canEdit={canEdit}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          isDeleting={deleteMutation.isPending}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Utility Bill"
        message={`Are you sure you want to delete "${deleteName}" bill? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
        confirmText="Delete Bill"
        cancelText="Cancel"
      />

      {/* Edit Modal — dynamically loaded when opened */}
      {isEditModalOpen && (
        <EditUtilityBillModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingBill(null);
          }}
          bill={editingBill}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
