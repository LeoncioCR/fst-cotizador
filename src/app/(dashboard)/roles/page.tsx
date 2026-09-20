import Link from "next/link";

import { redirect } from "next/navigation";

import { requireRole } from "@/modules/identity/application/guards/require-role";

import { makeListRolesUseCase } from "@/modules/identity/infrastructure/identity-container";

import { deleteRoleAction } from "@/modules/identity/presentation/actions/delete-role.action";

export default async function RolesPage() {
  try {
    await requireRole("administrador");
  } catch {
    redirect("/dashboard");
  }

  const roles = await makeListRolesUseCase().execute();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Roles</h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra los roles disponibles para los usuarios.
          </p>
        </div>

        <Link
          href="/roles/nuevo"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Nuevo rol
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left">Rol</th>

              <th className="px-5 py-4 text-left">Identificador</th>

              <th className="px-5 py-4 text-left">Usuarios</th>

              <th className="px-5 py-4 text-left">Tipo</th>

              <th className="px-5 py-4 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {role.displayName}
                  </p>

                  {role.description && (
                    <p className="mt-1 text-xs text-slate-500">
                      {role.description}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {role.name}
                </td>

                <td className="px-5 py-4">{role.userCount}</td>

                <td className="px-5 py-4">
                  {role.isSystem ? "Sistema" : "Personalizado"}
                </td>

                <td className="px-5 py-4">
                  {!role.isSystem && (
                    <div className="flex gap-3">
                      <Link
                        href={`/roles/${role.id}/editar`}
                        className="font-medium text-slate-700"
                      >
                        Editar
                      </Link>

                      <form action={deleteRoleAction}>
                        <input type="hidden" name="id" value={role.id} />

                        <button
                          type="submit"
                          disabled={role.userCount > 0}
                          className="font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
