/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingEditModal.tsx
"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  ShoppingBag,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useUpdateMarketing } from "@/lib/hooks/useMarketings";
import Image from "next/image";

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

interface MarketingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onSuccess: () => void;
}

interface FormItem {
  id?: string;
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
  note?: string;
}

export function MarketingEditModal({
  isOpen,
  onClose,
  data,
  onSuccess,
}: MarketingEditModalProps) {
  const updateMarketing = useUpdateMarketing();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageMode, setIsImageMode] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    shopName: "",
    paymentType: "CASH",
    note: "",
    items: [] as FormItem[],
  });

  useEffect(() => {
    if (data) {
      const hasImage = data.imageUrl || false;
      const allSingleItems = data.items?.every(
        (item: any) => item.quantity === 1 && item.unit === "PIECE",
      );
      setIsImageMode(hasImage || allSingleItems);
      setImageRemoved(false);
      setSelectedImage(null);
      setImagePreview(null);

      setFormData({
        date: format(new Date(data.date), "yyyy-MM-dd"),
        shopName: data.shopName || "",
        paymentType: data.paymentType || "CASH",
        note: data.note || "",
        items: data.items?.map((item: any) => ({
          id: item.id,
          itemName: item.itemName || "",
          quantity: item.quantity || (hasImage ? 1 : 0),
          unit: item.unit || (hasImage ? "PIECE" : "KG"),
          price: item.price || 0,
          totalPrice: item.totalPrice || 0,
          note: item.note || "",
        })) || [
          {
            itemName: "",
            quantity: 1,
            unit: "PIECE",
            price: 0,
            totalPrice: 0,
            note: "",
          },
        ],
      });
    }
  }, [data]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = file.size || 0;
      if (fileSize > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
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

      setIsImageMode(true);
      setImageRemoved(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          quantity: isImageMode ? 1 : 0,
          unit: isImageMode ? "PIECE" : "KG",
          price: 0,
          totalPrice: 0,
          note: "",
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

    const invalidItems = formData.items.filter(
      (item) => !item.itemName.trim() || item.price <= 0,
    );
    if (invalidItems.length > 0) {
      toast.error("Please fill in all item names and prices");
      return;
    }

    const itemsArray = formData.items.map((item) => ({
      itemName: item.itemName.trim(),
      quantity: isImageMode ? 1 : Number(item.quantity || 1),
      unit: isImageMode ? "PIECE" : item.unit || "KG",
      price: Number(item.price),
      totalPrice:
        Number(item.price) * (isImageMode ? 1 : Number(item.quantity || 1)),
      note: item.note || undefined,
    }));

    const payload: any = {
      shopName: formData.shopName || undefined,
      paymentType: formData.paymentType,
      note: formData.note || undefined,
      items: itemsArray,
    };

    if (selectedImage) {
      payload.image = selectedImage;
    } else if (imageRemoved) {
      payload.removeImage = true;
    }

    setIsSubmitting(true);
    updateMarketing.mutate(
      {
        id: data.id,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Bazar entry updated successfully!");
          onSuccess();
          onClose();
          setIsSubmitting(false);
        },
        onError: (error: any) => {
          console.error("❌ [EDIT] Error:", error);
          const message =
            error.response?.data?.message || "Failed to update bazar entry";
          toast.error(message);
          setIsSubmitting(false);
        },
      },
    );
  };

  if (!data) return null;

  const showExistingActions = !imageRemoved && !imagePreview && data?.imageUrl;
  const showPreview = !imageRemoved && (imagePreview || data?.imageUrl);

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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-slate-900"
                    >
                      Edit Bazar Entry
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
                  {/* Image Upload Section */}
                  <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 ${isImageMode ? "bg-primary-100" : "bg-slate-100"} rounded-xl`}
                        >
                          {isImageMode ? (
                            <Camera className="w-5 h-5 text-primary-500" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {isImageMode ? "📷 Image Mode" : "Update Image"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {isImageMode
                              ? "Only Name & Price needed"
                              : "JPEG, PNG, GIF, WEBP (Max 10MB)"}
                          </p>
                        </div>
                      </div>

                      {showExistingActions ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setIsImageMode(!isImageMode)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isImageMode
                                ? "bg-primary-100 text-primary-700 border border-primary-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {isImageMode ? "Image Mode ON" : "Switch Mode"}
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                            title="Remove image"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : imagePreview ? (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                          title="Remove image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </button>
                      )}
                    </div>

                    {showPreview && (
                      <div className="mt-3 relative">
                        <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-slate-200">
                          <Image
                            src={imagePreview || data?.imageUrl}
                            alt="Bazar preview"
                            width={400}
                            height={200}
                            className="w-full max-h-48 object-cover"
                          />
                        </div>
                        {selectedImage && (
                          <p className="text-xs text-slate-400 mt-1">
                            {selectedImage?.name} (
                            {((selectedImage?.size || 0) / 1024 / 1024).toFixed(
                              2,
                            )}{" "}
                            MB)
                          </p>
                        )}
                      </div>
                    )}

                    {imageRemoved && (
                      <p className="text-xs text-rose-500 mt-2">
                        Image will be removed when you save.
                      </p>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Date cannot be changed
                      </p>
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
                          setFormData({
                            ...formData,
                            paymentType: e.target.value,
                          })
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
                        Items{" "}
                        {isImageMode && (
                          <span className="text-primary-500">
                            (Only Name & Price)
                          </span>
                        )}
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
                        className={`grid grid-cols-1 ${isImageMode ? "sm:grid-cols-3" : "sm:grid-cols-6"} gap-2 p-3 bg-slate-50 rounded-xl`}
                      >
                        <div
                          className={
                            isImageMode ? "sm:col-span-1" : "sm:col-span-2"
                          }
                        >
                          <input
                            type="text"
                            placeholder="Item name"
                            value={item.itemName}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "itemName",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                            required
                          />
                        </div>

                        {!isImageMode && (
                          <>
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
                                min="0.01"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <select
                                value={item.unit}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "unit",
                                    e.target.value,
                                  )
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
                          </>
                        )}

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

                        {!isImageMode && (
                          <div>
                            <input
                              type="text"
                              placeholder="Total"
                              value={item.totalPrice.toFixed(2)}
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                              readOnly
                            />
                          </div>
                        )}

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
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 h-20"
                    />
                  </div>

                  {/* Total Summary */}
                  <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                          Total Amount
                        </p>
                        <p className="text-sm text-slate-500">
                          {formData.items.length} items
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-primary-700">
                        ৳{" "}
                        {formData.items
                          .reduce(
                            (sum, item) =>
                              sum +
                              (isImageMode ? item.price : item.totalPrice),
                            0,
                          )
                          .toFixed(2)}
                      </p>
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
                          <Save className="w-4 h-4" /> Update
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
