// components/ui/ConfirmModal.tsx
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle, X, CheckCircle, HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
}: ConfirmModalProps) {
  
  const iconConfig = {
    danger: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: AlertTriangle,
      buttonBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    },
    warning: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      icon: AlertTriangle,
      buttonBg: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400"
    },
    success: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      icon: CheckCircle,
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      icon: HelpCircle,
      buttonBg: "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
    }
  };

  const cfg = iconConfig[variant];
  const IconComponent = cfg.icon;

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                      <IconComponent className={`h-5 w-5 ${cfg.text}`} />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-slate-900"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer ${cfg.buttonBg}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText
                    )}
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
