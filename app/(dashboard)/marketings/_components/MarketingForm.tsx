/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreateMarketing } from "@/lib/hooks/useMarketings";
import { useUsers } from "@/lib/hooks/useUsers";

const UNITS = [
  "KG",
  "GRAM",
  "LITER",
  "ML",
  "PIECE",
  "DOZEN",
  "PACKET",
  "BOTTLE",
];

interface MarketingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  canEdit: boolean;
}

interface FormItem {
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  note?: string;
  addToInventory: boolean;
}

export function MarketingForm({
  onSuccess,
  onCancel,
  canEdit,
}: MarketingFormProps) {
  const createMarketing = useCreateMarketing();
  const { members, isLoading: loadingUsers } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    shopName: "",
    paymentType: "CASH",
    note: "",
    items: [
      {
        itemName: "",
        quantity: 0,
        unit: "KG",
        price: 0,
        totalPrice: 0,
        note: "",
        addToInventory: false,
      } as FormItem,
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default user (current user)
  useEffect(() => {
    if (members && members.length > 0 && !selectedUserId) {
      const currentUser = members.find((m: any) => m.isCurrentUser);
      if (currentUser) {
        setSelectedUserId(currentUser.userId);
      } else if (members[0]) {
        setSelectedUserId(members[0].userId);
      }
    }
  }, [members, selectedUserId]);

  const handleItemChange = (
    index: number,
    field: keyof FormItem,
    value: any,
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "price") {
      const quantity = field === "quantity" ? value : newItems[index].quantity;
      const price = field === "price" ? value : newItems[index].price;
      newItems[index].totalPrice = (quantity || 0) * (price || 0);
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemName: "",
          quantity: 0,
          unit: "KG",
          price: 0,
          totalPrice: 0,
          note: "",
          addToInventory: false,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a member");
      return;
    }

    const invalidItems = formData.items.filter(
      (item) => !item.itemName.trim() || item.price <= 0 || item.quantity <= 0,
    );
    if (invalidItems.length > 0) {
      toast.error("Please fill in all item names, quantities, and prices");
      return;
    }

    const payload = {
      date: formData.date,
      shopName: formData.shopName || undefined,
      paymentType: formData.paymentType,
      note: formData.note || undefined,
      items: formData.items.map((item) => ({
        itemName: item.itemName.trim(),
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        totalPrice: item.totalPrice,
        note: item.note || undefined,
        addToInventory: item.addToInventory,
      })),
    };

    console.log("📦 Sending payload:", payload);

    setIsSubmitting(true);
    createMarketing.mutate(payload, {
      onSuccess: () => {
        // ✅ Toast is already shown in hook
        onSuccess();
        setIsSubmitting(false);
      },
      onError: () => {
        // ✅ Toast is already shown in hook
        setIsSubmitting(false);
      },
    });
  };

  if (!canEdit) return null;

  return (
    <Card className="p-6 border border-slate-100 bg-white">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary-500" /> Log Bazar Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Selection - UI only */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Added By *
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              required
              disabled={loadingUsers}
            >
              <option value="">Select Member</option>
              {members?.map((member: any) => (
                <option key={member.userId} value={member.userId}>
                  {member.userName} {member.isCurrentUser ? "(You)" : ""}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              * Selected member will be recorded
            </p>
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
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Shop Name
            </label>
            <input
              type="text"
              placeholder="e.g. Local Bazar"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Payment Type
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) =>
                setFormData({ ...formData, paymentType: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="CASH">Cash</option>
              <option value="DEBT">Debt</option>
              <option value="SELF">Self</option>
            </select>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Items
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-slate-50 rounded-xl"
            >
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemChange(index, "itemName", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <select
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(index, "unit", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price || ""}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Total"
                  value={item.totalPrice.toFixed(2)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                  readOnly
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Note
          </label>
          <textarea
            placeholder="Additional notes..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 h-16"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedUserId}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Purchase"}
          </button>
        </div>
      </form>
    </Card>
  );
}
