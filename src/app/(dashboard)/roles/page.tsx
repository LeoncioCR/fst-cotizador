import Link from "next/link";

import { redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeListRolesUseCase,
  requirePermission,
} from "@/modules/identity";

import { ApplicationError } from "@/shared/errors/application-error";

import { deleteRoleAction } from "@/modules/identity/presentation/actions/delete-role.action";

async function can(permission: string): Promise<boolean> {
  try {
    await requirePermission(permission);

    return true;
  } catch (error) {
    if (error instanceof ApplicationError && error.code === "FORBIDDEN") {
      return false;
    }

    throw error;
  }
}

export default async function RolesPage() {
  /*
   * Acceso al módulo.
   */
  try {
    await requirePermission(PERMISSIONS.ROLES.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const [roles, canCreate, canEdit, canDelete, canAssignPermissions] =
    await Promise.all([
      makeListRolesUseCase().execute(),

      can(PERMISSIONS.ROLES.CREATE),

      can(PERMISSIONS.ROLES.EDIT),

      can(PERMISSIONS.ROLES.DELETE),

      can(PERMISSIONS.ROLES.ASSIGN_PERMISSIONS),
    ]);

  return (
    <main className="p-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Roles</h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra los roles disponibles para los usuarios.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/roles/nuevo"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Nuevo rol
          </Link>
        )}
      </div>

      {/* Tabla */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-medium text-slate-600">
                Rol
              </th>

              <th className="px-5 py-4 text-left font-medium text-slate-600">
                Identificador
              </th>

              <th className="px-5 py-4 text-left font-medium text-slate-600">
                Usuarios
              </th>

              <th className="px-5 py-4 text-left font-medium text-slate-600">
                Tipo
              </th>

              <th className="px-5 py-4 text-left font-medium text-slate-600">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => {
              const isProtected =
                role.name === "administrador" || role.isSystem;

              return (
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

                  <td className="px-5 py-4 text-slate-700">{role.userCount}</td>

                  <td className="px-5 py-4">
                    {role.isSystem ? (
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Sistema
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Personalizado
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      {/* Permisos */}
                      {canAssignPermissions && (
                        <Link
                          href={`/roles/${role.id}/permisos`}
                          className="font-medium text-slate-700 transition hover:text-slate-950"
                        >
                          {isProtected ? "Ver permisos" : "Permisos"}
                        </Link>
                      )}

                      {/* Editar */}
                      {canEdit && !isProtected && (
                        <Link
                          href={`/roles/${role.id}/editar`}
                          className="font-medium text-slate-700 transition hover:text-slate-950"
                        >
                          Editar
                        </Link>
                      )}

                      {/* Eliminar */}
                      {canDelete && !isProtected && (
                        <form action={deleteRoleAction}>
                          <input type="hidden" name="id" value={role.id} />

                          <button
                            type="submit"
                            disabled={role.userCount > 0}
                            title={
                              role.userCount > 0
                                ? "No puede eliminar un rol con usuarios asignados."
                                : "Eliminar rol"
                            }
                            className="font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Eliminar
                          </button>
                        </form>
                      )}

                      {!canAssignPermissions &&
                        (!canEdit || isProtected) &&
                        (!canDelete || isProtected) && (
                          <span className="text-xs text-slate-400">
                            Sin acciones disponibles
                          </span>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No existen roles registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
