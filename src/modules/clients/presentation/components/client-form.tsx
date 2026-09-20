import Link from "next/link";

import type { Client } from "../../domain/client";

interface ClientFormProps {
  client?: Client | null;

  action: (formData: FormData) => Promise<void>;
}

export function ClientForm({ client, action }: ClientFormProps) {
  const isEdit = Boolean(client);

  return (
    <form action={action} className="space-y-6">
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Tipo de cliente */}

        <div>
          <label
            htmlFor="client-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tipo de cliente
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="client-type"
            name="type"
            required
            defaultValue={client?.type ?? "natural"}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="natural">Persona natural</option>

            <option value="juridica">Persona jurídica</option>
          </select>
        </div>

        {/* Tipo documento */}

        <div>
          <label
            htmlFor="document-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tipo de documento
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="document-type"
            name="documentType"
            required
            defaultValue={client?.documentType ?? "dni"}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="dni">DNI</option>

            <option value="ruc">RUC</option>
          </select>
        </div>

        {/* Número documento */}

        <div>
          <label
            htmlFor="document-number"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Número de documento
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="document-number"
            name="documentNumber"
            type="text"
            inputMode="numeric"
            required
            defaultValue={client?.documentNumber ?? ""}
            placeholder="DNI o RUC"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            DNI: 8 dígitos · RUC: 11 dígitos.
          </p>
        </div>

        {/* Nombre */}

        <div>
          <label
            htmlFor="client-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre / Razón social
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="client-name"
            name="name"
            type="text"
            required
            defaultValue={client?.name ?? ""}
            placeholder="Nombre completo o razón social"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Nombre comercial */}

        <div>
          <label
            htmlFor="commercial-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre comercial
          </label>

          <input
            id="commercial-name"
            name="commercialName"
            type="text"
            defaultValue={client?.commercialName ?? ""}
            placeholder="Opcional"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Dirección */}

        <div>
          <label
            htmlFor="client-address"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Dirección
          </label>

          <input
            id="client-address"
            name="address"
            type="text"
            defaultValue={client?.address ?? ""}
            placeholder="Dirección del cliente"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Notas */}

        <div className="sm:col-span-2">
          <label
            htmlFor="client-notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notas
          </label>

          <textarea
            id="client-notes"
            name="notes"
            rows={4}
            defaultValue={client?.notes ?? ""}
            placeholder="Información adicional del cliente"
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/clientes"
          scroll={false}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {isEdit ? "Guardar cambios" : "Registrar cliente"}
        </button>
      </div>
    </form>
  );
}
