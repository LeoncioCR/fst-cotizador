import type { ReactNode } from "react";

import Link from "next/link";

import { redirect } from "next/navigation";

import { getCurrentUserCached } from "@/modules/auth";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { ApplicationError } from "@/shared/errors/application-error";

interface DashboardLayoutProps {
  children: ReactNode;
}

/*
 * Comprueba un permiso únicamente
 * para decidir si mostramos opciones
 * dentro de la interfaz.
 *
 * La seguridad definitiva continúa
 * ejecutándose en páginas, Server Actions
 * y casos de uso.
 */
async function can(permission: string): Promise<boolean> {
  try {
    await requirePermission(permission);

    return true;
  } catch (error) {
    if (error instanceof ApplicationError && error.code === "FORBIDDEN") {
      return false;
    }

    throw error;
  }
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  /*
   * Usuario autenticado.
   *
   * getCurrentUserCached evita repetir
   * innecesariamente la consulta durante
   * la misma renderización.
   */
  const result = await getCurrentUserCached();

  if (!result.success) {
    /*
     * Usuario autenticado pero inactivo.
     */
    if (result.error.code === "ACCOUNT_INACTIVE") {
      redirect("/account-disabled");
    }

    /*
     * Sesión inexistente o inválida.
     */
    redirect("/login");
  }

  const user = result.data;

  /*
   * Permisos necesarios únicamente
   * para construir el menú.
   *
   * El administrador recibe todos
   * automáticamente por RN-PER-006.
   */
  const [canViewDashboard, canViewUsers, canViewRoles] = await Promise.all([
    can(PERMISSIONS.DASHBOARD.VIEW),

    can(PERMISSIONS.USERS.VIEW),

    can(PERMISSIONS.ROLES.VIEW),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* =========================
            SIDEBAR
        ========================== */}

        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          {/* Marca */}

          <div className="border-b border-slate-200 px-6 py-5">
            <Link href="/dashboard" className="block">
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                FST Cotizador
              </h1>

              <p className="mt-1 text-xs text-slate-500">Sistema empresarial</p>
            </Link>
          </div>

          {/* Navegación */}

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {canViewDashboard && (
              <Link
                href="/dashboard"
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Dashboard
              </Link>
            )}

            {canViewUsers && (
              <Link
                href="/usuarios"
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Usuarios
              </Link>
            )}

            {canViewRoles && (
              <Link
                href="/roles"
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Roles
              </Link>
            )}
          </nav>

          {/* Usuario */}

          <div className="border-t border-slate-200 p-4">
            <div className="mb-4 rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-xs font-medium text-slate-500">
                Sesión iniciada
              </p>

              <p className="mt-1 truncate text-sm font-medium text-slate-800">
                {user.email ?? "Usuario"}
              </p>
            </div>

            <form action="/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </aside>

        {/* =========================
            ÁREA PRINCIPAL
        ========================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}

          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            {/* Navegación móvil / tablet */}

            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/dashboard"
                className="truncate font-semibold text-slate-900 lg:hidden"
              >
                FST Cotizador
              </Link>

              <nav className="hidden items-center gap-1 sm:flex lg:hidden">
                {canViewDashboard && (
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Dashboard
                  </Link>
                )}

                {canViewUsers && (
                  <Link
                    href="/usuarios"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Usuarios
                  </Link>
                )}

                {canViewRoles && (
                  <Link
                    href="/roles"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Roles
                  </Link>
                )}
              </nav>
            </div>

            {/* Sesión */}

            <div className="flex min-w-0 items-center gap-4">
              <div className="hidden min-w-0 text-right md:block">
                <p className="max-w-56 truncate text-sm font-medium text-slate-700">
                  {user.email}
                </p>

                <p className="text-xs text-slate-400">Cuenta activa</p>
              </div>

              <form action="/signout" method="post" className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Salir
                </button>
              </form>
            </div>
          </header>

          {/* Contenido */}

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
