/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/StockCards.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { 
  Package, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";

// ✅ Lazy load modals
const EditItemModal = dynamic(
  () => import("./EditItemModal").then(m => ({ default: m.EditItemModal })),
  { ssr: false }
);
const DeleteItemModal = dynamic(
  () => import("./DeleteItemModal").then(m => ({ default: m.DeleteItemModal })),
  { ssr: false }
);

interface StockCardsProps {
  meatItems: any[];
  fishItems: any[];
  vegetableItems: any[];
  otherItems: any[];
  isLoading: boolean;
  onRefresh: () => void;
  canEdit: boolean;
}

type CategoryTab = "ALL" | "MEAT" | "FISH" | "VEGETABLE" | "OTHER";
type StatusFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

const CATEGORY_MAP: Record<CategoryTab, string> = {
  ALL: "All Items",
  MEAT: "Meat 🥩",
  FISH: "Fish 🐟",
  VEGETABLE: "Vegetables 🥬",
  OTHER: "Others 📦",
};

export function StockCards({
  meatItems,
  fishItems,
  vegetableItems,
  otherItems,
  isLoading,
  onRefresh,
  canEdit,
}: StockCardsProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<CategoryTab>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Compile all items
  const allItems = [
    ...meatItems.map(i => ({ ...i, category: "MEAT" })),
    ...fishItems.map(i => ({ ...i, category: "FISH" })),
    ...vegetableItems.map(i => ({ ...i, category: "VEGETABLE" })),
    ...otherItems.map(i => ({ ...i, category: "OTHER" })),
  ];

  // Calculations for summary metrics
  const totalItemCount = allItems.length;
  const lowStockCount = allItems.filter(i => i.status === "LOW_STOCK").length;
  const outOfStockCount = allItems.filter(i => i.status === "OUT_OF_STOCK" || Number(i.quantity) <= 0).length;
  const totalStockSum = allItems.reduce((sum, i) => sum + Number(i.quantity), 0);

  // Filtered items
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "ALL" || item.category === activeTab;
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5 md:p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-8 bg-slate-200 rounded w-20 mt-3" />
              <div className="h-3 bg-slate-200 rounded w-32 mt-2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Summary metrics cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock */}
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Quantity</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalStockSum.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">{totalItemCount} total items</p>
          </div>
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </Card>

        {/* In Stock */}
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Healthy Stock</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {allItems.filter(i => i.status === "IN_STOCK").length}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Ready to use</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        {/* Low Stock Warning */}
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock items</p>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{lowStockCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Needs reorder soon</p>
          </div>
          <div className={`p-3 rounded-2xl shrink-0 ${lowStockCount > 0 ? "bg-amber-50 text-amber-500 animate-pulse" : "bg-slate-50 text-slate-400"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        {/* Out of Stock */}
        <Card className="p-5 bg-white border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-extrabold text-rose-500 mt-1">{outOfStockCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Critical warning</p>
          </div>
          <div className={`p-3 rounded-2xl shrink-0 ${outOfStockCount > 0 ? "bg-rose-50 text-rose-500 animate-bounce" : "bg-slate-50 text-slate-400"}`}>
            <XCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* ── Main Inventory Workspace ── */}
      <Card className="p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary-500" />
            Inventory Stock Ledger
          </h2>

          {/* Search bar & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 md:w-60 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {/* Status dropdown filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="pl-8 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary-100 appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-slate-100 mb-5">
          <div className="flex gap-1 overflow-x-auto">
            {(Object.keys(CATEGORY_MAP) as CategoryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold transition rounded-t-xl whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-slate-100 text-slate-800 border-b-2 border-primary-500"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {CATEGORY_MAP[tab]}
                <span className="ml-1.5 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-extrabold">
                  {tab === "ALL" 
                    ? allItems.length 
                    : allItems.filter(i => i.category === tab).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stock list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Item Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-center">Current Quantity</th>
                <th className="pb-3 text-center">Min Alert Level</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3">Last Updated</th>
                {canEdit && <th className="pb-3 text-right pr-2">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    No matching inventory items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.status === "LOW_STOCK";
                  const isOut = item.status === "OUT_OF_STOCK" || Number(item.quantity) <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      {/* Name */}
                      <td className="py-3 pl-2 font-bold text-slate-800">{item.name}</td>

                      {/* Category Badge */}
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          item.category === "MEAT" ? "bg-rose-50 text-rose-600" :
                          item.category === "FISH" ? "bg-blue-50 text-blue-600" :
                          item.category === "VEGETABLE" ? "bg-green-50 text-green-600" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {item.category}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3 text-center font-extrabold text-slate-800 text-base">
                        {item.quantity}
                      </td>

                      {/* Min level */}
                      <td className="py-3 text-center text-slate-400 font-medium">
                        {item.minStockLevel || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          isOut ? "bg-rose-50 text-rose-600" :
                          isLow ? "bg-amber-50 text-amber-600" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                          {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3 text-xs text-slate-400">
                        {item.lastUpdated
                          ? format(new Date(item.lastUpdated), "dd MMM yyyy, hh:mm a")
                          : "Never"}
                      </td>

                      {/* Action buttons */}
                      {canEdit && (
                        <td className="py-3 text-right pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition cursor-pointer"
                              title="Edit Item Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && selectedItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSuccess={onRefresh}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedItem && (
        <DeleteItemModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}