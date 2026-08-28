// app/(dashboard)/profile/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { authApi } from "@/lib/api/auth";
import { paymentsApi } from "@/lib/api/payments";
import { useState, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  Shield,
  Camera,
  Save,
  ArrowDownLeft,
  Wallet,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function ProfilePage() {
  const { user, refreshProfile, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUploading, setIsUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPhotoConfirm, setShowPhotoConfirm] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);

  // Fetch personal balance details
  const { data: balanceDetails, isLoading: loadingBalance } = useQuery({
    queryKey: ["personal-balance", user?.id],
    queryFn: async () => {
      const res = await paymentsApi.getUserBalance(user?.id || "");
      return res.data;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; phone?: string }) => {
      return usersApi.updateProfile(data);
    },
    onSuccess: (res) => {
      toast.success("Profile updated successfully!");
      if (user) {
        setUser({
          ...user,
          name: res.data.name || name,
          phone: res.data.phone || phone,
        });
      }
      refreshProfile();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    updateProfileMutation.mutate({
      name,
      phone: phone || undefined,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const res = await usersApi.uploadProfileImage(file);
      toast.success("Profile photo uploaded!");
      if (user) {
        setUser({ ...user, profileImage: res.data.profileImage });
      }
      refreshProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleRemovePhoto = () => {
    setShowPhotoConfirm(true);
  };

  const handleRemovePhotoConfirm = async () => {
    setIsRemovingPhoto(true);
    try {
      await usersApi.removeProfileImage();
      toast.success("Profile photo removed!");
      if (user) {
        setUser({ ...user, profileImage: undefined });
      }
      refreshProfile();
    } catch {
      toast.error("Failed to remove profile photo");
    } finally {
      setIsRemovingPhoto(false);
      setShowPhotoConfirm(false);
    }
  };

  const changePasswordMutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to change password"),
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match");
    changePasswordMutation.mutate();
  };

  const balance = Number(balanceDetails?.balance ?? 0);
  const totalPaid = Number(balanceDetails?.totalPaid ?? 0);
  const isDue = balance < 0;
  const isAdvance = balance > 0;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your personal details, profile picture, and view your deposit
          history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar + Balance */}
        <div className="col-span-1 space-y-4">
          {/* Avatar Card */}
          <Card className="p-6 bg-white border border-slate-100 flex flex-col items-center text-center">
            <div
              className="relative group cursor-pointer"
              onClick={triggerFileInput}
            >
              <Avatar
                name={user?.name || "User"}
                image={user?.profileImage}
                size="xl"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <h2 className="text-base font-bold text-slate-800 mt-3">
              {user?.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

            {/* Role badge */}
            <span
              className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                user?.role === "ADMIN"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : user?.role === "MANAGER"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {user?.role}
            </span>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button
                onClick={triggerFileInput}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
              >
                Change Photo
              </button>
              {user?.profileImage && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold border border-rose-100 transition cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </Card>

          {/* Balance Card */}
          <Card
            className={`p-5 border-2 ${
              isDue
                ? "border-rose-200 bg-rose-50"
                : isAdvance
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              My Balance
            </p>
            <div className="flex items-center gap-2 mt-2">
              {isDue ? (
                <TrendingDown className="w-5 h-5 text-rose-500" />
              ) : isAdvance ? (
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              ) : (
                <Wallet className="w-5 h-5 text-slate-500" />
              )}
              <p
                className={`text-2xl font-black ${
                  isDue
                    ? "text-rose-600"
                    : isAdvance
                      ? "text-emerald-600"
                      : "text-slate-700"
                }`}
              >
                {isDue ? "-" : isAdvance ? "+" : ""}৳{" "}
                {Math.abs(balance).toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isDue
                ? "You owe the mess"
                : isAdvance
                  ? "You have advance balance"
                  : "Account settled"}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Total Deposited</span>
                <span className="text-xs font-bold text-emerald-600">
                  ৳ {totalPaid.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Edit Info Form */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" /> Edit Profile Details
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Change Password */}
      <Card className="p-6 bg-white border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-500" /> Change Password
        </h2>
        <form
          onSubmit={handleChangePassword}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="min-w-0 flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                required
              />
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 hover:bg-primary-700 transition"
              >
                {changePasswordMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      </Card>

      {/* Personal Transactions Ledger */}
      <Card className="p-6 bg-white border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowDownLeft className="w-5 h-5 text-primary-500" /> My Deposit
          History
        </h2>

        {loadingBalance ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Deposit Date</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Note</th>
                  <th className="pb-3 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {balanceDetails?.payments && balanceDetails.payments.length > 0 ? (
                  balanceDetails.payments.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 pl-2 text-slate-600">
                        {format(new Date(tx.paymentDate), "MMMM dd, yyyy")}
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium capitalize">
                          {tx.paymentMethod?.toLowerCase()?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-400 max-w-xs truncate">
                        {tx.note || "—"}
                      </td>
                      <td className="py-3 text-right pr-2 font-bold text-emerald-600">
                        +৳ {Number(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No deposits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={showPhotoConfirm}
        onClose={() => setShowPhotoConfirm(false)}
        onConfirm={handleRemovePhotoConfirm}
        title="Remove Profile Photo"
        message="Are you sure you want to remove your profile photo?"
        confirmText="Remove Photo"
        cancelText="Cancel"
        variant="danger"
        isLoading={isRemovingPhoto}
      />
    </div>
  );
}
