/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/users/_components/AddMemberForm.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { UserPlus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useUsers } from "@/lib/hooks/useUsers";

interface AddMemberFormProps {
  onSuccess: () => void;
  isAdmin: boolean;
  isManager: boolean;
}

export function AddMemberForm({
  onSuccess,
  isAdmin,
  isManager,
}: AddMemberFormProps) {
  const { addMember } = useUsers();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9+\-\s()]+$/.test(phone.trim())) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Send only required fields (no role)
      await addMember.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password,
        // role is NOT sent to backend - it's set to MEMBER by default
      });

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setRole("MEMBER");
      setFormError(null);

      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add member";

      if (message.includes("email") && message.includes("already")) {
        setFormError(
          "A user with this email already exists. Please use a different email.",
        );
        setFieldErrors({ email: "Email already taken" });
      } else if (message.includes("phone") && message.includes("already")) {
        setFormError("A user with this phone number already exists.");
        setFieldErrors({ phone: "Phone already taken" });
      } else {
        setFormError(message);
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin && !isManager) {
    return null;
  }

  return (
    <Card className="p-6 border border-slate-100 bg-white">
      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-primary-500" />
        Add New Member
      </h2>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors({ ...fieldErrors, name: undefined });
              setFormError(null);
            }}
            className={`w-full px-3 py-2.5 bg-white border ${
              fieldErrors.name
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-primary-100"
            } rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
            required
            disabled={isSubmitting}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Phone *
          </label>
          <input
            type="tel"
            placeholder="01712345678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setFieldErrors({ ...fieldErrors, phone: undefined });
              setFormError(null);
            }}
            className={`w-full px-3 py-2.5 bg-white border ${
              fieldErrors.phone
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-primary-100"
            } rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
            required
            disabled={isSubmitting}
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Email *
          </label>
          <input
            type="email"
            placeholder="user@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: undefined });
              setFormError(null);
            }}
            className={`w-full px-3 py-2.5 bg-white border ${
              fieldErrors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-primary-100"
            } rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
            required
            disabled={isSubmitting}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Password *
          </label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: undefined });
              setFormError(null);
            }}
            className={`w-full px-3 py-2.5 bg-white border ${
              fieldErrors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-primary-100"
            } rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
            required
            disabled={isSubmitting}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {/* ✅ Role dropdown - UI only, not sent to API */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Role (UI Only)
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
            disabled={isSubmitting}
          >
            <option value="MEMBER">Member</option>
            <option value="MANAGER">Manager</option>
            {isAdmin && <option value="ADMIN">Admin</option>}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Default: Member (update after creation)
          </p>
        </div>

        <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Add Member
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
}
