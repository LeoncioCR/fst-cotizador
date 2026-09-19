"use client";

import { useActionState } from "react";

import {
  setPasswordAction,
  type SetPasswordActionState,
} from "../actions/set-password.action";

const initialState: SetPasswordActionState = {};

export function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    setPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Nueva contraseña */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nueva contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={pending}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50"
          placeholder="••••••••••••"
        />

        {state.fieldErrors?.password && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Confirmar contraseña
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={pending}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50"
          placeholder="••••••••••••"
        />

        {state.fieldErrors?.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">
            {state.fieldErrors.confirmPassword[0]}
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

      {/* Guardar */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Guardando contraseña..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
