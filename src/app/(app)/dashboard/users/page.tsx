"use client";

import { useEffect, useState } from "react";
import { getUsers, AdminUser, updateUserStatus } from "@/modules/dashboard/services/admin.service";
import { Spinner } from "@/shared/components/ui/spinner";
import axios from "axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getUsers();
        if (!mounted) return;
        setUsers(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        if (!mounted) return;
        const msg =
          axios.isAxiosError(err) && err.response?.status === 403
            ? "No tienes permisos para ver los usuarios."
            : "No se pudieron cargar los usuarios.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    setUpdatingId(user.id);
    try {
      await updateUserStatus(user.id, nextStatus as "ACTIVE" | "BLOCKED");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo actualizar el estado del usuario.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
                      onClick={() => toggleStatus(user)}
                      disabled={updatingId === user.id}
                    >
                      {updatingId === user.id
                        ? "Actualizando..."
                        : user.status === "BLOCKED"
                        ? "Desbloquear"
                        : "Bloquear"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner className="size-5" />
          <span>Cargando usuarios...</span>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
