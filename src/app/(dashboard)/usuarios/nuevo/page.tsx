import { redirect } from "next/navigation";

import { requireRole } from "@/modules/identity/application/guards/require-role";
import { InviteUserForm } from "@/modules/identity/presentation/components/invite-user-form";

export default async function NewUserPage() {
  try {
    await requireRole("administrador");
  } catch {
    redirect("/dashboard");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Administración de usuarios
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Nuevo usuario
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Registra los datos del usuario para enviarle una invitación de
            acceso al sistema.
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <InviteUserForm />
        </section>
      </div>
    </main>
  );
}
