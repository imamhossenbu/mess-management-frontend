// app/(dashboard)/users/_components/MemberCard.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Shield, Trash2, Crown, UserCheck, Users } from "lucide-react";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

interface Member {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  role: string;
  balance: number;
  joinedDate: string;
  profileImage?: string;
}

interface MemberCardProps {
  member: Member;
  isCurrentUser: boolean;
  isAdmin: boolean;
  isManager: boolean;
  onRoleChange: (userId: string, role: string) => void;
  onRemove: (userId: string) => void;
  isRemoving?: boolean;
}

export function MemberCard({
  member,
  isCurrentUser,
  isAdmin,
  isManager,
  onRoleChange,
  onRemove,
  isRemoving = false,
}: MemberCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isNegative = member.balance < 0;

  const roleIcon = {
    ADMIN: <Crown className="w-4 h-4 text-amber-500" />,
    MANAGER: <Shield className="w-4 h-4 text-blue-500" />,
    MEMBER: <UserCheck className="w-4 h-4 text-emerald-500" />,
  }[member.role] || <Users className="w-4 h-4 text-slate-500" />;

  const roleColors = {
    ADMIN: "bg-amber-50 text-amber-700 border-amber-200",
    MANAGER: "bg-blue-50 text-blue-700 border-blue-200",
    MEMBER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      ADMIN: "Admin",
      MANAGER: "Manager",
      MEMBER: "Member",
    };
    return roleMap[role] || role;
  };

  const handleDelete = () => {
    onRemove(member.userId);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className="p-5 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-4">
          <Avatar
            name={member.userName}
            size="lg"
            image={member.profileImage}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 truncate">
                {member.userName}
              </p>
              {isCurrentUser && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-normal whitespace-nowrap">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">
              {member.userEmail}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {member.userPhone || "No phone"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 py-3 px-4 bg-slate-50 rounded-xl">
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Balance
            </p>
            <p
              className={`text-base font-bold mt-1 ${isNegative ? "text-rose-500" : "text-emerald-600"}`}
            >
              ৳ {Number(member.balance).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Role
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {roleIcon}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${roleColors[member.role as keyof typeof roleColors] || "bg-slate-100 text-slate-700 border-slate-200"}`}
              >
                {getRoleDisplay(member.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isManager && !isCurrentUser && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isAdmin && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                  Role:
                </span>
                <select
                  value={member.role}
                  onChange={(e) => onRoleChange(member.userId, e.target.value)}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 flex-1"
                  disabled={isRemoving}
                >
                  <option value="MEMBER">Member</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            {!isAdmin && (
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 capitalize">
                  {getRoleDisplay(member.role)}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isRemoving}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to delete "${member.userName}"? This action cannot be undone and will permanently remove all their data.`}
        isLoading={isRemoving}
        confirmText="Delete Permanently"
        cancelText="Cancel"
      />
    </>
  );
}
