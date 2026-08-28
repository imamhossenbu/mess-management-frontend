/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
// app/(dashboard)/meals/_components/MealTable.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { MealTableRow } from "./MealTableRow";
import { DailyMealSummary } from "@/lib/api/meals";
import { Member } from "@/lib/hooks/useUsers";
import { Loader2, Save } from "lucide-react";

interface MealTableProps {
  members: Member[];
  dailySummary?: DailyMealSummary;
  canEdit: boolean;
  isSaving: boolean;
  onSave: (mealSelections: any) => void;
}

export function MealTable({
  members,
  dailySummary,
  canEdit,
  isSaving,
  onSave,
}: MealTableProps) {
  const [mealSelections, setMealSelections] = useState<
    Record<string, { lunch: boolean; dinner: boolean }>
  >({});

  // ✅ Populate selections from dailySummary
  useEffect(() => {
    if (dailySummary?.meals && members) {
      const selections: typeof mealSelections = {};
      members.forEach((m) => {
        const existingMeal = dailySummary.meals.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (meal: any) => meal.userId === m.userId,
        );
        selections[m.userId] = {
          lunch: existingMeal?.lunch || false,
          dinner: existingMeal?.dinner || false,
        };
      });
      setMealSelections(selections);
    }
  }, [dailySummary, members]);

  // ✅ Auto-save when selections change (debounced)
  useEffect(() => {
    if (canEdit && Object.keys(mealSelections).length > 0) {
      // Debounced save could be added here
    }
  }, [mealSelections, canEdit]);

  const handleToggle = (
    userId: string,
    type: "lunch" | "dinner",
  ) => {
    if (!canEdit) return;
    setMealSelections((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [type]: !prev[userId]?.[type],
      },
    }));
  };

  // ✅ Save handler - this will trigger parent's onSave
  const handleSave = () => {
    onSave(mealSelections);
  };

  if (members.length === 0) {
    return (
      <Card className="p-12 bg-white border border-slate-100">
        <div className="text-center">
          <p className="text-slate-400">No members found</p>
          <p className="text-sm text-slate-300 mt-1">
            Add members to start tracking meals
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          Logged Meals
          <span className="text-xs font-normal text-slate-400">
            ({members.length} members)
          </span>
        </h2>
        {!canEdit && (
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
            View Only
          </span>
        )}
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Member</th>
              <th className="pb-3 text-center">Lunch</th>
              <th className="pb-3 text-center">Dinner</th>
              <th className="pb-3 text-right pr-2">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {members.map((member) => (
              <MealTableRow
                key={member.id}
                member={member}
                selections={
                  mealSelections[member.userId] || {
                    lunch: false,
                    dinner: false,
                  }
                }
                onToggle={(type) => handleToggle(member.userId, type)}
                canEdit={canEdit}
                isSaving={isSaving}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
