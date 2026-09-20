import Link from "next/link";

import { redirect } from "next/navigation";

import { requireRole } from "@/modules/identity/application/guards/require-role";

import { createRoleAction } from "@/modules/identity/presentation/actions/create-role.action";

export default async function NewRolePage() {
  try {
    await requireRole("administrador");
  } catch {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold text-slate-900">Nuevo rol</h1>

      <form
        action={createRoleAction}
        className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="displayName"
            className="mb-2 block text-sm font-medium"
          >
            Nombre
          </label>

          <input
            id="displayName"
            name="displayName"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Coordinador comercial"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Descripción
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/roles" className="rounded-lg border px-4 py-2.5">
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </main>
  );
}
