/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingViewModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShoppingBag, User, Calendar, CreditCard, Store, FileText, Package } from "lucide-react";
import { format } from "date-fns";

interface MarketingViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

export function MarketingViewModal({ isOpen, onClose, data }: MarketingViewModalProps) {
    if (!data) return null;

    const getPaymentTypeColor = (type: string) => {
        switch (type) {
            case "CASH":
                return "bg-blue-50 text-blue-600 border-blue-200";
            case "DEBT":
                return "bg-rose-50 text-rose-600 border-rose-200";
            case "SELF":
                return "bg-purple-50 text-purple-600 border-purple-200";
            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 rounded-xl">
                                            <ShoppingBag className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-lg font-bold text-slate-900">
                                            Bazar Details
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {/* Basic Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                Date
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 mt-1">
                                                {format(new Date(data.date), "EEEE, MMMM dd, yyyy")}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <User className="w-4 h-4" />
                                                Added By
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 mt-1">
                                                {data.userName || "Unknown"}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <CreditCard className="w-4 h-4" />
                                                Payment Type
                                            </div>
                                            <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getPaymentTypeColor(data.paymentType)}`}>
                                                {data.paymentType}
                                            </span>
                                        </div>

                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Store className="w-4 h-4" />
                                                Shop
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 mt-1">
                                                {data.shopName || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                Items ({data.items?.length || 0})
                                            </p>
                                        </div>
                                        <div className="divide-y divide-slate-50">
                                            {data.items?.map((item: any, index: number) => (
                                                <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{item.itemName}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {item.quantity} {item.unit} × ৳{item.price}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        ৳{item.totalPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total Amount */}
                                    <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                                        <div>
                                            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Total Amount</p>
                                            <p className="text-sm text-slate-500">{data.items?.length || 0} items</p>
                                        </div>
                                        <p className="text-2xl font-bold text-primary-700">
                                            ৳ {Number(data.totalAmount).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Note */}
                                    {data.note && (
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <FileText className="w-4 h-4" />
                                                Note
                                            </div>
                                            <p className="text-sm text-slate-700 mt-1">{data.note}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}