"use client";
import type { ReactNode } from "react";
import { useUIStore } from "@/stores/ui.store";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const dark = useUIStore((s) => s.darkMode);

  return (
    <div className={dark ? "dark bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>
        <div className="min-h-screen flex">
          <aside className="w-64 border-r border-slate-200">
            {/* <AdminSidebar /> */}
          </aside>
          <main className="flex-1">
            <div className="container mx-auto">{children}</div>
          </main>
        </div>
    </div>
  );
}