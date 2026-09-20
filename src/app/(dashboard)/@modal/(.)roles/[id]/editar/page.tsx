import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeRoleRepository,
  requirePermission,
} from "@/modules/identity";

import { updateRoleAction } from "@/modules/identity/presentation/actions/update-role.action";

import { Modal } from "@/shared/ui/modal/modal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRoleModalPage({ params }: PageProps) {
  try {
    await requirePermission(PERMISSIONS.ROLES.EDIT);
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const role = await makeRoleRepository().findById(id);

  if (!role) {
    notFound();
  }

  if (role.name === "administrador" || role.isSystem) {
    redirect("/roles");
  }

  return (
    <Modal
      title="Editar rol"
      description="Modifica la información del rol seleccionado."
      size="md"
    >
      <form action={updateRoleAction} className="space-y-6">
        <input type="hidden" name="id" value={role.id} />

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
            defaultValue={role.displayName}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            Identificador actual
          </p>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <code className="text-sm text-slate-600">{role.name}</code>
          </div>
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
            defaultValue={role.description ?? ""}
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
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </Modal>
  );
}
