/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/marketings/_components/MarketingTable.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  Trash2,
  ShoppingBag,
  Edit2,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { formatBanglaNumber } from "@/lib/banglaParser";

interface MarketingTableProps {
  data: any;
  canEdit: boolean;
  currentUserId?: string;
  onDelete: (id: string) => Promise<any>;
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  isDeleting: boolean;
}

export function MarketingTable({
  data,
  canEdit,
  currentUserId,
  onDelete,
  onView,
  onEdit,
  isDeleting,
}: MarketingTableProps) {
  // Member can edit/delete their own entries
  const canEditEntry = (item: any) =>
    canEdit || (currentUserId && item.userId === currentUserId);
  const marketings = data?.marketings || [];
  const [deleteItem, setDeleteItem] = useState<any>(null);

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

  const handleDeleteClick = (item: any) => {
    setDeleteItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    const id = deleteItem.id;
    setDeleteItem(null);

    await toast.promise(onDelete(id), {
      loading: "Deleting bazar entry...",
      success: "Bazar entry deleted successfully!",
      error: (err: any) =>
        err?.response?.data?.message || "Failed to delete bazar entry",
    });
  };

  if (marketings.length === 0) {
    return (
      <>
        <Card className="p-12 bg-white border border-slate-100">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">
              No bazar purchases logged
            </p>
            <p className="text-sm text-slate-300 mt-1">
              Start logging your bazar expenses
            </p>
          </div>
        </Card>

        <DeleteConfirmModal
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Bazar Entry"
          message={`Are you sure you want to delete this bazar entry? This action cannot be undone.`}
          isLoading={isDeleting}
          confirmText="Delete Permanently"
          cancelText="Cancel"
        />
      </>
    );
  }

  return (
    <>
      <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary-500" />
            Bazar Sheet
            <span className="text-xs font-normal text-slate-400 ml-2">
              ({marketings.length} entries)
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Date</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Image</th>
                <th className="pb-3">Added By</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {marketings.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 pl-2 text-sm text-slate-600">
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </td>
                  <td className="py-3">
                    <p className="font-semibold text-slate-800 text-sm">
                      {item.items?.length > 1
                        ? `${formatBanglaNumber(item.items.length)} items`
                        : item.items?.[0]?.itemName || "N/A"}
                    </p>
                    {item.shopName && (
                      <p className="text-[10px] text-slate-400">
                        Shop: {item.shopName}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-[10px] text-slate-400 italic">
                        {item.note}
                      </p>
                    )}
                  </td>
                  <td className="py-3">
                    {item.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:scale-110 transition">
                        <Image
                          src={item.imageUrl}
                          alt="Bazar"
                          fill
                          className="object-cover"
                          onClick={() => window.open(item.imageUrl, "_blank")}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold">
                        {item.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {item.userName || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPaymentTypeColor(item.paymentType)}`}
                    >
                      {item.paymentType}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-slate-800 text-sm">
                    ৳ {formatBanglaNumber(Number(item.totalAmount))}
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canEditEntry(item) && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {canEditEntry(item) && (
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={isDeleting}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Bazar Entry"
        message={`Are you sure you want to delete this bazar entry? This action cannot be undone.`}
        isLoading={isDeleting}
        confirmText="Delete Permanently"
        cancelText="Cancel"
      />
    </>
  );
}
