import Link from "next/link";

import { redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeListUsersUseCase,
  requirePermission,
} from "@/modules/identity";

import { changeUserStatusAction } from "@/modules/identity/presentation/actions/change-user-status.action";

export default async function UsersPage() {
  try {
    await requirePermission(PERMISSIONS.USERS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const users = await makeListUsersUseCase().execute();

  let canCreate = false;
  let canChangeStatus = false;

  try {
    await requirePermission(PERMISSIONS.USERS.CREATE);

    canCreate = true;
  } catch {
    canCreate = false;
  }

  try {
    await requirePermission(PERMISSIONS.USERS.CHANGE_STATUS);

    canChangeStatus = true;
  } catch {
    canChangeStatus = false;
  }

  return (
    <main className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Usuarios</h1>

          <p className="mt-1 text-sm text-slate-500">
            Administración de usuarios del sistema.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/usuarios/nuevo"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Nuevo usuario
          </Link>
        )}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-5 py-4 font-medium">Usuario</th>

              <th className="px-5 py-4 font-medium">Correo</th>

              <th className="px-5 py-4 font-medium">Estado</th>

              <th className="px-5 py-4 font-medium">Último acceso</th>

              <th className="px-5 py-4 font-medium">Acciones</th>
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
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {user.lastSignInAt
                    ? new Date(user.lastSignInAt).toLocaleString("es-PE")
                    : "Nunca"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/usuarios/${user.id}`}
                      prefetch={false}
                      className="font-medium text-slate-700 transition hover:text-slate-950"
                    >
                      Ver
                    </Link>

                    {canChangeStatus && (
                      <form action={changeUserStatusAction}>
                        <input type="hidden" name="userId" value={user.id} />

                        <input
                          type="hidden"
                          name="status"
                          value={
                            user.status === "active" ? "inactive" : "active"
                          }
                        />

                        <button
                          type="submit"
                          className="font-medium text-slate-600 transition hover:text-slate-950"
                        >
                          {user.status === "active" ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  No existen usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
