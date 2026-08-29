/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/PaymentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreatePayment } from "@/lib/hooks/usePayments";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { parseBanglaNumber } from "@/lib/banglaParser";

interface PaymentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
    const createPayment = useCreatePayment();
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK" | "MOBILE_BANKING">("CASH");
    const [note, setNote] = useState("");

    const { data: users, isLoading: loadingUsers } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await usersApi.getAll();
            return res.data;
        },
    });

    const activeUsers = users?.filter((u: any) => u.isActive) || [];

    const isSubmitting = createPayment.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error("Please select a member");
            return;
        }

        const parsedAmount = parseBanglaNumber(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        createPayment.mutate(
            {
                userId,
                amount: parsedAmount,
                paymentDate,
                paymentMethod,
                note: note || undefined,
            },
            {
                onSuccess: () => {

                    onSuccess();
                    setUserId("");
                    setAmount("");
                    setNote("");
                },
                onError: (error: any) => {
                    const msg = error.response?.data?.message || "Failed to create payment";
                    toast.error(msg);
                },
            }
        );
    };

    return (
        <Card className="p-6 border border-slate-100 bg-white">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-500" /> Record Member Deposit
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                            Member Name *
                        </label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            required
                            disabled={loadingUsers || isSubmitting}
                        >
                            <option value="">-- Select Member --</option>
                            {activeUsers.map((user: any) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} {user.email ? `(${user.email})` : ""}
                                </option>
                            ))}
                        </select>
                        {loadingUsers && (
                            <p className="text-xs text-slate-400 mt-1">Loading users...</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                            Amount (৳) *
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="e.g. 2000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                            Deposit Date
                        </label>
                        <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            <option value="CASH">Cash (নগদ)</option>
                            <option value="MOBILE_BANKING">Mobile Banking</option>
                            <option value="BANK">Bank Transfer</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Note
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Initial payment for August"
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
                        disabled={isSubmitting || !userId}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Deposit"
                        )}
                    </button>
                </div>
            </form>
        </Card>
    );
}