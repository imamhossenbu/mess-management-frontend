/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/dashboard/_components/shared/ActivityList.tsx
"use client";

import Link from "next/link";
import { ChevronRight, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActivityListProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  items: any[];
  emptyText: string;
  href: string;
  renderItem: (item: any, index: number) => React.ReactNode;
  maxItems?: number;
}

export function ActivityList({
  title,
  icon: Icon,
  iconColor,
  items,
  emptyText,
  href,
  renderItem,
  maxItems = 5,
}: ActivityListProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-xl flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          {title}
        </h3>
        <Link
          href={href}
          className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-0.5"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 flex-1">
        {displayItems.length > 0 ? (
          displayItems.map(renderItem)
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-xs text-slate-400">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}