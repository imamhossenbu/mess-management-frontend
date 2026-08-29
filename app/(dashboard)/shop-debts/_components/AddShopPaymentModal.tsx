import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Banknote, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateShopPayment } from "@/lib/hooks/useShopDebts";
import { parseBanglaNumber } from "@/lib/banglaParser";

export function AddShopPaymentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [shopName, setShopName] = useState("Local Shop");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  const createPaymentMutation = useCreateShopPayment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseBanglaNumber(amount);
    if (parsedAmount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    createPaymentMutation.mutate({
      shopName,
      date,
      amount: parsedAmount,
      note: note || undefined,
    }, {
      onSuccess: () => {
        toast.success("Payment logged successfully");
        setAmount("");
        setNote("");
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to log payment");
      }
    });
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="w-6 h-6 text-emerald-500" />
                    Log Shop Payment
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Shop Name</label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Note (Optional)</label>
                    <input
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl">Cancel</button>
                    <button type="submit" disabled={createPaymentMutation.isPending} className="px-6 py-2 bg-emerald-500 text-white rounded-xl">
                      {createPaymentMutation.isPending ? "Submitting..." : "Submit Payment"}
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
