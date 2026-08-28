/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/PaymentsClient.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  usePaymentsByMonth,
  useAllUserBalances,
  useDeletePayment,
  useUserPayments,
  useUserBalance,
} from "@/lib/hooks/usePayments";
import { PaymentHeader } from "./PaymentHeader";
import { PaymentStats } from "./PaymentStats";
import { PaymentForm } from "./PaymentForm";
import { BalanceList } from "./BalanceList";
import { TransactionList } from "./TransactionList";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { MemberPaymentView } from "./MemberPaymentView";

// ✅ Dynamic import — modal only loads when opened
const EditPaymentModal = dynamic(
  () => import("./EditPaymentModal").then(m => ({ default: m.EditPaymentModal })),
  { ssr: false },
);

export function PaymentsClient() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const { isAdmin, isManager, isMember, user } = useAuth();
  const canEdit = isAdmin || isManager;

  const { data: transactions, isLoading: loadingTx, refetch } = usePaymentsByMonth(selectedYear, selectedMonth);
  const { data: balances, isLoading: loadingBal } = useAllUserBalances();
  const deletePayment = useDeletePayment();

  // Member's monthly parameters
  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
  const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split("T")[0];

  // Member's own data
  const { data: myPayments, isLoading: loadingMyTx, refetch: refetchMyTx } = useUserPayments(
    isMember ? (user?.id ?? "") : "",
    startDate,
    endDate
  );
  const { data: myBalance, isLoading: loadingMyBal } = useUserBalance(
    isMember ? (user?.id ?? "") : "",
  );

  const totalDeposits =
    transactions?.reduce((sum, item) => sum + Number(item.amount), 0) ?? 0;


  const handleDelete = (id: string) => {
    deletePayment.mutate(id, { onSuccess: () => refetch() });
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


  // ── MEMBER VIEW ──
  if (isMember && user) {
    return (
      <MemberPaymentView
        user={user}
        myBalance={myBalance}
        myPayments={myPayments ?? []}
        isLoadingBalance={loadingMyBal}
        isLoadingPayments={loadingMyTx}
        onPaymentAdded={refetchMyTx}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
      />
    );
  }

  // ── ADMIN / MANAGER VIEW ──
  return (
    <>
      {deletePayment.isPending && <LoadingOverlay message="Deleting payment..." />}

      <div className="space-y-8">
        <PaymentHeader 
          onAddClick={() => setShowForm(!showForm)} 
          canEdit={canEdit} 
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />

        {showForm && canEdit && (
          <PaymentForm
            onSuccess={() => { setShowForm(false); refetch(); }}
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

        {/* ✅ Only renders when modal is open */}
        {isEditModalOpen && (
          <EditPaymentModal
            isOpen={isEditModalOpen}
            onClose={() => { setIsEditModalOpen(false); setSelectedPayment(null); }}
            payment={selectedPayment}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </>
  );
}
