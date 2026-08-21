/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/utility-bills/_components/EditUtilityBillModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, FileText } from "lucide-react";
import { UtilityBillForm } from "./UtilityBillForm";

interface EditUtilityBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: any;
    onSuccess: () => void;
}

export function EditUtilityBillModal({
    isOpen,
    onClose,
    bill,
    onSuccess,
}: EditUtilityBillModalProps) {
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 rounded-xl">
                                            <FileText className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-bold text-slate-900"
                                        >
                                            Edit Utility Bill
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <UtilityBillForm
                                        onSuccess={() => {
                                            onSuccess();
                                            onClose();
                                        }}
                                        onCancel={onClose}
                                        editData={bill}
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}