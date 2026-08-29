// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/(dashboard)/inventory/_components/AdjustStockForm.tsx
// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/Card";
// import { Package, Plus, Minus } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAddInventory, useRemoveInventory } from "@/lib/hooks/useInventory";
// import { useInventory } from "@/lib/hooks/useInventory";

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

// interface AdjustStockFormProps {
//   onSuccess: () => void;
//   canEdit: boolean;
// }

// export function AdjustStockForm({ onSuccess, canEdit }: AdjustStockFormProps) {
//   const [actionType, setActionType] = useState<"ADD" | "REMOVE">("ADD");
//   const [selectedItem, setSelectedItem] = useState<string>("");
//   const [quantity, setQuantity] = useState("");
//   const [unit, setUnit] = useState("KG");
//   const [note, setNote] = useState("");

//   const { data: inventory } = useInventory();
//   const addInventory = useAddInventory();
//   const removeInventory = useRemoveInventory();

//   const isSubmitting = addInventory.isPending || removeInventory.isPending;

//   // Get all item names from inventory
//   const allItems = inventory ? Object.values(inventory).flat() : [];
//   const itemNames = allItems.map((item: any) => item.name);

//   // Get selected item's unit
//   const selectedItemData = allItems.find(
//     (item: any) => item.name === selectedItem,
//   );
//   const defaultUnit = selectedItemData?.unit || "KG";

//   // Update unit when item changes
//   const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const itemName = e.target.value;
//     setSelectedItem(itemName);
//     const item = allItems.find((i: any) => i.name === itemName);
//     if (item) {
//       setUnit(item.unit || "KG");
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedItem) {
//       toast.error("Please select an item");
//       return;
//     }

//     if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
//       toast.error("Please enter a valid positive quantity");
//       return;
//     }

//     const quantityNum = Number(quantity);
//     const payload = {
//       itemName: selectedItem,
//       quantity: quantityNum,
//       unit: unit,
//       note: note || undefined,
//     };

//     if (actionType === "ADD") {
//       addInventory.mutate(payload, {
//         onSuccess: () => {
//           onSuccess();
//           setQuantity("");
//           setNote("");
//         },
//       });
//     } else {
//       removeInventory.mutate(payload, {
//         onSuccess: () => {
//           onSuccess();
//           setQuantity("");
//           setNote("");
//         },
//       });
//     }
//   };

//   if (!canEdit) return null;

//   return (
//     <Card className="p-6 bg-white border border-slate-100 h-fit">
//       <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
//         <Package className="w-5 h-5 text-primary-500" /> Adjust Stock
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//             Adjustment Type
//           </label>
//           <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
//             <button
//               type="button"
//               onClick={() => setActionType("ADD")}
//               className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
//                 actionType === "ADD"
//                   ? "bg-white text-slate-800 shadow-sm"
//                   : "text-slate-500 hover:text-slate-800"
//               }`}
//             >
//               <Plus className="w-3.5 h-3.5" /> Add Stock
//             </button>
//             <button
//               type="button"
//               onClick={() => setActionType("REMOVE")}
//               className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
//                 actionType === "REMOVE"
//                   ? "bg-white text-slate-800 shadow-sm"
//                   : "text-slate-500 hover:text-slate-800"
//               }`}
//             >
//               <Minus className="w-3.5 h-3.5" /> Consume Stock
//             </button>
//           </div>
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//             Select Item
//           </label>
//           <select
//             value={selectedItem}
//             onChange={handleItemChange}
//             className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//             required
//           >
//             <option value="">Select an item...</option>
//             {itemNames.map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//               Quantity
//             </label>
//             <input
//               type="number"
//               placeholder="e.g. 10"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//               required
//               min="1"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//               Unit
//             </label>
//             <select
//               value={unit}
//               onChange={(e) => setUnit(e.target.value)}
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//             >
//               {UNITS.map((u) => (
//                 <option key={u} value={u}>
//                   {u}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
//             Note (Optional)
//           </label>
//           <input
//             type="text"
//             placeholder={
//               actionType === "ADD"
//                 ? "e.g. Purchased from bazar"
//                 : "e.g. Used for cooking"
//             }
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting || !selectedItem}
//           className={`w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
//             actionType === "ADD"
//               ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-100"
//               : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-100"
//           }`}
//         >
//           {isSubmitting ? (
//             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//           ) : (
//             <>
//               {actionType === "ADD" ? (
//                 <Plus className="w-4 h-4" />
//               ) : (
//                 <Minus className="w-4 h-4" />
//               )}
//               Confirm Adjustment
//             </>
//           )}
//         </button>
//       </form>
//     </Card>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/AdjustStockForm.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Package, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useAddInventory, useRemoveInventory } from "@/lib/hooks/useInventory";
import { useInventory } from "@/lib/hooks/useInventory";
import { parseBanglaNumber } from "@/lib/banglaParser";

interface AdjustStockFormProps {
  onSuccess: () => void;
  canEdit: boolean;
}

export function AdjustStockForm({ onSuccess, canEdit }: AdjustStockFormProps) {
  const [actionType, setActionType] = useState<"ADD" | "REMOVE">("ADD");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const { data: inventory } = useInventory();
  const addInventory = useAddInventory();
  const removeInventory = useRemoveInventory();

  const isSubmitting = addInventory.isPending || removeInventory.isPending;

  // Get all item names from inventory
  const allItems = inventory ? Object.values(inventory).flat() : [];
  const itemNames = allItems.map((item: any) => item.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    const parsedQuantity = parseBanglaNumber(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Please enter a valid positive quantity");
      return;
    }

    const payload = {
      itemName: selectedItem,
      quantity: parsedQuantity,
      note: note || undefined,
    };

    if (actionType === "ADD") {
      addInventory.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          setQuantity("");
          setNote("");
        },
      });
    } else {
      removeInventory.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          setQuantity("");
          setNote("");
        },
      });
    }
  };

  if (!canEdit) return null;

  return (
    <Card className="p-6 bg-white border border-slate-100 h-fit">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary-500" /> Adjust Stock
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Adjustment Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActionType("ADD")}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${actionType === "ADD"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <Plus className="w-3.5 h-3.5" /> Add Stock
            </button>
            <button
              type="button"
              onClick={() => setActionType("REMOVE")}
              className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${actionType === "REMOVE"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <Minus className="w-3.5 h-3.5" /> Consume Stock
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Select Item
          </label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          >
            <option value="">Select an item...</option>
            {itemNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Quantity
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Note (Optional)
          </label>
          <input
            type="text"
            placeholder={
              actionType === "ADD"
                ? "e.g. Purchased from bazar"
                : "e.g. Used for cooking"
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedItem}
          className={`w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${actionType === "ADD"
              ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-100"
              : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-100"
            }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {actionType === "ADD" ? (
                <Plus className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              Confirm Adjustment
            </>
          )}
        </button>
      </form>
    </Card>
  );
}