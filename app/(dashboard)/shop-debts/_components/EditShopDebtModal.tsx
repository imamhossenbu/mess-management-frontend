/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateShopDebt } from "@/lib/hooks/useShopDebts";
import { parseBanglaNumber } from "@/lib/banglaParser";
import { format } from "date-fns";

interface EditShopDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: any;
  onSuccess: () => void;
}

export function EditShopDebtModal({
  isOpen,
  onClose,
  debt,
  onSuccess,
}: EditShopDebtModalProps) {
  const updateDebt = useUpdateShopDebt();
  const [formData, setFormData] = useState({
    shopName: "",
    date: "",
    itemDetails: "",
    amount: "",
    note: "",
  });

  const isSubmitting = updateDebt.isPending;

  useEffect(() => {
    if (debt) {
      setFormData({
        shopName: debt.shopName || "",
        date: debt.date
          ? format(new Date(debt.date), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        itemDetails: debt.itemDetails || "",
        amount: String(debt.amount || ""),
        note: debt.note || "",
      });
    }
  }, [debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shopName.trim()) {
      toast.error("Please enter a shop name");
      return;
    }

    const parsedAmount = parseBanglaNumber(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    updateDebt.mutate(
      {
        id: debt.id,
        data: {
          shopName: formData.shopName.trim(),
          date: formData.date,
          itemDetails: formData.itemDetails || undefined,
          amount: parsedAmount,
          note: formData.note || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Debt updated successfully!");
          onSuccess();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update debt");
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
                    <div className="p-2 bg-rose-50 rounded-xl">
                      <ShoppingBag className="w-5 h-5 text-rose-500" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-slate-900"
                    >
                      Edit Shop Debt
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
                      Shop Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahim Store"
                      value={formData.shopName}
                      onChange={(e) =>
                        setFormData({ ...formData, shopName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Amount (৳) *
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Items / Details (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5kg Rice, 2kg Dal"
                      value={formData.itemDetails}
                      onChange={(e) =>
                        setFormData({ ...formData, itemDetails: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Any notes"
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                      className="flex items-center justify-center min-w-[120px] px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Save Changes"
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
