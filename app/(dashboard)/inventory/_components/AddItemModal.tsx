// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/(dashboard)/inventory/_components/AddItemModal.tsx
// "use client";

// import { Fragment, useState } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { X, Package, Plus } from "lucide-react";
// import toast from "react-hot-toast";
// import { useCreateInventoryItem } from "@/lib/hooks/useInventory";

// const CATEGORIES = [
//   "FISH",
//   "MEAT",
//   "VEGETABLE",
//   "FRUIT",
//   "DAIRY",
//   "OIL",
//   "SPICE",
//   "RICE",
//   "OTHER",
// ];

// const UNITS = [
//   "KG",
//   "GRAM",
//   "LITER",
//   "ML",
//   "PIECE",
//   "DOZEN",
//   "PACKET",
//   "BOTTLE",
// ];

// interface AddItemModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export function AddItemModal({
//   isOpen,
//   onClose,
//   onSuccess,
// }: AddItemModalProps) {
//   const createItem = useCreateInventoryItem();
//   const [formData, setFormData] = useState<{
//     name: string;
//     category: string;
//     unit: string;
//     initialQuantity: string | number;
//     minStockLevel: string | number;
//     purchasePrice: string;
//   }>({
//     name: "",
//     category: "OTHER",
//     unit: "KG",
//     initialQuantity: 0,
//     minStockLevel: 5,
//     purchasePrice: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name.trim()) {
//       toast.error("Please enter item name");
//       return;
//     }

//     const payload = {
//       name: formData.name.trim(),
//       category: formData.category,
//       unit: formData.unit,
//       initialQuantity: Number(formData.initialQuantity) || 0,
//       minStockLevel: Number(formData.minStockLevel) || 5,
//       purchasePrice: formData.purchasePrice
//         ? Number(formData.purchasePrice)
//         : undefined,
//     };

//     setIsSubmitting(true);
//     createItem.mutate(payload, {
//       onSuccess: () => {
//         toast.success(`"${formData.name}" added to inventory!`);
//         onSuccess();
//         onClose();
//         setFormData({
//           name: "",
//           category: "OTHER",
//           unit: "KG",
//           initialQuantity: 0,
//           minStockLevel: 5,
//           purchasePrice: "",
//         });
//         setIsSubmitting(false);
//       },
//       onError: (error: any) => {
//         toast.error(error.response?.data?.message || "Failed to add item");
//         setIsSubmitting(false);
//       },
//     });
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <div className="flex items-start justify-between border-b border-slate-100 pb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-primary-50 rounded-xl">
//                       <Package className="w-5 h-5 text-primary-500" />
//                     </div>
//                     <Dialog.Title
//                       as="h3"
//                       className="text-lg font-bold text-slate-900"
//                     >
//                       Add New Inventory Item
//                     </Dialog.Title>
//                   </div>
//                   <button
//                     onClick={onClose}
//                     className="p-1.5 hover:bg-slate-100 rounded-lg transition"
//                   >
//                     <X className="w-5 h-5 text-slate-400" />
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                       Item Name *
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Rui Fish, Chicken, Potato"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                         Category *
//                       </label>
//                       <select
//                         value={formData.category}
//                         onChange={(e) =>
//                           setFormData({ ...formData, category: e.target.value })
//                         }
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                       >
//                         {CATEGORIES.map((cat) => (
//                           <option key={cat} value={cat}>
//                             {cat}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                         Unit *
//                       </label>
//                       <select
//                         value={formData.unit}
//                         onChange={(e) =>
//                           setFormData({ ...formData, unit: e.target.value })
//                         }
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                       >
//                         {UNITS.map((unit) => (
//                           <option key={unit} value={unit}>
//                             {unit}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                         Initial Quantity
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         value={formData.initialQuantity}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             initialQuantity: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                         min="0"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                         Min Stock Level
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="5"
//                         value={formData.minStockLevel}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             minStockLevel: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                         min="0"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//                       Purchase Price (৳)
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="0"
//                       value={formData.purchasePrice}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           purchasePrice: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>

//                   <div className="flex justify-end gap-3 pt-2">
//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50"
//                     >
//                       {isSubmitting ? (
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       ) : (
//                         <>
//                           <Plus className="w-4 h-4" /> Add Item
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/AddItemModal.tsx
"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Package, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateInventoryItem } from "@/lib/hooks/useInventory";

const CATEGORIES = [
  "FISH",
  "MEAT",
  "VEGETABLE",
  "FRUIT",
  "DAIRY",
  "OIL",
  "SPICE",
  "RICE",
  "OTHER",
];

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddItemModalProps) {
  const createItem = useCreateInventoryItem();
  const [formData, setFormData] = useState({
    name: "",
    category: "OTHER",
    initialQuantity: 0,
    minStockLevel: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter item name");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      initialQuantity: Number(formData.initialQuantity) || 0,
      minStockLevel: Number(formData.minStockLevel) || 5,
    };

    setIsSubmitting(true);
    createItem.mutate(payload, {
      onSuccess: () => {
        toast.success(`"${formData.name}" added to inventory!`);
        onSuccess();
        onClose();
        setFormData({
          name: "",
          category: "OTHER",
          initialQuantity: 0,
          minStockLevel: 5,
        });
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to add item");
        setIsSubmitting(false);
      },
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
                      <Package className="w-5 h-5 text-primary-500" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-slate-900"
                    >
                      Add New Inventory Item
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rui Fish, Chicken, Potato"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Initial Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.initialQuantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initialQuantity: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Min Stock Level
                      </label>
                      <input
                        type="number"
                        placeholder="5"
                        value={formData.minStockLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minStockLevel: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add Item
                        </>
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