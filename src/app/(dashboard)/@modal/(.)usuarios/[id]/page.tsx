import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetUserUseCase,
  requirePermission,
} from "@/modules/identity";

import { ApplicationError } from "@/shared/errors/application-error";

import { changeUserStatusAction } from "@/modules/identity/presentation/actions/change-user-status.action";

import { Modal } from "@/shared/ui/modal/modal";

interface PageProps {
  params: Promise<{
    id: string;
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

export default async function UserDetailModalPage({ params }: PageProps) {
  try {
    await requirePermission(PERMISSIONS.USERS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [user, canEdit, canChangeStatus, canAssignRoles] = await Promise.all([
    makeGetUserUseCase().execute(id),

    can(PERMISSIONS.USERS.EDIT),

    can(PERMISSIONS.USERS.CHANGE_STATUS),

    can(PERMISSIONS.USERS.ASSIGN_ROLES),
  ]);

  if (!user) {
    notFound();
  }

  const isActive = user.status === "active";

  return (
    <Modal title="Detalle del usuario" description={user.email} size="lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Usuario
          </p>

          <h3 className="mt-1 text-2xl font-semibold text-slate-900">
            {user.fullName ?? "Sin nombre"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid sm:grid-cols-2">
          <div className="border-b border-slate-100 px-5 py-4 sm:border-r">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Estado
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {isActive ? "Activo" : "Inactivo"}
            </p>
          </div>

          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Correo confirmado
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {user.emailConfirmed ? "Sí" : "No"}
            </p>
          </div>

          <div className="border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Fecha registro
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Último acceso
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {formatDate(user.lastSignInAt)}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {canAssignRoles && (
          <Link
            href={`/usuarios/${user.id}/roles`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Administrar roles
          </Link>
        )}

        {canEdit && (
          <Link
            href={`/usuarios/${user.id}/editar`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Editar
          </Link>
        )}

        {canChangeStatus && (
          <form action={changeUserStatusAction}>
            <input type="hidden" name="userId" value={user.id} />

            <input
              type="hidden"
              name="status"
              value={isActive ? "inactive" : "active"}
            />

            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isActive ? "Desactivar" : "Activar"}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
