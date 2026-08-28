// app/(dashboard)/users/_components/MembersGrid.tsx
"use client";

import { MemberCard } from "./MemberCard";
import { Users } from "lucide-react";

export interface Member {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  role: string;
  balance: number;
  joinedDate: string;
  profileImage?: string;
  isActive?: boolean;
}

interface MembersGridProps {
  members: Member[];
  currentUserId?: string;
  isAdmin: boolean;
  isManager: boolean;
  isMember?: boolean;
  onRoleChange: (userId: string, role: string) => void;
  onRemoveMember: (userId: string) => void;
  onStatusToggle?: (userId: string, isActive: boolean) => void;
  onApprove?: (userId: string) => void;
  onRefetch: () => void;
  isRemoving?: boolean;
}

export function MembersGrid({
  members,
  currentUserId,
  isAdmin,
  isManager,
  isMember = false,
  onRoleChange,
  onRemoveMember,
  onStatusToggle,
  onApprove,
  onRefetch,
  isRemoving = false,
}: MembersGridProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Users className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No members found</p>
        <p className="text-sm text-slate-400 mt-1">
          {isMember ? "No members in your mess yet" : "Add members to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          isCurrentUser={member.userId === currentUserId}
          isAdmin={isAdmin}
          isManager={isManager}
          isMember={isMember}
          onRoleChange={onRoleChange}
          onRemove={onRemoveMember}
          onStatusToggle={onStatusToggle}
          onApprove={onApprove}
          isRemoving={isRemoving}
        />
      ))}
    </div>
  );
}
