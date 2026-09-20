import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeGetSettingsUseCase } from "@/modules/settings";

import { updateCompanySettingsAction } from "@/modules/settings/presentation/actions/update-company-settings.action";

import { updateQuotationSettingsAction } from "@/modules/settings/presentation/actions/update-quotation-settings.action";

import { createCompanyContactAction } from "@/modules/settings/presentation/actions/create-company-contact.action";

import { deleteCompanyContactAction } from "@/modules/settings/presentation/actions/delete-company-contact.action";

export default async function SettingsPage() {
  try {
    await requirePermission(PERMISSIONS.SETTINGS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const settings = await makeGetSettingsUseCase().execute();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Configuración</h1>

        <p className="mt-2 text-slate-500">
          Configuración general de FST Cotizador.
        </p>
      </div>

      {/* EMPRESA */}

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Información empresarial</h2>

        <form
          action={updateCompanySettingsAction}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          <input
            name="tradeName"
            defaultValue={settings.company.tradeName}
            placeholder="Nombre comercial"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="legalName"
            defaultValue={settings.company.legalName ?? ""}
            placeholder="Razón social"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="ruc"
            defaultValue={settings.company.ruc ?? ""}
            placeholder="RUC"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="email"
            defaultValue={settings.company.email ?? ""}
            placeholder="Correo"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="website"
            defaultValue={settings.company.website ?? ""}
            placeholder="Sitio web"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="address"
            defaultValue={settings.company.address ?? ""}
            placeholder="Dirección"
            className="rounded-lg border px-4 py-3"
          />

          <textarea
            name="quotationFooter"
            defaultValue={settings.company.quotationFooter ?? ""}
            placeholder="Texto del pie de las cotizaciones"
            className="min-h-28 rounded-lg border px-4 py-3 md:col-span-2"
          />

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white"
            >
              Guardar información
            </button>
          </div>
        </form>
      </section>

      {/* CONFIGURACIÓN DE COTIZACIONES */}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Cotizaciones</h2>

        <form
          action={updateQuotationSettingsAction}
          className="mt-6 grid gap-5 md:grid-cols-3"
        >
          <input
            name="currencyCode"
            defaultValue={settings.quotation.currencyCode}
            placeholder="PEN"
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="igvRate"
            type="number"
            step="0.01"
            defaultValue={settings.quotation.igvRate}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="defaultCardMonths"
            type="number"
            defaultValue={settings.quotation.defaultCardMonths}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="defaultCashDiscount"
            type="number"
            step="0.01"
            defaultValue={settings.quotation.defaultCashDiscount}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="defaultInstallmentDiscount"
            type="number"
            step="0.01"
            defaultValue={settings.quotation.defaultInstallmentDiscount}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="quotationPrefix"
            defaultValue={settings.quotation.quotationPrefix}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="numberingPadding"
            type="number"
            defaultValue={settings.quotation.numberingPadding}
            className="rounded-lg border px-4 py-3"
          />

          <input
            name="defaultValidityDays"
            type="number"
            defaultValue={settings.quotation.defaultValidityDays ?? ""}
            placeholder="Vigencia en días"
            className="rounded-lg border px-4 py-3"
          />

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pricesIncludeIgv"
                defaultChecked={settings.quotation.pricesIncludeIgv}
              />
              Precios incluyen IGV
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="resetNumberingYearly"
                defaultChecked={settings.quotation.resetNumberingYearly}
              />
              Reiniciar numeración cada año
            </label>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white"
            >
              Guardar configuración
            </button>
          </div>
        </form>
      </section>

      {/* CONTACTOS */}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Contactos</h2>

        <div className="mt-5 space-y-3">
          {settings.contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{contact.area}</p>

                <p className="text-sm text-slate-500">
                  {contact.type}
                  {" · "}
                  {contact.value}
                </p>
              </div>

              <form action={deleteCompanyContactAction}>
                <input type="hidden" name="id" value={contact.id} />

                <button
                  type="submit"
                  className="text-sm font-medium text-red-600"
                >
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>

        <form
          action={createCompanyContactAction}
          className="mt-6 grid gap-3 md:grid-cols-4"
        >
          <input
            name="area"
            placeholder="Área comercial"
            className="rounded-lg border px-4 py-3"
          />

          <select name="type" className="rounded-lg border px-4 py-3">
            <option value="phone">Teléfono</option>

            <option value="whatsapp">WhatsApp</option>

            <option value="email">Correo</option>

            <option value="other">Otro</option>
          </select>

          <input
            name="value"
            placeholder="+51 ..."
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="number"
            name="sortOrder"
            defaultValue={0}
            className="rounded-lg border px-4 py-3"
          />

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white"
            >
              Agregar contacto
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
