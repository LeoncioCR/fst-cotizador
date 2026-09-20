import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeCompanyAssets, makeGetSettingsUseCase } from "@/modules/settings";

import { ApplicationError } from "@/shared/errors/application-error";

import { updateCompanySettingsAction } from "@/modules/settings/presentation/actions/update-company-settings.action";

import { updateQuotationSettingsAction } from "@/modules/settings/presentation/actions/update-quotation-settings.action";

import { createCompanyContactAction } from "@/modules/settings/presentation/actions/create-company-contact.action";

import { deleteCompanyContactAction } from "@/modules/settings/presentation/actions/delete-company-contact.action";

import { uploadCompanyLogoAction } from "@/modules/settings/presentation/actions/upload-company-logo.action";

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

export default async function SettingsPage() {
  /*
   * RN-CONF-002
   *
   * Solo usuarios con configuracion.ver
   * pueden consultar el módulo.
   */
  try {
    await requirePermission(PERMISSIONS.SETTINGS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  /*
   * RN-CONF-003
   *
   * Determina si la interfaz
   * permite modificaciones.
   *
   * Los Server Actions vuelven
   * a validar configuracion.editar.
   */
  const canEdit = await can(PERMISSIONS.SETTINGS.EDIT);

  const settings = await makeGetSettingsUseCase().execute();

  /*
   * El logo no se guarda como binario
   * ni guardamos la URL firmada.
   *
   * En PostgreSQL únicamente tenemos
   * algo como:
   *
   * company/logo
   *
   * Aquí generamos una URL temporal.
   */
  let logoUrl: string | null = null;

  if (settings.company.logoPath) {
    try {
      logoUrl = await makeCompanyAssets().getLogoUrl(settings.company.logoPath);
    } catch {
      /*
       * Si el archivo fue eliminado
       * manualmente del Storage o
       * existe algún problema temporal,
       * la página continúa funcionando.
       */
      logoUrl = null;
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      {/* =========================
          ENCABEZADO
      ========================== */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Configuración
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Configuración general de FST Cotizador.
        </p>
      </div>

      {/* =========================
          IDENTIDAD VISUAL
      ========================== */}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Identidad visual
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Logo utilizado en el sistema y en los documentos empresariales.
            </p>
          </div>

          {settings.company.logoPath && (
            <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Logo configurado
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Vista previa */}

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Logo actual
            </p>

            <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={`Logo de ${settings.company.tradeName}`}
                  className="max-h-36 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-semibold text-slate-400 shadow-sm">
                    FST
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Sin logo configurado
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Carga una imagen para utilizarla como logo empresarial.
                  </p>
                </div>
              )}
            </div>

            {settings.company.logoPath && (
              <p className="mt-2 break-all font-mono text-xs text-slate-400">
                {settings.company.logoPath}
              </p>
            )}
          </div>

          {/* Carga */}

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              {settings.company.logoPath ? "Cambiar logo" : "Subir logo"}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Selecciona una imagen PNG, JPG o WEBP. El tamaño máximo permitido
              es de 2 MB.
            </p>

            {canEdit ? (
              <form action={uploadCompanyLogoAction} className="mt-5">
                <label
                  htmlFor="company-logo"
                  className="block text-sm font-medium text-slate-700"
                >
                  Archivo
                </label>

                <input
                  id="company-logo"
                  type="file"
                  name="logo"
                  required
                  accept="image/png,image/jpeg,image/webp"
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    {settings.company.logoPath ? "Cambiar logo" : "Subir logo"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">
                  Tienes acceso de solo lectura. Se requiere{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-700">
                    configuracion.editar
                  </code>{" "}
                  para cambiar el logo.
                </p>
              </div>
            )}

            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs leading-5 text-blue-700">
                El archivo se almacena en Supabase Storage. PostgreSQL conserva
                únicamente la referencia al archivo, no el contenido binario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          EMPRESA
      ========================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Información empresarial
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Información utilizada por FST Cotizador y sus documentos.
          </p>
        </div>

        <form
          action={updateCompanySettingsAction}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          <div>
            <label
              htmlFor="tradeName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nombre comercial
            </label>

            <input
              id="tradeName"
              name="tradeName"
              defaultValue={settings.company.tradeName}
              disabled={!canEdit}
              placeholder="FST Negocios"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="legalName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Razón social
            </label>

            <input
              id="legalName"
              name="legalName"
              defaultValue={settings.company.legalName ?? ""}
              disabled={!canEdit}
              placeholder="Razón social"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="ruc"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              RUC
            </label>

            <input
              id="ruc"
              name="ruc"
              defaultValue={settings.company.ruc ?? ""}
              disabled={!canEdit}
              placeholder="RUC"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Correo empresarial
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.company.email ?? ""}
              disabled={!canEdit}
              placeholder="correo@empresa.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Sitio web
            </label>

            <input
              id="website"
              name="website"
              defaultValue={settings.company.website ?? ""}
              disabled={!canEdit}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Dirección
            </label>

            <input
              id="address"
              name="address"
              defaultValue={settings.company.address ?? ""}
              disabled={!canEdit}
              placeholder="Dirección"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="quotationFooter"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Pie de cotización
            </label>

            <textarea
              id="quotationFooter"
              name="quotationFooter"
              defaultValue={settings.company.quotationFooter ?? ""}
              disabled={!canEdit}
              placeholder="Texto utilizado en el pie de las cotizaciones"
              className="min-h-28 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          {canEdit && (
            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar información
              </button>
            </div>
          )}
        </form>
      </section>

      {/* =========================
          CONFIGURACIÓN DE
          COTIZACIONES
      ========================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Cotizaciones</h2>

          <p className="mt-1 text-sm text-slate-500">
            Valores globales y predeterminados utilizados al crear nuevas
            cotizaciones.
          </p>
        </div>

        <form
          action={updateQuotationSettingsAction}
          className="mt-6 grid gap-5 md:grid-cols-3"
        >
          <div>
            <label
              htmlFor="currencyCode"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Moneda
            </label>

            <input
              id="currencyCode"
              name="currencyCode"
              defaultValue={settings.quotation.currencyCode}
              disabled={!canEdit}
              placeholder="PEN"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="igvRate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              IGV (%)
            </label>

            <input
              id="igvRate"
              name="igvRate"
              type="number"
              step="0.01"
              defaultValue={settings.quotation.igvRate}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="defaultCardMonths"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Meses predeterminados
            </label>

            <input
              id="defaultCardMonths"
              name="defaultCardMonths"
              type="number"
              defaultValue={settings.quotation.defaultCardMonths}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="defaultCashDiscount"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Descuento contado (%)
            </label>

            <input
              id="defaultCashDiscount"
              name="defaultCashDiscount"
              type="number"
              step="0.01"
              defaultValue={settings.quotation.defaultCashDiscount}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="defaultInstallmentDiscount"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Descuento cuotas (%)
            </label>

            <input
              id="defaultInstallmentDiscount"
              name="defaultInstallmentDiscount"
              type="number"
              step="0.01"
              defaultValue={settings.quotation.defaultInstallmentDiscount}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="quotationPrefix"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Prefijo
            </label>

            <input
              id="quotationPrefix"
              name="quotationPrefix"
              defaultValue={settings.quotation.quotationPrefix}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="numberingPadding"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Dígitos numeración
            </label>

            <input
              id="numberingPadding"
              name="numberingPadding"
              type="number"
              defaultValue={settings.quotation.numberingPadding}
              disabled={!canEdit}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label
              htmlFor="defaultValidityDays"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Vigencia predeterminada
            </label>

            <input
              id="defaultValidityDays"
              name="defaultValidityDays"
              type="number"
              defaultValue={settings.quotation.defaultValidityDays ?? ""}
              disabled={!canEdit}
              placeholder="Días"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm disabled:bg-slate-50"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 p-4">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="pricesIncludeIgv"
                defaultChecked={settings.quotation.pricesIncludeIgv}
                disabled={!canEdit}
                className="h-4 w-4"
              />
              Precios incluyen IGV
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="resetNumberingYearly"
                defaultChecked={settings.quotation.resetNumberingYearly}
                disabled={!canEdit}
                className="h-4 w-4"
              />
              Reiniciar numeración cada año
            </label>
          </div>

          {canEdit && (
            <div className="flex justify-end md:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Guardar configuración
              </button>
            </div>
          )}
        </form>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs leading-5 text-blue-700">
            Estos valores son predeterminados. Las cotizaciones históricas
            conservarán sus propios snapshots y no deberán cambiar cuando se
            modifique esta configuración.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACTOS
      ========================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Contactos</h2>

          <p className="mt-1 text-sm text-slate-500">
            La empresa puede mantener múltiples medios de contacto.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {settings.contacts.length > 0 ? (
            settings.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{contact.area}</p>

                  <p className="mt-1 text-sm text-slate-500">
                    {contact.type}
                    {" · "}
                    {contact.value}
                  </p>
                </div>

                {canEdit && (
                  <form action={deleteCompanyContactAction}>
                    <input type="hidden" name="id" value={contact.id} />

                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 transition hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No existen contactos registrados.
              </p>
            </div>
          )}
        </div>

        {canEdit && (
          <form
            action={createCompanyContactAction}
            className="mt-6 grid gap-3 border-t border-slate-200 pt-6 md:grid-cols-4"
          >
            <div>
              <label
                htmlFor="contactArea"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Área
              </label>

              <input
                id="contactArea"
                name="area"
                required
                placeholder="Área comercial"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contactType"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tipo
              </label>

              <select
                id="contactType"
                name="type"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
              >
                <option value="phone">Teléfono</option>

                <option value="whatsapp">WhatsApp</option>

                <option value="email">Correo</option>

                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contactValue"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Contacto
              </label>

              <input
                id="contactValue"
                name="value"
                required
                placeholder="+51 ..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="sortOrder"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Orden
              </label>

              <input
                id="sortOrder"
                type="number"
                name="sortOrder"
                defaultValue={0}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm"
              />
            </div>

            <div className="flex justify-end md:col-span-4">
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
    </main>
  );
}
