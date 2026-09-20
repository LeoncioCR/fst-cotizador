import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetUserRolesUseCase,
  makeGetUserUseCase,
  makeListRolesUseCase,
  requirePermission,
} from "@/modules/identity";

import { assignUserRolesAction } from "@/modules/identity/presentation/actions/assign-user-roles.action";

import { Modal } from "@/shared/ui/modal/modal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserRolesModalPage({ params }: PageProps) {
  try {
    await requirePermission(PERMISSIONS.USERS.ASSIGN_ROLES);
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [user, allRoles, assignedRoles] = await Promise.all([
    makeGetUserUseCase().execute(id),

    makeListRolesUseCase().execute(),

    makeGetUserRolesUseCase().execute(id),
  ]);

  if (!user) {
    notFound();
  }

  const assignedIds = new Set(assignedRoles.map((role) => role.id));

  return (
    <Modal
      title="Administrar roles"
      description={`${user.fullName ?? "Sin nombre"} · ${user.email}`}
      size="lg"
    >
      <form action={assignUserRolesAction}>
        <input type="hidden" name="userId" value={user.id} />

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
                  defaultChecked={assignedIds.has(role.id)}
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
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No existen roles disponibles.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Link
            href={`/usuarios/${user.id}`}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
  );
}
