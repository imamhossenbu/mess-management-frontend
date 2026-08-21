// app/(dashboard)/utility-bills/_components/UtilityBillHeader.tsx
"use client";

import { Plus } from "lucide-react";

interface UtilityBillHeaderProps {
    onAddClick: () => void;
    canEdit: boolean;
}

export function UtilityBillHeader({ onAddClick, canEdit }: UtilityBillHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Utility Bills</h1>
                <p className="text-slate-500 mt-1">
                    Track joint expenses and monthly utility shares per member.
                </p>
            </div>

            {canEdit && (
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Utility Bill
                </button>
            )}
        </div>
    );
}