import type { ReactNode } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { makeGetCurrentUserUseCase } from "@/modules/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const result = await makeGetCurrentUserUseCase().execute();

  if (!result.success) {
    if (result.error.code === "ACCOUNT_INACTIVE") {
      redirect("/account-disabled");
    }

    redirect("/login");
  }

  const user = result.data;

  const bootstrapAdminId = process.env.BOOTSTRAP_ADMIN_USER_ID;

  const isBootstrapAdmin = user.id === bootstrapAdminId;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
          {/* Logo / sistema */}
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-lg font-semibold text-slate-900">
              FST Cotizador
            </h1>

            <p className="mt-1 text-xs text-slate-500">Sistema empresarial</p>
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Dashboard
            </Link>

            {isBootstrapAdmin && (
              <Link
                href="/usuarios"
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Usuarios
              </Link>
            )}
          </nav>

          {/* Usuario + cerrar sesión */}
          <div className="border-t border-slate-200 p-4">
            <div className="mb-4 rounded-lg bg-slate-50 px-3 py-3">
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

        {/* CONTENIDO */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* HEADER */}
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="font-semibold text-slate-900 lg:hidden"
              >
                FST Cotizador
              </Link>

              {/* Menú móvil */}
              <nav className="hidden items-center gap-1 sm:flex lg:hidden">
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Dashboard
                </Link>

                {isBootstrapAdmin && (
                  <Link
                    href="/usuarios"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Usuarios
                  </Link>
                )}
              </nav>
            </div>

            {/* Cerrar sesión en móvil */}
            <div className="flex items-center gap-4">
              <span className="hidden max-w-48 truncate text-sm text-slate-500 md:block">
                {user.email}
              </span>

              <form action="/signout" method="post" className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Salir
                </button>
              </form>
            </div>
          </header>

          {/* Página actual */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
