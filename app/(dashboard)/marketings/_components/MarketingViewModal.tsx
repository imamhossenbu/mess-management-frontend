/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingViewModal.tsx
"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  ShoppingBag,
  User,
  Calendar,
  CreditCard,
  Store,
  FileText,
  Package,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { formatBanglaNumber } from "@/lib/banglaParser";

interface MarketingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export function MarketingViewModal({
  isOpen,
  onClose,
  data,
}: MarketingViewModalProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

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
    <>
      {/* Main Modal */}
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all max-h-[95vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-xl">
                        <ShoppingBag className="w-5 h-5 text-primary-500" />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold text-slate-900"
                      >
                        Bazar Details
                      </Dialog.Title>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        #{data.id?.slice(-6) || "N/A"}
                      </span>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-slate-100 rounded-xl transition"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* ✅ Image Section - Full Width with Click to Expand */}
                    {data.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <div
                          className="relative w-full max-h-[400px] cursor-pointer group"
                          onClick={() => setImageModalOpen(true)}
                        >
                          <Image
                            src={data.imageUrl}
                            alt="Bazar receipt"
                            width={800}
                            height={400}
                            className="w-full h-auto max-h-[400px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                              <Maximize2 className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Click to enlarge
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between">
                          <p className="text-xs text-slate-400 flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" />
                            Click image to view full size
                          </p>
                          <button
                            onClick={() => setImageModalOpen(true)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                          >
                            <Maximize2 className="w-3 h-3" />
                            Expand
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Info Grid - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                        <p className="text-base font-semibold text-slate-800 mt-1">
                          {format(new Date(data.date), "EEEE, MMMM dd, yyyy")}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <User className="w-4 h-4" />
                          Added By
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-semibold">
                            {data.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <p className="text-base font-semibold text-slate-800">
                            {data.userName || "Unknown"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <CreditCard className="w-4 h-4" />
                          Payment Type
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getPaymentTypeColor(data.paymentType)}`}
                          >
                            {data.paymentType}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Store className="w-4 h-4" />
                          Shop
                        </div>
                        <p className="text-base font-semibold text-slate-800 mt-1">
                          {data.shopName || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Items List - Full Width */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Items ({formatBanglaNumber(data.items?.length || 0)})
                        </p>
                        <p className="text-xs text-slate-400">
                          Total: ৳ {formatBanglaNumber(Number(data.totalAmount))}
                        </p>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {data.items?.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition"
                          >
                            <div className="flex-1">
                              <p className="text-base font-medium text-slate-800">
                                {item.itemName}
                              </p>
                            </div>
                            <p className="text-base font-bold text-slate-800">
                              ৳{formatBanglaNumber(item.totalPrice)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Amount - Highlighted */}
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border border-primary-100">
                      <div>
                        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                          Total Amount
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatBanglaNumber(data.items?.length || 0)} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary-700">
                          ৳ {formatBanglaNumber(Number(data.totalAmount))}
                        </p>
                        <p className="text-xs text-primary-400">
                          {data.paymentType === "CASH"
                            ? "Paid in Cash"
                            : data.paymentType === "DEBT"
                              ? "On Credit"
                              : "Self Paid"}
                        </p>
                      </div>
                    </div>

                    {/* Note */}
                    {data.note && (
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FileText className="w-4 h-4" />
                          Note
                        </div>
                        <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                          {data.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer - Edit Button Removed */}
                  <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Created:{" "}
                      {format(new Date(data.createdAt), "MMM dd, yyyy h:mm a")}
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition"
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

      {/* ✅ Image Zoom Modal */}
      <Transition appear show={imageModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[60]"
          onClose={() => setImageModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" />
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
                <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-transparent shadow-2xl transition-all">
                  {/* Close Button */}
                  <button
                    onClick={() => setImageModalOpen(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Image */}
                  <div className="relative w-full">
                    <Image
                      src={data.imageUrl}
                      alt="Bazar receipt full size"
                      width={1200}
                      height={800}
                      className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
                    />
                  </div>

                  {/* Footer Text */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    Click outside or press ESC to close
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
