import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

import { SetPasswordForm } from "@/modules/auth";

export default async function SetPasswordPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * Esta pantalla necesita una sesión válida.
   *
   * La sesión se obtiene cuando el usuario
   * acepta correctamente su invitación.
   */
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          FST Negocios
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Crear contraseña
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Define una contraseña para completar la configuración de tu cuenta.
        </p>

        <div className="mt-8">
          <SetPasswordForm />
        </div>
      </section>
    </main>
  );
}
