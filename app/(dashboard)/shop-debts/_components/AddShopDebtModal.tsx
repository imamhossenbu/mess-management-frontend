import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Store, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateBulkShopDebt } from "@/lib/hooks/useShopDebts";
import { parseBanglaNumber, formatBanglaNumber } from "@/lib/banglaParser";

interface FormItem {
  itemDetails: string;
  amount: string;
}

export function AddShopDebtModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [shopName, setShopName] = useState("Local Shop");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [items, setItems] = useState<FormItem[]>([{ itemDetails: "", amount: "" }]);

  const createBulkMutation = useCreateBulkShopDebt();

  const handleItemChange = (index: number, field: keyof FormItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { itemDetails: "", amount: "" }]);
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payloadItems = items.map(item => ({
      shopName,
      date,
      note: note || undefined,
      itemDetails: item.itemDetails || undefined,
      amount: parseBanglaNumber(item.amount)
    }));

    if (payloadItems.some(i => i.amount <= 0)) {
      toast.error("Amount must be greater than 0");
      return;
    }

    createBulkMutation.mutate({ items: payloadItems }, {
      onSuccess: () => {
        toast.success("Shop debts added successfully");
        setItems([{ itemDetails: "", amount: "" }]);
        setNote("");
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to add shop debts");
      }
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + parseBanglaNumber(item.amount), 0);

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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-6 h-6 text-rose-500" />
                    Log New Shop Debt
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-500">Items</label>
                      <button type="button" onClick={addItem} className="text-xs text-primary-600 font-bold flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Item
                      </button>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Item details (e.g. Rice 5kg)"
                            value={item.itemDetails}
                            onChange={e => handleItemChange(index, "itemDetails", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                            required
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={e => handleItemChange(index, "amount", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                            required
                          />
                        </div>
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Note</label>
                    <input
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-lg font-bold text-slate-800">
                      Total: ৳ {formatBanglaNumber(totalAmount)}
                    </p>
                    <div className="flex gap-2">
                      <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl">Cancel</button>
                      <button type="submit" disabled={createBulkMutation.isPending} className="px-6 py-2 bg-rose-500 text-white rounded-xl">
                        {createBulkMutation.isPending ? "Submitting..." : "Submit Debt"}
                      </button>
                    </div>
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
