import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetRolePermissionsUseCase,
  makeGetRoleUseCase,
  makeListPermissionsUseCase,
  requirePermission,
} from "@/modules/identity";

import { assignRolePermissionsAction } from "@/modules/identity/presentation/actions/assign-role-permissions.action";

import { Modal } from "@/shared/ui/modal/modal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RolePermissionsModalPage({ params }: PageProps) {
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

  const protectedRole = role.name === "administrador" || role.isSystem;

  return (
    <Modal
      title={protectedRole ? "Ver permisos" : "Administrar permisos"}
      description={`${role.displayName} · ${role.name}`}
      size="xl"
    >
      {protectedRole && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          El rol administrador posee todos los permisos del sistema y no puede
          modificarse.
        </div>
      )}

      <form action={assignRolePermissionsAction} className="space-y-5">
        <input type="hidden" name="roleId" value={role.id} />

        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(grouped).map(([moduleName, modulePermissions]) => (
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
                      defaultChecked={assignedIds.has(permission.id)}
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
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/roles"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
  );
}
