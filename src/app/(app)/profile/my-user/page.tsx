"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/shared/components/ui/button";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-4 border-b">
          <div className="bg-primary/10 p-4 rounded-full">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">Información personal del usuario</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="font-medium">Email:</span>
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-700">
            <Shield className="h-5 w-5 text-gray-400" />
            <span className="font-medium">Rol:</span>
            <span className="capitalize px-2 py-1 bg-gray-100 rounded text-sm">
              {user?.role?.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="pt-6">
          <Button disabled className="w-full sm:w-auto">
            Editar Perfil (Próximamente)
          </Button>
        </div>
      </div>
    </div>
  );
}
