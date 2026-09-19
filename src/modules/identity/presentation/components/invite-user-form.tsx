"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  inviteUserAction,
  type InviteUserState,
} from "../actions/invite-user.action";

const initialState: InviteUserState = {};

export function InviteUserForm() {
  const [state, formAction, pending] = useActionState(
    inviteUserAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Nombre completo */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nombre completo <span className="text-red-500">*</span>
        </label>

        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Ej. Juan Pérez"
          disabled={pending}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        {state.fieldErrors?.fullName && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.fullName[0]}
          </p>
        )}
      </div>

      {/* Correo */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Correo electrónico <span className="text-red-500">*</span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="usuario@empresa.com"
          disabled={pending}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        {state.fieldErrors?.email && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Error general */}
      {state.error && (
        <div
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/usuarios"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Enviando invitación..." : "Enviar invitación"}
        </button>
      </div>
    </form>
  );
}
