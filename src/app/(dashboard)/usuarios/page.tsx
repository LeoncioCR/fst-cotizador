import Link from "next/link";

import { redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetUserRolesUseCase,
  makeGetUserUseCase,
  makeListRolesUseCase,
  makeListUsersUseCase,
  requirePermission,
} from "@/modules/identity";

import { ApplicationError } from "@/shared/errors/application-error";

import { Modal } from "@/shared/ui/modal/modal";

import { InviteUserForm } from "@/modules/identity/presentation/components/invite-user-form";

import { updateUserAction } from "@/modules/identity/presentation/actions/update-user.action";

import { assignUserRolesAction } from "@/modules/identity/presentation/actions/assign-user-roles.action";

import { changeUserStatusAction } from "@/modules/identity/presentation/actions/change-user-status.action";

interface UsersPageProps {
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

function formatDate(value: string | null) {
  if (!value) {
    return "Nunca";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  try {
    await requirePermission(PERMISSIONS.USERS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const modal = firstParam(params.modal);

  const rawId = firstParam(params.id);

  const selectedId = rawId && isUuid(rawId) ? rawId : null;

  /*
   * Listado + permisos UI.
   */

  const [users, canCreate, canEdit, canChangeStatus, canAssignRoles] =
    await Promise.all([
      makeListUsersUseCase().execute(),

      can(PERMISSIONS.USERS.CREATE),

      can(PERMISSIONS.USERS.EDIT),

      can(PERMISSIONS.USERS.CHANGE_STATUS),

      can(PERMISSIONS.USERS.ASSIGN_ROLES),
    ]);

  /*
   * Solo consultamos un usuario
   * cuando un modal realmente lo necesita.
   */

  const userModalNeedsId =
    modal === "detalle" ||
    modal === "editar" ||
    modal === "roles" ||
    modal === "estado";

  const selectedUser =
    userModalNeedsId && selectedId
      ? await makeGetUserUseCase().execute(selectedId)
      : null;

  /*
   * Roles únicamente cuando
   * abrimos ese modal.
   */

  const roleData =
    modal === "roles" && selectedUser && canAssignRoles
      ? await Promise.all([
          makeListRolesUseCase().execute(),

          makeGetUserRolesUseCase().execute(selectedUser.id),
        ])
      : null;

  const allRoles = roleData?.[0] ?? [];

  const assignedRoles = roleData?.[1] ?? [];

  const assignedRoleIds = new Set(assignedRoles.map((role) => role.id));

  return (
    <>
      <main className="p-8">
        {/* Encabezado */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Usuarios</h1>

            <p className="mt-1 text-sm text-slate-500">
              Administración de usuarios del sistema.
            </p>
          </div>

          {canCreate && (
            <Link
              href="/usuarios?modal=nuevo"
              scroll={false}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Nuevo usuario
            </Link>
          )}
        </div>

        {/* Tabla */}

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[950px] text-sm">
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
                      ? formatDate(user.lastSignInAt)
                      : "Nunca"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={`/usuarios?modal=detalle&id=${user.id}`}
                        scroll={false}
                        prefetch={false}
                        className="font-medium text-slate-700 transition hover:text-slate-950"
                      >
                        Ver
                      </Link>

                      {canEdit && (
                        <Link
                          href={`/usuarios?modal=editar&id=${user.id}`}
                          scroll={false}
                          prefetch={false}
                          className="font-medium text-slate-700 transition hover:text-slate-950"
                        >
                          Editar
                        </Link>
                      )}

                      {canAssignRoles && (
                        <Link
                          href={`/usuarios?modal=roles&id=${user.id}`}
                          scroll={false}
                          prefetch={false}
                          className="font-medium text-slate-700 transition hover:text-slate-950"
                        >
                          Roles
                        </Link>
                      )}

                      {canChangeStatus && (
                        <Link
                          href={`/usuarios?modal=estado&id=${user.id}`}
                          scroll={false}
                          prefetch={false}
                          className={
                            user.status === "active"
                              ? "font-medium text-red-600 transition hover:text-red-700"
                              : "font-medium text-emerald-700 transition hover:text-emerald-800"
                          }
                        >
                          {user.status === "active" ? "Desactivar" : "Activar"}
                        </Link>
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

      {/* =========================
          NUEVO USUARIO
      ========================== */}

      {modal === "nuevo" && canCreate && (
        <Modal
          title="Nuevo usuario"
          description="Registra los datos y envía una invitación de acceso."
          closeHref="/usuarios"
          size="md"
        >
          <InviteUserForm />
        </Modal>
      )}

      {/* =========================
          DETALLE
      ========================== */}

      {modal === "detalle" && selectedUser && (
        <Modal
          title="Detalle del usuario"
          description={selectedUser.email}
          closeHref="/usuarios"
          size="lg"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Usuario
              </p>

              <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                {selectedUser.fullName ?? "Sin nombre"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {selectedUser.email}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                selectedUser.status === "active"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {selectedUser.status === "active" ? "Activo" : "Inactivo"}
            </span>
          </div>

          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-slate-100 px-5 py-4 sm:border-r">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Estado
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedUser.status === "active" ? "Activo" : "Inactivo"}
                </p>
              </div>

              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Correo confirmado
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedUser.emailConfirmed ? "Sí" : "No"}
                </p>
              </div>

              <div className="px-5 py-4 sm:border-r">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Fecha registro
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Último acceso
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(selectedUser.lastSignInAt)}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            {canAssignRoles && (
              <Link
                href={`/usuarios?modal=roles&id=${selectedUser.id}`}
                scroll={false}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Administrar roles
              </Link>
            )}

            {canEdit && (
              <Link
                href={`/usuarios?modal=editar&id=${selectedUser.id}`}
                scroll={false}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Editar
              </Link>
            )}

            {canChangeStatus && (
              <Link
                href={`/usuarios?modal=estado&id=${selectedUser.id}`}
                scroll={false}
                className={
                  selectedUser.status === "active"
                    ? "inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    : "inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                }
              >
                {selectedUser.status === "active" ? "Desactivar" : "Activar"}
              </Link>
            )}
          </div>
        </Modal>
      )}

      {/* =========================
          EDITAR
      ========================== */}

      {modal === "editar" && selectedUser && canEdit && (
        <Modal
          title="Editar usuario"
          description="Modifica los datos básicos del usuario."
          closeHref="/usuarios"
          size="md"
        >
          <form action={updateUserAction} className="space-y-6">
            <input type="hidden" name="id" value={selectedUser.id} />

            <div>
              <label
                htmlFor="edit-fullName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Nombre completo
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="edit-fullName"
                name="fullName"
                required
                defaultValue={selectedUser.fullName ?? ""}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Correo electrónico
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="edit-email"
                name="email"
                type="email"
                required
                defaultValue={selectedUser.email}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/usuarios"
                scroll={false}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
          ROLES DE USUARIO
      ========================== */}

      {modal === "roles" && selectedUser && canAssignRoles && (
        <Modal
          title="Administrar roles"
          description={`${selectedUser.fullName ?? "Sin nombre"} · ${selectedUser.email}`}
          closeHref="/usuarios"
          size="lg"
        >
          <form action={assignUserRolesAction}>
            <input type="hidden" name="userId" value={selectedUser.id} />

            {allRoles.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {allRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      name="roleIds"
                      value={role.id}
                      defaultChecked={assignedRoleIds.has(role.id)}
                      className="mt-1 h-4 w-4"
                    />

                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {role.displayName}
                      </p>

                      <p className="mt-1 font-mono text-xs text-slate-400">
                        {role.name}
                      </p>

                      {role.description && (
                        <p className="mt-2 text-sm text-slate-500">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No existen roles disponibles.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/usuarios"
                scroll={false}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar roles
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================
          ACTIVAR / DESACTIVAR
      ========================== */}

      {modal === "estado" && selectedUser && canChangeStatus && (
        <Modal
          title={
            selectedUser.status === "active"
              ? "Desactivar usuario"
              : "Activar usuario"
          }
          description={selectedUser.email}
          closeHref="/usuarios"
          size="sm"
        >
          <p className="text-sm leading-6 text-slate-600">
            {selectedUser.status === "active"
              ? `¿Estás seguro de desactivar a ${selectedUser.fullName ?? selectedUser.email}?`
              : `¿Deseas activar nuevamente a ${selectedUser.fullName ?? selectedUser.email}?`}
          </p>

          <form
            action={changeUserStatusAction}
            className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"
          >
            <input type="hidden" name="userId" value={selectedUser.id} />

            <input
              type="hidden"
              name="status"
              value={selectedUser.status === "active" ? "inactive" : "active"}
            />

            <Link
              href="/usuarios"
              scroll={false}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className={
                selectedUser.status === "active"
                  ? "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                  : "rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              }
            >
              {selectedUser.status === "active"
                ? "Sí, desactivar"
                : "Sí, activar"}
            </button>
          </form>
        </Modal>
      )}

      {/* ID inválido/no encontrado */}

      {userModalNeedsId && (!selectedId || !selectedUser) && (
        <Modal
          title="Usuario no encontrado"
          description="No fue posible localizar el usuario solicitado."
          closeHref="/usuarios"
          size="sm"
        >
          <div className="flex justify-end">
            <Link
              href="/usuarios"
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
