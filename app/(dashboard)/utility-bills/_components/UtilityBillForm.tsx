/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/utility-bills/_components/UtilityBillForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreateUtilityBill, useUpdateUtilityBill } from "@/lib/hooks/useUtilityBills";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { parseBanglaNumber } from "@/lib/banglaParser";
import type { BillType } from "@/lib/api/utility-bills";

const BILL_TYPES: { value: BillType; label: string }[] = [
    { value: "CURRENT", label: "Electricity (বিদ্যুৎ)" },
    { value: "WIFI", label: "Internet / Wifi (ওয়াইফাই)" },
    { value: "RENT", label: "House Rent (বাসা ভাড়া)" },
    { value: "WATER", label: "Water (পানি)" },
    { value: "KHALA", label: "Cook / Khala (খালা)" },
];

interface UtilityBillFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    editData?: any;
}

export function UtilityBillForm({ onSuccess, onCancel, editData }: UtilityBillFormProps) {
    const createMutation = useCreateUtilityBill();
    const updateMutation = useUpdateUtilityBill();
    const isEditing = !!editData;

    const [billType, setBillType] = useState<BillType>("CURRENT");
    const [amount, setAmount] = useState("");
    const [paidByUserId, setPaidByUserId] = useState("");
    const [billMonthYear, setBillMonthYear] = useState(format(new Date(), "yyyy-MM-dd"));
    const [note, setNote] = useState("");

    const { data: users } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await usersApi.getAll();
            return res.data;
        },
    });

    const activeUsers = users?.filter((u: any) => u.isActive) || [];

    useEffect(() => {
        if (editData) {
            setBillType(editData.billType as BillType || "CURRENT");
            setAmount(String(editData.amount || ""));
            setPaidByUserId(editData.paidBy || "");
            setBillMonthYear(format(new Date(editData.monthYear), "yyyy-MM-dd"));
            setNote(editData.note || "");
        }
    }, [editData]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedAmount = parseBanglaNumber(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Please enter a valid bill amount");
            return;
        }

        const paidBy = paidByUserId && paidByUserId.trim() !== "" ? paidByUserId : undefined;

        const data = {
            billType: billType,
            monthYear: billMonthYear,
            amount: parsedAmount,
            paidBy,
            note: note || undefined,
        };

        if (isEditing) {
            // ✅ Update করার সময় সব data পাঠান
            updateMutation.mutate(
                {
                    id: editData.id,
                    data: {
                        billType: data.billType,
                        amount: data.amount,
                        monthYear: data.monthYear,  // ✅ monthYear যোগ করুন
                        paidBy: data.paidBy,
                        note: data.note,
                    }
                },
                {
                    onSuccess: () => {
                        onSuccess();
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        }
    };

    return (
        <Card className="p-6 border border-slate-100 bg-white">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                {isEditing ? "Edit Utility Bill" : "Log Utility Bill"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bill Type</label>
                        <select
                            value={billType}
                            onChange={(e) => setBillType(e.target.value as BillType)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {BILL_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bill Month</label>
                        <input
                            type="date"
                            value={billMonthYear}
                            onChange={(e) => setBillMonthYear(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Amount (৳)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="e.g. 500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Payer (Optional)</label>
                        <select
                            value={paidByUserId}
                            onChange={(e) => setPaidByUserId(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            <option value="">-- Mess Fund --</option>
                            {activeUsers.map((user: any) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
                    <input
                        type="text"
                        placeholder="e.g. Wifi bill for August"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditing ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            isEditing ? "Update Bill" : "Save Bill"
                        )}
                    </button>
                </div>
            </form>
        </Card>
    );
}