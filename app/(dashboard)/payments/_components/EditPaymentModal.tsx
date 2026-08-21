/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/payments/_components/EditPaymentModal.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, CreditCard } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useUpdatePayment } from "@/lib/hooks/usePayments";

interface EditPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: any;
    onSuccess: () => void;
}

export function EditPaymentModal({
    isOpen,
    onClose,
    payment,
    onSuccess,
}: EditPaymentModalProps) {
    const updatePayment = useUpdatePayment();
    const [formData, setFormData] = useState({
        amount: "",
        paymentDate: "",
        paymentMethod: "CASH",
        note: "",
    });

    const isSubmitting = updatePayment.isPending;

    useEffect(() => {
        if (payment) {
            setFormData({
                amount: String(payment.amount || ""),
                paymentDate: payment.paymentDate
                    ? format(new Date(payment.paymentDate), "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd"),
                paymentMethod: payment.paymentMethod || "CASH",
                note: payment.note || "",
            });
        }
    }, [payment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        updatePayment.mutate(
            {
                id: payment.id,
                data: {
                    amount: parseFloat(formData.amount),
                    paymentDate: formData.paymentDate,
                    paymentMethod: formData.paymentMethod as any,
                    note: formData.note || undefined,
                },
            },
            {
                onSuccess: () => {

                    onSuccess();
                    onClose();
                },
                onError: (error: any) => {
                    const msg = error.response?.data?.message || "Failed to update payment";
                    toast.error(msg);
                },
            }
        );
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {
                if (!isSubmitting) onClose();
            }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 rounded-xl">
                                            <CreditCard className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-bold text-slate-900"
                                        >
                                            Edit Payment
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            Amount (৳) *
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={formData.amount}
                                            onChange={(e) =>
                                                setFormData({ ...formData, amount: e.target.value })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                                            required
                                            min="1"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            Payment Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.paymentDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, paymentDate: e.target.value })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            Payment Method
                                        </label>
                                        <select
                                            value={formData.paymentMethod}
                                            onChange={(e) =>
                                                setFormData({ ...formData, paymentMethod: e.target.value })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            <option value="CASH">Cash (নগদ)</option>
                                            <option value="MOBILE_BANKING">Mobile Banking</option>
                                            <option value="BANK">Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                                            Note
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Add a note"
                                            value={formData.note}
                                            onChange={(e) =>
                                                setFormData({ ...formData, note: e.target.value })
                                            }
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                "Update Payment"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}