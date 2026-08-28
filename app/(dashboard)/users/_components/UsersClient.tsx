// app/(dashboard)/users/_components/UsersClient.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/useUsers";
import { UserSearch } from "./UserSearch";
import { AddMemberForm } from "./AddMemberForm";
import { MembersGrid } from "./MembersGrid";
import { UsersHeader } from "./UsersHeader";
import { UsersSkeleton } from "./UsersSkeleton";

export function UsersClient() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin   = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";
  const isMember  = user?.role === "MEMBER";

  const {
    members,
    isLoading,
    error,
    removeMember,
    updateMemberRole,
    updateMemberStatus,
    refetch,
    isRemoving,
  } = useUsers();

  const handleRoleChange   = (userId: string, role: string) => updateMemberRole.mutate({ userId, role });
  const handleRemoveMember = (userId: string)               => removeMember.mutate(userId);
  const handleStatusToggle = (userId: string, isActive: boolean) => updateMemberStatus.mutate({ userId, isActive });
  const handleApprove      = (userId: string) => updateMemberStatus.mutate({ userId, approvalStatus: "APPROVED" });

  const filteredMembers = members?.filter(
    (m) =>
      m.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.userPhone?.includes(searchTerm),
  );

  if (isLoading) return <UsersSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">Failed to load members</p>
        <p className="text-sm text-slate-400 mt-1">{(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader />

      <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {(isAdmin || isManager) && (
        <AddMemberForm
          onSuccess={refetch}
          isAdmin={isAdmin}
          isManager={isManager}
        />
      )}

      <MembersGrid
        members={filteredMembers || []}
        currentUserId={user?.id}
        isAdmin={isAdmin}
        isManager={isManager}
        isMember={isMember}
        onRoleChange={handleRoleChange}
        onRemoveMember={handleRemoveMember}
        onStatusToggle={handleStatusToggle}
        onApprove={handleApprove}
        onRefetch={refetch}
        isRemoving={isRemoving}
      />
    </div>
  );
}
