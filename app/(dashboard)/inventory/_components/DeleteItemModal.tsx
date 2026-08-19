/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/DeleteItemModal.tsx
"use client";

import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { useDeleteInventoryItem } from "@/lib/hooks/useInventory";
import toast from "react-hot-toast";

interface DeleteItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemName: string;
    onSuccess: () => void;
}

export function DeleteItemModal({
    isOpen,
    onClose,
    itemName,
    onSuccess,
}: DeleteItemModalProps) {
    const deleteItem = useDeleteInventoryItem();

    const handleDelete = () => {
        deleteItem.mutate(itemName, {
            onSuccess: () => {
                toast.success(`"${itemName}" deleted successfully!`);
                onSuccess();
                onClose();
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Failed to delete item");
            },
        });
    };

    return (
        <DeleteConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleDelete}
            title="Delete Inventory Item"
            message={`Are you sure you want to delete "${itemName}"? This action cannot be undone. The item will be deactivated.`}
            isLoading={deleteItem.isPending}
            confirmText="Delete Item"
            cancelText="Cancel"
        />
    );
}