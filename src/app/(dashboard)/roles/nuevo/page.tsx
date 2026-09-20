import Link from "next/link";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { createRoleAction } from "@/modules/identity/presentation/actions/create-role.action";

export default async function NewRolePage() {
  try {
    await requirePermission(PERMISSIONS.ROLES.CREATE);
  } catch {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Administración de roles
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Nuevo rol
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Crea un nuevo rol para organizar los permisos de los usuarios.
        </p>
      </div>

      <form
        action={createRoleAction}
        className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="displayName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="displayName"
            name="displayName"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Coordinador comercial"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Describe la finalidad de este rol."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/roles"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Guardar
          </button>
        </div>
      </form>
    </main>
  );
}
