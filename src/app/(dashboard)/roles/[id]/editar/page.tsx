import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import { requireRole } from "@/modules/identity/application/guards/require-role";

import { makeRoleRepository } from "@/modules/identity/infrastructure/identity-container";

import { updateRoleAction } from "@/modules/identity/presentation/actions/update-role.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRolePage({ params }: PageProps) {
  /*
   * Solo administradores pueden
   * administrar roles.
   */
  try {
    await requireRole("administrador");
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const roleRepository = makeRoleRepository();

  const role = await roleRepository.findById(id);

  if (!role) {
    notFound();
  }

  /*
   * RN-ROL-004
   * RN-ROL-005
   *
   * administrador y roles del sistema
   * no pueden editarse.
   */
  if (role.name === "administrador" || role.isSystem) {
    redirect("/roles");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      {/* Volver */}
      <Link
        href="/roles"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Volver a roles
      </Link>

      {/* Encabezado */}
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          Administración de roles
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Editar rol
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Modifica la información del rol seleccionado.
        </p>
      </div>

      {/* Formulario */}
      <form
        action={updateRoleAction}
        className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={role.id} />

        {/* Nombre */}
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
            type="text"
            required
            defaultValue={role.displayName}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <p className="mt-2 text-xs text-slate-500">
            El identificador interno se actualizará automáticamente a partir del
            nombre.
          </p>
        </div>

        {/* Identificador actual */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Identificador actual
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <code className="text-sm text-slate-600">{role.name}</code>
          </div>
        </div>

        {/* Descripción */}
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

        {/* Acciones */}
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
            Guardar cambios
          </button>
        </div>
      </form>
    </main>
  );
}
