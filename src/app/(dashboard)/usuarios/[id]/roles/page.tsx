import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetUserRolesUseCase,
  makeGetUserUseCase,
  makeListRolesUseCase,
  requirePermission,
} from "@/modules/identity";

import { assignUserRolesAction } from "@/modules/identity/presentation/actions/assign-user-roles.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserRolesPage({ params }: PageProps) {
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
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold text-slate-900">
        Roles del usuario
      </h1>

      <p className="mt-2 text-slate-500">
        {user.fullName ?? "Sin nombre"} · {user.email}
      </p>

      <form
        action={assignUserRolesAction}
        className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="userId" value={user.id} />

        <div className="space-y-3">
          {allRoles.map((role) => (
            <label
              key={role.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                name="roleIds"
                value={role.id}
                defaultChecked={assignedIds.has(role.id)}
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium text-slate-900">{role.displayName}</p>

                {role.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {role.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {allRoles.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No existen roles disponibles.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800"
          >
            Guardar roles
          </button>
        </div>
      </form>
    </main>
  );
}
