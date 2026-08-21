// app/(dashboard)/payments/_components/PaymentHeader.tsx
"use client";

import { Plus } from "lucide-react";

interface PaymentHeaderProps {
    onAddClick: () => void;
    canEdit: boolean;
}

export function PaymentHeader({ onAddClick, canEdit }: PaymentHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Member Deposits</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Log deposits, track user cash ledger, and audit overall finances.
                </p>
            </div>

            {canEdit && (
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Record Deposit
                </button>
            )}
        </div>
    );
}