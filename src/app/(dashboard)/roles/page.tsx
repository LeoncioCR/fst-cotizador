import Link from "next/link";

import { redirect } from "next/navigation";

import type { Permission } from "@/modules/identity";

import {
  PERMISSIONS,
  makeGetRolePermissionsUseCase,
  makeGetRoleUseCase,
  makeListPermissionsUseCase,
  makeListRolesUseCase,
  requirePermission,
} from "@/modules/identity";

import { ApplicationError } from "@/shared/errors/application-error";

import { Modal } from "@/shared/ui/modal/modal";

import { createRoleAction } from "@/modules/identity/presentation/actions/create-role.action";

import { updateRoleAction } from "@/modules/identity/presentation/actions/update-role.action";

import { deleteRoleAction } from "@/modules/identity/presentation/actions/delete-role.action";

import { assignRolePermissionsAction } from "@/modules/identity/presentation/actions/assign-role-permissions.action";

interface RolesPageProps {
  searchParams: Promise<{
    modal?: string | string[];

    id?: string | string[];
  }>;
}

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

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default async function RolesPage({ searchParams }: RolesPageProps) {
  try {
    await requirePermission(PERMISSIONS.ROLES.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const modal = firstParam(params.modal);

  const rawId = firstParam(params.id);

  const selectedId = rawId && isUuid(rawId) ? rawId : null;

  const [roles, canCreate, canEdit, canDelete, canAssignPermissions] =
    await Promise.all([
      makeListRolesUseCase().execute(),

      can(PERMISSIONS.ROLES.CREATE),

      can(PERMISSIONS.ROLES.EDIT),

      can(PERMISSIONS.ROLES.DELETE),

      can(PERMISSIONS.ROLES.ASSIGN_PERMISSIONS),
    ]);

  const roleModalNeedsId =
    modal === "editar" || modal === "permisos" || modal === "eliminar";

  const selectedRole =
    roleModalNeedsId && selectedId
      ? await makeGetRoleUseCase().execute(selectedId)
      : null;

  /*
   * selectedRole devuelve Role,
   * y Role no contiene userCount.
   *
   * El listado sí devuelve RoleSummary,
   * que contiene userCount.
   *
   * Reutilizamos "roles" para evitar
   * otra consulta a la base de datos.
   */
  const selectedRoleSummary = selectedRole
    ? (roles.find((role) => role.id === selectedRole.id) ?? null)
    : null;

  const protectedRole = selectedRole
    ? selectedRole.name === "administrador" || selectedRole.isSystem
    : false;

  /*
   * Solo consultamos permisos
   * cuando realmente abrimos
   * el modal de permisos.
   */
  const permissionData =
    modal === "permisos" && selectedRole && canAssignPermissions
      ? await Promise.all([
          makeListPermissionsUseCase().execute(),

          makeGetRolePermissionsUseCase().execute(selectedRole.id),
        ])
      : null;

  const permissions = permissionData?.[0] ?? [];

  const assignedPermissions = permissionData?.[1] ?? [];

  const assignedPermissionIds = new Set(
    assignedPermissions.map((permission) => permission.id),
  );

  const groupedPermissions: Record<string, Permission[]> = {};

  for (const permission of permissions) {
    if (!groupedPermissions[permission.module]) {
      groupedPermissions[permission.module] = [];
    }

    groupedPermissions[permission.module].push(permission);
  }

  return (
    <>
      <main className="p-8">
        {/* =========================
            ENCABEZADO
        ========================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Roles</h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra los roles y permisos del sistema.
            </p>
          </div>

          {canCreate && (
            <Link
              href="/roles?modal=nuevo"
              scroll={false}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Nuevo rol
            </Link>
          )}
        </div>

        {/* =========================
            TABLA
        ========================== */}

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
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

                    <td className="px-5 py-4 text-slate-700">
                      {role.userCount}
                    </td>

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
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        {canAssignPermissions && (
                          <Link
                            href={`/roles?modal=permisos&id=${role.id}`}
                            scroll={false}
                            prefetch={false}
                            className="font-medium text-slate-700 transition hover:text-slate-950"
                          >
                            {isProtected ? "Ver permisos" : "Permisos"}
                          </Link>
                        )}

                        {canEdit && !isProtected && (
                          <Link
                            href={`/roles?modal=editar&id=${role.id}`}
                            scroll={false}
                            prefetch={false}
                            className="font-medium text-slate-700 transition hover:text-slate-950"
                          >
                            Editar
                          </Link>
                        )}

                        {canDelete && !isProtected && role.userCount === 0 && (
                          <Link
                            href={`/roles?modal=eliminar&id=${role.id}`}
                            scroll={false}
                            prefetch={false}
                            className="font-medium text-red-600 transition hover:text-red-700"
                          >
                            Eliminar
                          </Link>
                        )}

                        {canDelete && !isProtected && role.userCount > 0 && (
                          <span
                            title="No puede eliminar un rol con usuarios asignados."
                            className="cursor-not-allowed font-medium text-red-300"
                          >
                            Eliminar
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

      {/* =========================
          NUEVO ROL
      ========================== */}

      {modal === "nuevo" && canCreate && (
        <Modal
          title="Nuevo rol"
          description="Crea un rol para organizar los permisos del sistema."
          closeHref="/roles"
          size="md"
        >
          <form action={createRoleAction} className="space-y-6">
            <div>
              <label
                htmlFor="new-role-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nombre
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="new-role-name"
                name="displayName"
                required
                placeholder="Coordinador comercial"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="new-role-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Descripción
              </label>

              <textarea
                id="new-role-description"
                name="description"
                rows={4}
                placeholder="Describe la finalidad del rol."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/roles"
                scroll={false}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================
          EDITAR ROL
      ========================== */}

      {modal === "editar" && selectedRole && canEdit && !protectedRole && (
        <Modal
          title="Editar rol"
          description="Modifica la información del rol."
          closeHref="/roles"
          size="md"
        >
          <form action={updateRoleAction} className="space-y-6">
            <input type="hidden" name="id" value={selectedRole.id} />

            <div>
              <label
                htmlFor="edit-role-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nombre
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="edit-role-name"
                name="displayName"
                required
                defaultValue={selectedRole.displayName}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Identificador
              </p>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <code className="text-sm text-slate-600">
                  {selectedRole.name}
                </code>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-role-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Descripción
              </label>

              <textarea
                id="edit-role-description"
                name="description"
                rows={4}
                defaultValue={selectedRole.description ?? ""}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/roles"
                scroll={false}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================
          PERMISOS
      ========================== */}

      {modal === "permisos" && selectedRole && canAssignPermissions && (
        <Modal
          title={protectedRole ? "Ver permisos" : "Administrar permisos"}
          description={`${selectedRole.displayName} · ${selectedRole.name}`}
          closeHref="/roles"
          size="xl"
        >
          {protectedRole && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Este rol es protegido. Sus permisos pueden visualizarse, pero no
              modificarse.
            </div>
          )}

          <form action={assignRolePermissionsAction}>
            <input type="hidden" name="roleId" value={selectedRole.id} />

            <div className="grid gap-4 lg:grid-cols-2">
              {Object.entries(groupedPermissions).map(
                ([moduleName, modulePermissions]) => (
                  <section
                    key={moduleName}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                      <h3 className="font-semibold capitalize text-slate-900">
                        {moduleName.replaceAll("_", " ")}
                      </h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {modulePermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className={`flex items-start gap-3 px-5 py-4 ${
                            protectedRole
                              ? "cursor-default"
                              : "cursor-pointer hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="permissionIds"
                            value={permission.id}
                            defaultChecked={assignedPermissionIds.has(
                              permission.id,
                            )}
                            disabled={protectedRole}
                            className="mt-1 h-4 w-4"
                          />

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {permission.displayName}
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-slate-400">
                              {permission.name}
                            </p>

                            {permission.description && (
                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>
                ),
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/roles"
                scroll={false}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {protectedRole ? "Cerrar" : "Cancelar"}
              </Link>

              {!protectedRole && (
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Guardar permisos
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}

      {/* =========================
          ELIMINAR
      ========================== */}

      {modal === "eliminar" && selectedRole && canDelete && !protectedRole && (
        <Modal
          title="Eliminar rol"
          description={selectedRole.displayName}
          closeHref="/roles"
          size="sm"
        >
          {(selectedRoleSummary?.userCount ?? 0) > 0 ? (
            <>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Este rol tiene{" "}
                <strong>{selectedRoleSummary?.userCount ?? 0}</strong>{" "}
                usuario(s) asignado(s) y no puede eliminarse.
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href="/roles"
                  scroll={false}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
                >
                  Cerrar
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-slate-600">
                ¿Estás seguro de eliminar el rol{" "}
                <strong>{selectedRole.displayName}</strong>?
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Esta acción eliminará el rol del sistema.
              </p>

              <form
                action={deleteRoleAction}
                className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"
              >
                <input type="hidden" name="id" value={selectedRole.id} />

                <Link
                  href="/roles"
                  scroll={false}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
              </form>
            </>
          )}
        </Modal>
      )}

      {/* =========================
          ROL NO ENCONTRADO
      ========================== */}

      {roleModalNeedsId && (!selectedId || !selectedRole) && (
        <Modal
          title="Rol no encontrado"
          description="No fue posible localizar el rol solicitado."
          closeHref="/roles"
          size="sm"
        >
          <div className="flex justify-end">
            <Link
              href="/roles"
              scroll={false}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Cerrar
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
