// app/(dashboard)/users/_components/MemberCard.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import {
  Shield,
  Trash2,
  Crown,
  UserCheck,
  Users,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { format } from "date-fns";

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
  isActive?: boolean;
  approvalStatus?: string;
}

interface MemberCardProps {
  member: Member;
  isCurrentUser: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isMember?: boolean;
  onRoleChange: (userId: string, role: string) => void;
  onRemove: (userId: string) => void;
  onStatusToggle?: (userId: string, isActive: boolean) => void;
  onApprove?: (userId: string) => void;
  isRemoving?: boolean;
}

export function MemberCard({
  member,
  isCurrentUser,
  isAdmin,
  isManager,
  isMember = false,
  onRoleChange,
  onRemove,
  onStatusToggle,
  onApprove,
  isRemoving = false,
}: MemberCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const isActive = member.isActive !== false; // default true if undefined
  const isNegative = Number(member.balance) < 0;

  const roleIcon = {
    ADMIN: <Crown className="w-3.5 h-3.5 text-amber-500" />,
    MANAGER: <Shield className="w-3.5 h-3.5 text-blue-500" />,
    MEMBER: <UserCheck className="w-3.5 h-3.5 text-emerald-500" />,
  }[member.role] || <Users className="w-3.5 h-3.5 text-slate-500" />;

  const roleBadgeColors: Record<string, string> = {
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

  const handleStatusToggleConfirm = () => {
    if (onStatusToggle) {
      onStatusToggle(member.userId, !isActive);
    }
    setShowStatusModal(false);
  };

  const joinDate = member.joinedDate
    ? format(new Date(member.joinedDate), "dd MMM yyyy")
    : "—";

  return (
    <>
      <Card
        className={`p-5 bg-white border transition-all duration-200 hover:shadow-md ${
          !isActive
            ? "border-slate-200 opacity-70"
            : "border-slate-100 hover:border-slate-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar name={member.userName} size="lg" image={member.profileImage} />
            {member.approvalStatus === "PENDING" ? (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full font-bold leading-4">
                WAIT
              </span>
            ) : !isActive ? (
              <span className="absolute -bottom-1 -right-1 bg-slate-400 text-white text-[8px] px-1 rounded-full font-bold leading-4">
                OFF
              </span>
            ) : null}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-bold text-slate-900 truncate text-[15px]">
                {member.userName}
              </p>
              {isCurrentUser && (
                <span className="text-[9px] bg-primary-50 text-primary-600 border border-primary-100 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                  You
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              {roleIcon}
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  roleBadgeColors[member.role] || "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {getRoleDisplay(member.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-1.5">
          {member.userEmail && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{member.userEmail}</span>
            </div>
          )}
          {member.userPhone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{member.userPhone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Joined {joinDate}</span>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-3 py-2.5 px-3 bg-slate-50 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Balance
          </span>
          <span
            className={`text-sm font-extrabold ${
              isNegative ? "text-rose-500" : Number(member.balance) === 0 ? "text-slate-500" : "text-emerald-600"
            }`}
          >
            {isNegative ? "-" : "+"} ৳{Math.abs(Number(member.balance)).toLocaleString()}
          </span>
        </div>

        {/* Actions — only for admin/manager, not for member view */}
        {(isAdmin || isManager) && !isMember && !isCurrentUser && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* Role change — admin only */}
            {isAdmin && (
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
            )}

            {/* Manager can see role but not change */}
            {!isAdmin && isManager && (
              <div className="flex items-center gap-1.5 flex-1">
                {roleIcon}
                <span className="text-xs text-slate-500">
                  {getRoleDisplay(member.role)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              {/* Approve — admin only */}
              {isAdmin && member.approvalStatus === "PENDING" && onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(member.userId)}
                  disabled={isRemoving}
                  className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 transition"
                >
                  Approve
                </button>
              )}

              {/* Status toggle — admin only */}
              {isAdmin && member.approvalStatus !== "PENDING" && onStatusToggle && (
                <button
                  type="button"
                  onClick={() => setShowStatusModal(true)}
                  disabled={isRemoving}
                  title={isActive ? "Deactivate member" : "Activate member"}
                  className={`p-1.5 rounded-lg transition border text-xs ${
                    isActive
                      ? "text-emerald-500 hover:bg-emerald-50 border-transparent hover:border-emerald-100"
                      : "text-slate-400 hover:bg-slate-50 border-transparent hover:border-slate-200"
                  }`}
                >
                  {isActive ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Delete — admin only */}
              {isAdmin && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isRemoving}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to permanently delete "${member.userName}"? All their data will be removed and cannot be undone.`}
        isLoading={isRemoving}
        confirmText="Delete Permanently"
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusToggleConfirm}
        title={isActive ? "Deactivate Member" : "Activate Member"}
        message={`Are you sure you want to ${isActive ? "deactivate" : "activate"} member "${member.userName}"?`}
        confirmText={isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        variant={isActive ? "warning" : "success"}
      />
    </>
  );
}
