// app/(dashboard)/users/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { messApi } from "@/lib/api/mess";
import { useState } from "react";
import { UserPlus, Shield, Trash2, ArrowUpRight, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import toast from "react-hot-toast";

type PendingRegistration = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export default function UsersPage() {
  const { currentMess, useGetMembers, addMember, removeMember, updateMemberRole } = useMess();
  const { user: currentUser } = useAuth();

  // Use mess-level role for permission checks (not system role)
  const messRole = (currentMess as any)?.role ?? "MEMBER";
  const isSuperAdmin = messRole === "SUPER_ADMIN";
  const isManager = messRole === "SUPER_ADMIN" || messRole === "ADMIN" || messRole === "MANAGER";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("MEMBER");
  
  // Tab state for adding members: 'existing' | 'new'
  const [addMode, setAddMode] = useState<"existing" | "new">("existing");
  
  // New User form states
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRoom, setNewUserRoom] = useState("");
  const [creatingAndAdding, setCreatingAndAdding] = useState(false);

  const { data: members, isLoading, refetch: refetchMembers } = useGetMembers(currentMess?.id || "");

  // Get all registered users to select from for adding
  const { data: allUsers, isLoading: loadingUsers } = useQuery<PendingRegistration[]>({
    queryKey: ["pending-registrations"],
    queryFn: async () => {
      const response = await messApi.getPendingRegistrations();
      return response.data;
    },
    enabled: isSuperAdmin && !!currentMess,
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to add");
      return;
    }

    if (!currentMess) return;

    addMember.mutate(
      {
        messId: currentMess.id,
        data: { userId: selectedUserId, roles: [selectedRole] },
      },
      {
        onSuccess: () => {
          setSelectedUserId("");
          setSelectedRole("MEMBER");
          refetchMembers();
        },
      }
    );
  };

  const handleCreateAndAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserPhone || !newUserEmail || !newUserPassword) {
      toast.error("Please fill in name, phone, email, and password");
      return;
    }
    if (newUserPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!currentMess) return;

    setCreatingAndAdding(true);
    try {
      // The super admin creates the account directly in this mess. The
      // backend emails these credentials through Nodemailer.
      await addMember.mutateAsync({
        messId: currentMess.id,
        data: {
          name: newUserName.trim(),
          phone: newUserPhone.trim(),
          email: newUserEmail.trim(),
          password: newUserPassword,
          roles: [selectedRole],
        },
      });

      toast.success("Member created. Credentials were sent by email.");
      
      // Reset form states
      setNewUserName("");
      setNewUserPhone("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRoom("");
      setSelectedRole("MEMBER");
      
      refetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create member");
    } finally {
      setCreatingAndAdding(false);
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    if (!currentMess) return;
    updateMemberRole.mutate(
      { messId: currentMess.id, userId, roles: [role] },
      {
        onSuccess: () => refetchMembers(),
      }
    );
  };

  const handleRemoveMember = (userId: string) => {
    if (!currentMess) return;
    if (confirm("Are you sure you want to remove this member?")) {
      removeMember.mutate(
        { messId: currentMess.id, userId },
        {
          onSuccess: () => refetchMembers(),
        }
      );
    }
  };

  // Filter out users who are already members
  const nonMemberUsers = allUsers?.filter(
    (user) => !members?.some((member) => member.userId === user.id)
  );

  const filteredMembers = members?.filter(
    (member) =>
      member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 mt-1">
            Manage users, permissions, and balances for your mess.
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Add Member Section - Admins/Managers only */}
      {isSuperAdmin && (
        <Card className="p-6 border border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary-500" /> Manage Members
            </h2>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAddMode("existing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  addMode === "existing" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Approve Registration
              </button>
              <button
                type="button"
                onClick={() => setAddMode("new")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  addMode === "new" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create New Member
              </button>
            </div>
          </div>

          {addMode === "existing" ? (
            /* TAB 1: Add existing registered user */
            <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Select Pending Registration
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  disabled={loadingUsers}
                >
                  <option value="">-- Choose User --</option>
                  {nonMemberUsers?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Assign Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={addMember.isPending}
                className="py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {addMember.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Add to Mess
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TAB 2: Register completely new user manually and add */
            <form onSubmit={handleCreateAndAddMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Name (নাম)</label>
                  <input
                    type="text"
                    placeholder="e.g. Abul Kashem"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone (মোবাইল নম্বর)</label>
                  <input
                    type="text"
                    placeholder="e.g. 01712345678"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. user@email.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Password (পাসওয়ার্ড)</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Room Number (রুম নম্বর)</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 302"
                    value={newUserRoom}
                    onChange={(e) => setNewUserRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Assign Role</label>
                  <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={creatingAndAdding}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creatingAndAdding ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Create & Add Member
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers && filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const isMe = member.userId === currentUser?.id;
            return (
              <Card key={member.id} className="p-6 bg-white border border-slate-100 hover:border-slate-200 transition relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4">
                    <Avatar name={member.userName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                        {member.userName} {isMe && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-normal">You</span>}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{member.userEmail}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{member.userPhone || "No phone added"}</p>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="mt-6 grid grid-cols-2 gap-4 py-3 px-4 bg-slate-50 rounded-xl text-center">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Balance</p>
                      <p className={`text-base font-bold mt-1 ${member.balance >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        ৳ {Number(member.balance).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Role</p>
                      <p className="text-xs font-semibold text-slate-700 mt-1.5 capitalize flex items-center justify-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                        {member.role?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Block: Add/Remove for managers, Role change only for SUPER_ADMIN */}
                {isManager && !isMe && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {isSuperAdmin && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Change Role:</span>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                          className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </div>
                    )}

                    {!isSuperAdmin && (
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">{member.role?.toLowerCase()}</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-100 cursor-pointer"
                      title="Remove from Mess"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 font-medium">No members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
