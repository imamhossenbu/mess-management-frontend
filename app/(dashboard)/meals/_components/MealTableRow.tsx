// app/(dashboard)/meals/_components/MealTableRow.tsx
"use client";

import { Member } from "@/lib/hooks/useUsers";

interface MealTableRowProps {
  member: Member;
  selections: { morning: boolean; lunch: boolean; dinner: boolean };
  onToggle: (type: "morning" | "lunch" | "dinner") => void;
  canEdit: boolean;
  isSaving: boolean;
}

export function MealTableRow({
  member,
  selections,
  onToggle,
  canEdit,
  isSaving,
}: MealTableRowProps) {
  const subtotal =
    (selections.morning ? 1 : 0) +
    (selections.lunch ? 1 : 0) +
    (selections.dinner ? 1 : 0);

  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="py-3 pl-2">
        <p className="font-semibold text-slate-800 text-sm">
          {member.userName}
        </p>
        <p className="text-[10px] text-slate-400 capitalize">
          {member.role?.toLowerCase() || "member"}
        </p>
      </td>

      <td className="py-3 text-center">
        <input
          type="checkbox"
          checked={selections.morning}
          onChange={() => onToggle("morning")}
          disabled={!canEdit || isSaving}
          className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </td>

      <td className="py-3 text-center">
        <input
          type="checkbox"
          checked={selections.lunch}
          onChange={() => onToggle("lunch")}
          disabled={!canEdit || isSaving}
          className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </td>

      <td className="py-3 text-center">
        <input
          type="checkbox"
          checked={selections.dinner}
          onChange={() => onToggle("dinner")}
          disabled={!canEdit || isSaving}
          className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </td>

      <td className="py-3 text-right pr-2 font-bold text-slate-700 text-sm">
        {subtotal}
      </td>
    </tr>
  );
}
