import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import {
  PERMISSIONS,
  makeGetUserUseCase,
  requirePermission,
} from "@/modules/identity";

import { updateUserAction } from "@/modules/identity/presentation/actions/update-user.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: PageProps) {
  try {
    await requirePermission(PERMISSIONS.USERS.EDIT);
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const user = await makeGetUserUseCase().execute(id);

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link
        href={`/usuarios/${user.id}`}
        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Volver al usuario
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          Administración de usuarios
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Editar usuario
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Modifica los datos básicos del usuario.
        </p>
      </div>

      <form
        action={updateUserAction}
        className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <input type="hidden" name="id" value={user.id} />

        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre completo
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={user.fullName ?? ""}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Correo electrónico
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={user.email}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            href={`/usuarios/${user.id}`}
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
