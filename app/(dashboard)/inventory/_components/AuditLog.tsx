// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/(dashboard)/inventory/_components/AuditLog.tsx
// "use client";

// import { Card } from "@/components/ui/Card";
// import { History, Package } from "lucide-react";
// import { format } from "date-fns";
// import { useInventoryLogs } from "@/lib/hooks/useInventory";

// interface AuditLogProps {
//   onRefresh: () => void;
// }

// export function AuditLog({ onRefresh }: AuditLogProps) {
//   const { data: logs, isLoading } = useInventoryLogs();

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case "MEAT":
//         return "bg-rose-50 text-rose-500";
//       case "FISH":
//         return "bg-blue-50 text-blue-500";
//       case "VEGETABLE":
//         return "bg-green-50 text-green-500";
//       case "RICE":
//         return "bg-amber-50 text-amber-500";
//       case "OIL":
//         return "bg-yellow-50 text-yellow-600";
//       case "SPICE":
//         return "bg-orange-50 text-orange-500";
//       case "DAIRY":
//         return "bg-indigo-50 text-indigo-500";
//       default:
//         return "bg-slate-50 text-slate-500";
//     }
//   };

//   return (
//     <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col">
//       <div>
//         <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
//           <History className="w-5 h-5 text-primary-500" /> Inventory Audit Log
//         </h2>

//         {isLoading ? (
//           <div className="py-12 flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
//           </div>
//         ) : (
//           <div className="overflow-y-auto max-h-[400px] pr-2 space-y-4">
//             {logs && logs.length > 0 ? (
//               logs.map((log: any) => {
//                 const isAddition = log.change > 0;
//                 const item = log.inventoryItem;
//                 return (
//                   <div
//                     key={log.id}
//                     className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition px-2 rounded-lg"
//                   >
//                     <div className="flex gap-3 flex-1">
//                       <div
//                         className={`p-2 rounded-xl mt-0.5 ${getCategoryColor(item?.category)}`}
//                       >
//                         <Package className="w-4 h-4" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-semibold text-slate-700">
//                             {item?.name || "Unknown Item"}
//                           </p>
//                           <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
//                             {item?.category || "OTHER"}
//                           </span>
//                         </div>
//                         <p className="text-xs text-slate-400">
//                           {log.reason || "No reason provided"} •
//                           {isAddition ? " Added" : " Removed"}{" "}
//                           {Math.abs(log.change)} {item?.unit || "units"}
//                         </p>
//                         <div className="flex items-center gap-2 mt-0.5">
//                           <span className="text-[10px] text-slate-400">
//                             Stock: {log.previousQuantity} → {log.newQuantity}
//                           </span>
//                         </div>
//                         {log.note && (
//                           <p className="text-xs italic text-slate-400 mt-0.5">
//                             📝 {log.note}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right ml-4">
//                       <p
//                         className={`text-sm font-bold ${isAddition ? "text-emerald-600" : "text-rose-500"}`}
//                       >
//                         {isAddition ? "+" : ""}
//                         {log.change}
//                       </p>
//                       <span className="text-[10px] text-slate-400 block mt-0.5">
//                         {format(new Date(log.date), "MMM dd, hh:mm a")}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-12">
//                 <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                 <p className="text-sm text-slate-400">
//                   No inventory logs recorded yet.
//                 </p>
//                 <p className="text-xs text-slate-300 mt-1">
//                   Start adjusting stock to see logs here.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/inventory/_components/AuditLog.tsx
"use client";

import { Card } from "@/components/ui/Card";
import { History, Package } from "lucide-react";
import { format } from "date-fns";
import { useInventoryLogs } from "@/lib/hooks/useInventory";

interface AuditLogProps {
  onRefresh: () => void;
}

export function AuditLog({ onRefresh }: AuditLogProps) {
  const { data: logs, isLoading } = useInventoryLogs();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MEAT":
        return "bg-rose-50 text-rose-500";
      case "FISH":
        return "bg-blue-50 text-blue-500";
      case "VEGETABLE":
        return "bg-green-50 text-green-500";
      case "RICE":
        return "bg-amber-50 text-amber-500";
      case "OIL":
        return "bg-yellow-50 text-yellow-600";
      case "SPICE":
        return "bg-orange-50 text-orange-500";
      case "DAIRY":
        return "bg-indigo-50 text-indigo-500";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <Card className="col-span-2 p-6 bg-white border border-slate-100 overflow-hidden flex flex-col">
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary-500" /> Inventory Audit Log
        </h2>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[400px] pr-2 space-y-4">
            {logs && logs.length > 0 ? (
              logs.map((log: any) => {
                const isAddition = log.change > 0;
                const item = log.inventoryItem;
                return (
                  <div
                    key={log.id}
                    className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition px-2 rounded-lg"
                  >
                    <div className="flex gap-3 flex-1 min-w-0">
                      <div
                        className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${getCategoryColor(item?.category)}`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-700 truncate">
                            {item?.name || "Unknown Item"}
                          </p>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            {item?.category || "OTHER"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {log.reason || "No reason provided"} •
                          {isAddition ? " Added" : " Removed"} {Math.abs(log.change)} units
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">
                            Stock: {log.previousQuantity} → {log.newQuantity}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-xs italic text-slate-400 mt-0.5 truncate">
                            📝 {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p
                        className={`text-sm font-bold ${isAddition ? "text-emerald-600" : "text-rose-500"}`}
                      >
                        {isAddition ? "+" : ""}{log.change}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {format(new Date(log.date), "MMM dd, hh:mm a")}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  No inventory logs recorded yet.
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Start adjusting stock to see logs here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}