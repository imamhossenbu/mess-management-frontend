// app/(dashboard)/profile/page.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useMess } from "@/lib/hooks/useMess";
import { Card } from "@/components/ui/Card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { paymentsApi } from "@/lib/api/payments";
import { useState, useRef } from "react";
import { User, Phone, Home, Mail, Shield, Camera, Save, ArrowDownLeft } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, refreshProfile, setUser } = useAuth();
  const { currentMess } = useMess();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch personal balance details
  const { data: balanceDetails, isLoading: loadingBalance } = useQuery({
    queryKey: ["personal-balance", user?.id],
    queryFn: async () => {
      const res = await paymentsApi.getUserBalance(user?.id || "");
      return res.data;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; phone?: string; roomNumber?: string }) => {
      return usersApi.updateProfile(data);
    },
    onSuccess: (res) => {
      toast.success("Profile updated successfully!");
      // Save new user details in local storage and store
      if (user) {
        setUser({
          ...user,
          name: res.data.name || name,
          phone: res.data.phone || phone,
          roomNumber: res.data.roomNumber || roomNumber,
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
      roomNumber: roomNumber || undefined,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
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
        setUser({
          ...user,
          profileImage: res.data.profileImage,
        });
      }
      refreshProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    if (confirm("Are you sure you want to remove your profile photo?")) {
      try {
        await usersApi.removeProfileImage();
        toast.success("Profile photo removed!");
        if (user) {
          setUser({
            ...user,
            profileImage: undefined,
          });
        }
        refreshProfile();
      } catch (err: any) {
        toast.error("Failed to remove profile photo");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Manage your personal details, profile picture, and view your transaction ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card & Photo */}
        <Card className="col-span-1 p-6 bg-white border border-slate-100 flex flex-col items-center text-center h-fit">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <Avatar name={user?.name || "User"} image={user?.profileImage} size="xl" />
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

          <h2 className="text-lg font-bold text-slate-800 mt-4">{user?.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

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

          {/* Quick Balance */}
          <div className="mt-6 w-full pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Current Balance</p>
            <p className={`text-2xl font-black mt-1 ${
              Number(balanceDetails?.balance ?? 0) >= 0 ? "text-emerald-600" : "text-rose-500"
            }`}>
              {Number(balanceDetails?.balance ?? 0) >= 0 ? "+" : ""}৳ {Number(balanceDetails?.balance ?? 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400 block mt-1">
              Active Mess: {currentMess?.name || "None"}
            </span>
          </div>
        </Card>

        {/* Edit Info Form */}
        <Card className="col-span-2 p-6 bg-white border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" /> Edit Profile Details
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
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
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Room / Seat Number</label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Room-402, Seat-A"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile Details
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Personal Transactions Ledger */}
      <Card className="p-6 bg-white border border-slate-100">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowDownLeft className="w-5 h-5 text-primary-500" /> My Personal Deposits Ledger
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
                          {tx.paymentMethod?.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-400 max-w-xs truncate">
                        {tx.note || "-"}
                      </td>
                      <td className="py-3 text-right pr-2 font-bold text-emerald-600">
                        +৳ {Number(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No deposits recorded for you yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
