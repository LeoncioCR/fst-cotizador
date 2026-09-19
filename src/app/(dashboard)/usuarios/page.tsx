import Link from "next/link";

import { redirect } from "next/navigation";

import { requireBootstrapAdmin } from "@/modules/identity/application/guards/require-bootstrap-admin";

import { makeListUsersUseCase } from "@/modules/identity/infrastructure/identity-container";

import { changeUserStatusAction } from "@/modules/identity/presentation/actions/change-user-status.action";

export default async function UsersPage() {
  try {
    await requireBootstrapAdmin();
  } catch {
    redirect("/dashboard");
  }

  const users = await makeListUsersUseCase().execute();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Usuarios</h1>

          <p className="mt-1 text-sm text-slate-500">
            Administración de usuarios del sistema.
          </p>
        </div>

        <Link
          href="/usuarios/nuevo"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Nuevo usuario
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-5 py-4">Usuario</th>

              <th className="px-5 py-4">Correo</th>

              <th className="px-5 py-4">Estado</th>

              <th className="px-5 py-4">Último acceso</th>

              <th className="px-5 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {user.fullName ?? "Sin nombre"}
                </td>

                <td className="px-5 py-4 text-slate-600">{user.email}</td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                    {user.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {user.lastSignInAt
                    ? new Date(user.lastSignInAt).toLocaleString("es-PE")
                    : "Nunca"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/usuarios/${user.id}`}
                      className="font-medium text-slate-700 hover:text-slate-950"
                    >
                      Ver
                    </Link>

                    <form action={changeUserStatusAction}>
                      <input type="hidden" name="userId" value={user.id} />

                      <input
                        type="hidden"
                        name="status"
                        value={user.status === "active" ? "inactive" : "active"}
                      />

                      <button
                        type="submit"
                        className="text-sm font-medium text-slate-600"
                      >
                        {user.status === "active" ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
