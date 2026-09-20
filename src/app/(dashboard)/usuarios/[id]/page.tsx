import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireRole } from "@/modules/identity/application/guards/require-role";
import { makeGetUserUseCase } from "@/modules/identity/infrastructure/identity-container";
import { changeUserStatusAction } from "@/modules/identity/presentation/actions/change-user-status.action";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Nunca";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  try {
    await requireRole("administrador");
  } catch {
    redirect("/dashboard");
  }

  const { id } = await params;

  const user = await makeGetUserUseCase().execute(id);

  if (!user) {
    notFound();
  }

  const isActive = user.status === "active";

  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* Navegación */}
        <Link
          href="/usuarios"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Volver a usuarios
        </Link>

        {/* Encabezado */}
        <div className="mt-6 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Detalle del usuario
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              {user.fullName ?? "Sin nombre"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">{user.email}</p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Información */}
        <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-900">
              Información general
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información básica y estado de acceso del usuario.
            </p>
          </div>

          <div className="grid sm:grid-cols-2">
            {/* Estado */}
            <div className="border-b border-slate-100 px-6 py-5 sm:border-r">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Estado
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {isActive ? "Activo" : "Inactivo"}
              </p>
            </div>

            {/* Correo confirmado */}
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Correo confirmado
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {user.emailConfirmed ? "Sí" : "No"}
              </p>
            </div>

            {/* Fecha registro */}
            <div className="border-b border-slate-100 px-6 py-5 sm:border-b-0 sm:border-r">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Fecha registro
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(user.createdAt)}
              </p>
            </div>

            {/* Último acceso */}
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Último acceso
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {formatDate(user.lastSignInAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Acciones */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/usuarios/${user.id}/roles`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Administrar roles
          </Link>

          <Link
            href={`/usuarios/${user.id}/editar`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Editar
          </Link>

          <form action={changeUserStatusAction}>
            <input type="hidden" name="userId" value={user.id} />

            <input
              type="hidden"
              name="status"
              value={isActive ? "inactive" : "active"}
            />

            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isActive ? "Desactivar" : "Activar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
