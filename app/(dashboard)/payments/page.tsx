/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePayments, useAllUserBalances, useDeletePayment } from "@/lib/hooks/usePayments";
import { PaymentHeader } from "./_components/PaymentHeader";
import { PaymentStats } from "./_components/PaymentStats";
import { PaymentForm } from "./_components/PaymentForm";
import { BalanceList } from "./_components/BalanceList";
import { TransactionList } from "./_components/TransactionList";
import { EditPaymentModal } from "./_components/EditPaymentModal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export default function PaymentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  const { data: transactions, isLoading: loadingTx, refetch } = usePayments();
  const { data: balances, isLoading: loadingBal } = useAllUserBalances();
  const deletePayment = useDeletePayment();

  const totalDeposits = balances?.reduce((sum, item) => sum + Number(item.totalPaid), 0) ?? 0;

  const handleDelete = (id: string) => {
    deletePayment.mutate(id, {
      onSuccess: () => {
        refetch();
        // ✅ Loading Overlay auto বন্ধ হবে (isPending false)
      },
      onError: () => {
        // Error handled in hook
      },
    });
  };

  const handleEdit = (payment: any) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <>
      {/* ✅ Full Page Loading Overlay - Delete এর সময় দেখাবে */}
      {deletePayment.isPending && (
        <LoadingOverlay message="Deleting payment..." />
      )}

      <div className="space-y-8">
        <PaymentHeader onAddClick={() => setShowForm(!showForm)} canEdit={canEdit} />

        {showForm && canEdit && (
          <PaymentForm
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <PaymentStats totalDeposits={totalDeposits} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BalanceList balances={balances || []} isLoading={loadingBal} />
          <TransactionList
            transactions={transactions || []}
            isLoading={loadingTx}
            canEdit={canEdit}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>

        {/* Edit Modal */}
        <EditPaymentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onSuccess={handleEditSuccess}
        />
      </div>
    </>
  );
}