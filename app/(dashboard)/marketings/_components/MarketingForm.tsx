/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { ShoppingBag, Plus, Trash2, Upload, Image as ImageIcon, X, Camera } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreateMarketing } from "@/lib/hooks/useMarketings";
import { useUsers } from "@/lib/hooks/useUsers";
import { parseBanglaNumber } from "@/lib/banglaParser";
import Image from "next/image";

const UNITS = ["KG", "GRAM", "LITER", "ML", "PIECE", "DOZEN", "PACKET", "BOTTLE"];

interface MarketingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  canEdit?: boolean;
}

interface FormItem {
  itemName: string;
  totalPrice: number | string;
  note?: string;
}

export function MarketingForm({ onSuccess, onCancel }: MarketingFormProps) {
  const createMarketing = useCreateMarketing();
  const { members, isLoading: loadingUsers } = useUsers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    shopName: "",
    paymentType: "CASH",
    note: "",
    items: [
      {
        itemName: "",
        totalPrice: "",
        note: "",
      } as FormItem,
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = file.size || 0;
      if (fileSize > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, GIF, and WEBP images are allowed");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleItemChange = (index: number, field: keyof FormItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemName: "",
          totalPrice: "",
          note: ""
        } as FormItem,
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
      (item) => !item.itemName.trim() || parseBanglaNumber(item.totalPrice) <= 0
    );
    if (invalidItems.length > 0) {
      toast.error("Please fill in all item names and valid amounts");
      return;
    }

    const itemsArray = formData.items.map((item) => ({
      itemName: item.itemName.trim(),
      totalPrice: parseBanglaNumber(item.totalPrice),
      note: item.note || undefined,
    }));

    const payload = {
      date: formData.date,
      shopName: formData.shopName || undefined,
      paymentType: formData.paymentType,
      memberId: selectedUserId,
      note: formData.note || undefined,
      items: itemsArray,
      image: selectedImage || undefined,
    };

    console.log("📦 Create payload:", payload);

    setIsSubmitting(true);
    createMarketing.mutate(payload, {
      onSuccess: () => {
        toast.success("Bazar entry created successfully!");
        onSuccess();
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Failed to create bazar entry";
        toast.error(message);
        console.error("❌ Create error:", error);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Card className="p-6 border border-slate-100 bg-white">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary-500" /> Log Bazar Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Section */}
        <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <ImageIcon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Upload Bazar Image
                </p>
                <p className="text-xs text-slate-400">
                  JPEG, PNG, GIF, WEBP (Max 10MB)
                </p>
              </div>
            </div>

            {!imagePreview ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={removeImage}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {imagePreview && (
            <div className="mt-3 relative">
              <Image
                src={imagePreview}
                alt="Bazar preview"
                width={400}
                height={200}
                className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
              />
              <p className="text-xs text-slate-400 mt-1">
                {selectedImage?.name} ({((selectedImage?.size || 0) / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

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
            <p className="text-[10px] text-slate-400 mt-1">* Member will be recorded automatically</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Payment Type
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
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
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Amount (TK)"
                  value={item.totalPrice}
                  onChange={(e) => handleItemChange(index, "totalPrice", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  required
                />
                
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0"
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

        {/* Total Summary */}
        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                Total Amount
              </p>
              <p className="text-sm text-slate-500">{formData.items.length} items</p>
            </div>
            <p className="text-2xl font-bold text-primary-700">
              ৳ {formData.items.reduce((sum, item) => sum + parseBanglaNumber(item.totalPrice), 0).toFixed(2)}
            </p>
          </div>
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
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Purchase"
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}