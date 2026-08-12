/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/select-mess/page.tsx
"use client";

import { useMess } from "@/lib/hooks/useMess";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SelectMessPage() {
  const { userMesses, isLoading, refetch, switchMess, createMess } = useMess();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newMessName, setNewMessName] = useState("");

  useEffect(() => {
    if (createMess.isPending) {
      setIsCreating(true);
    } else {
      setIsCreating(false);
    }
  }, [createMess.isPending]);

  // ✅ Auto redirect when mess is selected
  useEffect(() => {
    const storedMessId = localStorage.getItem("currentMessId");
    if (userMesses.length > 0 && storedMessId) {
      const mess = userMesses.find((m: any) => m.id === storedMessId);
      if (mess) {
        switchMess(mess.id);
        router.push("/dashboard");
      }
    }
  }, [userMesses, router, switchMess]);

  const handleSelectMess = (messId: string) => {
    switchMess(messId);
    router.push("/dashboard");
  };

  const handleCreateMess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessName.trim()) {
      toast.error("Please enter a mess name");
      return;
    }

    setIsCreating(true);
    try {
      // ✅ Direct API call without messId
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: newMessName.trim(),
          description: "My mess",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create mess");
      }

      toast.success("Mess created successfully!");
      await refetch();
      setNewMessName("");

      // ✅ Save mess id
      localStorage.setItem("currentMessId", data.id);
      switchMess(data.id);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create mess");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // No mess → Show create mess page
  if (userMesses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-3xl text-white text-3xl font-bold mb-4 shadow-xl shadow-primary-500/30">
              M
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome to Mess Management
            </h1>
            <p className="text-slate-500 mt-1">
              Create your first mess to get started
            </p>
          </div>

          <Card className="p-6 bg-white/80 backdrop-blur border-0 shadow-xl">
            <form onSubmit={handleCreateMess}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mess Name
                </label>
                <input
                  type="text"
                  value={newMessName}
                  onChange={(e) => setNewMessName(e.target.value)}
                  placeholder="Enter mess name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                  disabled={isCreating}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Mess
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Has messes → Show selection page
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {newMessName.trim() !== "" || isCreating ? (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Create New Mess</h1>
              <p className="text-slate-500 mt-1">Fill in the details to register another mess</p>
            </div>
            <Card className="p-6 bg-white border border-slate-200 shadow-xl">
              <form onSubmit={handleCreateMess}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mess Name
                  </label>
                  <input
                    type="text"
                    value={newMessName === " " ? "" : newMessName}
                    onChange={(e) => setNewMessName(e.target.value)}
                    placeholder="Enter mess name"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm"
                    disabled={isCreating}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewMessName("");
                      setIsCreating(false);
                    }}
                    className="w-1/2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-1/2 py-3 bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        ) : (
          /* Normal list display */
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                Select Your Mess
              </h1>
              <p className="text-slate-500 mt-1">Choose a mess to continue</p>
            </div>

            <div className="space-y-3">
              {userMesses.map((mess: any) => (
                <Card
                  key={mess.id}
                  className="p-4 cursor-pointer hover:border-primary-500 transition-all bg-white/80 backdrop-blur border border-slate-200/50 shadow hover:shadow-md"
                  onClick={() => handleSelectMess(mess.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{mess.name}</p>
                        <p className="text-xs text-slate-400 capitalize">
                          {mess.role?.toLowerCase() || "member"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </Card>
              ))}
              
              {/* Create Mess Action button */}
              <button
                onClick={() => {
                  setNewMessName(" "); // trigger create mode
                }}
                className="w-full mt-4 py-3 bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100/50 rounded-xl font-semibold text-slate-600 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4" /> Create Another Mess
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
