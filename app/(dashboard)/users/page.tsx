// app/(dashboard)/users/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUsers } from "@/lib/hooks/useUsers";
import { UserSearch } from "./_components/UserSearch";
import { AddMemberForm } from "./_components/AddMemberForm";
import { MembersGrid } from "./_components/MembersGrid";
import { UsersHeader } from "./_components/UsersHeader";
import { UsersSkeleton } from "./_components/UsersSkeleton";

export default function UsersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";

  const {
    members,
    isLoading,
    error,
    addMember,
    removeMember,
    updateMemberRole,
    refetch,
    isRemoving,
  } = useUsers();

  const handleRoleChange = (userId: string, role: string) => {
    updateMemberRole.mutate({ userId, role });
  };

  const handleRemoveMember = (userId: string) => {
    removeMember.mutate(userId);
  };

  const filteredMembers = members?.filter(
    (member) =>
      member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">Failed to load members</p>
        <p className="text-sm text-slate-400 mt-1">
          {(error as Error).message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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

      {isAdmin && (
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
        onRoleChange={handleRoleChange}
        onRemoveMember={handleRemoveMember}
        onRefetch={refetch}
        isRemoving={isRemoving}
      />
    </div>
  );
}
