"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, Users, Tag, House } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
};

const navItems: NavItem[] = [
  { label: "Resumen", href: ROUTES.ADMIN.ROOT, icon: House },
  { label: "Usuarios", href: ROUTES.ADMIN.USERS, icon: Users },
  { label: "Anuncios", href: ROUTES.ADMIN.ADS, icon: LayoutList },
  { label: "Categorías", href: ROUTES.ADMIN.CATEGORIES, icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-64 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Panel Admin</h2>
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
