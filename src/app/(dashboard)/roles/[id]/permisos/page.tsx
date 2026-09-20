import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  requirePermission,
  makeGetRolePermissionsUseCase,
  makeGetRoleUseCase,
  makeListPermissionsUseCase,
} from "@/modules/identity";

import { assignRolePermissionsAction } from "@/modules/identity/presentation/actions/assign-role-permissions.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RolePermissionsPage({ params }: PageProps) {
  try {
    await requirePermission(PERMISSIONS.ROLES.ASSIGN_PERMISSIONS);
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [role, permissions, assignedPermissions] = await Promise.all([
    makeGetRoleUseCase().execute(id),

    makeListPermissionsUseCase().execute(),

    makeGetRolePermissionsUseCase().execute(id),
  ]);

  if (!role) {
    notFound();
  }

  const assignedIds = new Set(
    assignedPermissions.map((permission) => permission.id),
  );

  const grouped = permissions.reduce<Record<string, typeof permissions>>(
    (accumulator, permission) => {
      if (!accumulator[permission.module]) {
        accumulator[permission.module] = [];
      }

      accumulator[permission.module].push(permission);

      return accumulator;
    },
    {},
  );

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Permisos del rol
        </h1>

        <p className="mt-2 text-slate-500">{role.displayName}</p>

        {role.isSystem && (
          <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            El rol administrador tiene todos los permisos y no puede
            modificarse.
          </div>
        )}
      </div>

      <form action={assignRolePermissionsAction} className="mt-8 space-y-8">
        <input type="hidden" name="roleId" value={role.id} />

        {Object.entries(grouped).map(([moduleName, modulePermissions]) => (
          <section
            key={moduleName}
            className="rounded-xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold capitalize text-slate-900">
                {moduleName.replaceAll("_", " ")}
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {modulePermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-start gap-4 px-6 py-4"
                >
                  <input
                    type="checkbox"
                    name="permissionIds"
                    value={permission.id}
                    defaultChecked={assignedIds.has(permission.id)}
                    disabled={role.isSystem}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {permission.displayName}
                    </p>

                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {permission.name}
                    </p>

                    {permission.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </section>
        ))}

        {!role.isSystem && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white"
            >
              Guardar permisos
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
