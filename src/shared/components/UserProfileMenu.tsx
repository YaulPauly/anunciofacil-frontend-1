"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  LayoutList,
  Settings,
  ChevronDown,
  UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthService from "@/modules/auth/services/authService";
import { ROUTES } from "@/shared/constants/routes";
import { ROLES } from "@/shared/constants/roles";
import { cn } from "@/shared/utils";
import type { User as AuthUser } from "@/types/auth.types";

interface UserProfileMenuProps {
  user: AuthUser;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    AuthService.logout();
    setIsOpen(false);
    router.push(ROUTES.HOME);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  type MenuItem = {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    separator?: boolean;
  };

  const menuItems: MenuItem[] = isDashboard
    ? []
    : [
        {
          name: "Mi perfil",
          href: ROUTES.PROFILE.ROOT,
          icon: User,
          separator: false,
        },
        {
          name: "Mis anuncios",
          href: ROUTES.PROFILE.MY_ADS,
          icon: LayoutList,
          separator: user.role !== ROLES.ADMIN,
        },
      ];

  if (user.role === ROLES.ADMIN) {
    menuItems.push({
      name: "Panel Admin",
      href: ROUTES.ADMIN.ROOT,
      icon: Settings,
      separator: true,
    });
    menuItems.push({
      name: "Crear categoría",
      href: ROUTES.ADMIN.CATEGORIES,
      icon: Settings,
      separator: false,
    });
  }
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Botón Principal (Toggle) */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-full text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserIcon className="size-5 mr-2" />
        <span className="truncate max-w-[100px] hidden sm:inline">
          {user.firstName}
        </span>
        <ChevronDown
          className={cn(
            "size-4 ml-1 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <item.icon className="size-4 mr-3 text-gray-400" />
                  {item.name}
                </Link>
                {item.separator && (
                  <div className="border-t border-gray-100 my-1" />
                )}
              </React.Fragment>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              role="menuitem"
            >
              <LogOut className="size-4 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
