import Link from "next/link";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { createRoleAction } from "@/modules/identity/presentation/actions/create-role.action";

import { Modal } from "@/shared/ui/modal/modal";

export default async function NewRoleModalPage() {
  try {
    await requirePermission(PERMISSIONS.ROLES.CREATE);
  } catch {
    redirect("/dashboard");
  }

  return (
    <Modal
      title="Nuevo rol"
      description="Crea un rol para organizar los permisos del sistema."
      size="md"
    >
      <form action={createRoleAction} className="space-y-6">
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
            placeholder="Coordinador comercial"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
            placeholder="Describe la finalidad de este rol."
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
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
    </Modal>
  );
}
