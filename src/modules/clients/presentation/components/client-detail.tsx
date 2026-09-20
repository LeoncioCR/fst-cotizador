import Link from "next/link";

import type { Client, ClientContact } from "@/modules/clients";

import { createClientContactAction } from "../actions/create-client-contact.action";

interface ClientDetailProps {
  client: Client;

  contacts: ClientContact[];

  canEdit: boolean;

  canChangeStatus: boolean;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export function ClientDetail({
  client,
  contacts,
  canEdit,
  canChangeStatus,
}: ClientDetailProps) {
  const isActive = client.status === "active";

  return (
    <div>
      {/* =========================
          CABECERA
      ========================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cliente
          </p>

          <h3 className="mt-1 text-2xl font-semibold text-slate-900">
            {client.name}
          </h3>

          {client.commercialName && (
            <p className="mt-1 text-sm text-slate-500">
              {client.commercialName}
            </p>
          )}
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

      {/* =========================
          INFORMACIÓN
      ========================== */}

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="grid sm:grid-cols-2">
          <DetailItem
            label="Tipo"
            value={
              client.type === "natural" ? "Persona natural" : "Persona jurídica"
            }
          />

          <DetailItem
            label="Documento"
            value={`${client.documentType.toUpperCase()} ${client.documentNumber}`}
          />

          <DetailItem
            label="Dirección"
            value={client.address ?? "No registrada"}
          />

          <DetailItem
            label="Fecha de registro"
            value={formatDate(client.createdAt)}
          />

          {client.notes && (
            <div className="border-t border-slate-100 px-5 py-4 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Notas
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                {client.notes}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          ACCIONES
      ========================== */}

      {(canEdit || canChangeStatus) && (
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {canEdit && (
            <Link
              href={`/clientes?mode=edit&id=${client.id}`}
              scroll={false}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Editar cliente
            </Link>
          )}

          {canChangeStatus && (
            <Link
              href={`/clientes?mode=status&id=${client.id}`}
              scroll={false}
              className={
                isActive
                  ? "rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  : "rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              }
            >
              {isActive ? "Desactivar" : "Activar"}
            </Link>
          )}
        </div>
      )}

      {/* =========================
          CONTACTOS
      ========================== */}

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Contactos</h3>

          <p className="mt-1 text-sm text-slate-500">
            Personas de contacto asociadas al cliente.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {contact.fullName}
                      </p>

                      {contact.isPrimary && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                          Principal
                        </span>
                      )}

                      {!contact.isActive && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                          Inactivo
                        </span>
                      )}
                    </div>

                    {contact.position && (
                      <p className="mt-1 text-xs text-slate-500">
                        {contact.position}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <ContactValue label="Correo" value={contact.email} />

                  <ContactValue label="Teléfono" value={contact.phone} />

                  <ContactValue label="WhatsApp" value={contact.whatsapp} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                No existen contactos registrados.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Puedes registrar un contacto para este cliente.
              </p>
            </div>
          )}
        </div>

        {/* =========================
            NUEVO CONTACTO
        ========================== */}

        {canEdit && (
          <form
            action={createClientContactAction}
            className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5"
          >
            <input type="hidden" name="clientId" value={client.id} />

            <h4 className="font-semibold text-slate-900">Agregar contacto</h4>

            <p className="mt-1 text-xs text-slate-500">
              Registra una persona de contacto asociada al cliente.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-fullName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombre completo
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="contact-fullName"
                  name="fullName"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-position"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cargo
                </label>

                <input
                  id="contact-position"
                  name="position"
                  placeholder="Gerente, representante..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Teléfono
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-whatsapp"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  WhatsApp
                </label>

                <input
                  id="contact-whatsapp"
                  name="whatsapp"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <input type="checkbox" name="isPrimary" className="h-4 w-4" />

                  <span className="text-sm text-slate-700">
                    Contacto principal
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Agregar contacto
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="border-b border-slate-100 px-5 py-4 sm:odd:border-r">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

interface ContactValueProps {
  label: string;
  value: string | null;
}

function ContactValue({ label, value }: ContactValueProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-700">
        {value ?? "No registrado"}
      </p>
    </div>
  );
}
