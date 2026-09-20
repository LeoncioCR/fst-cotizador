import Link from "next/link";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import {
  makeGetClientUseCase,
  makeListClientsUseCase,
} from "@/modules/clients";

import { ApplicationError } from "@/shared/errors/application-error";

import { Modal } from "@/shared/ui/modal/modal";

import { ClientForm } from "@/modules/clients/presentation/components/client-form";

import { ClientDetail } from "@/modules/clients/presentation/components/client-detail";

import { createClientAction } from "@/modules/clients/presentation/actions/create-client.action";

import { updateClientAction } from "@/modules/clients/presentation/actions/update-client.action";

import { changeClientStatusAction } from "@/modules/clients/presentation/actions/change-client-status.action";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    page?: string;

    mode?: string;
    id?: string;
  }>;
}

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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function buildListHref(
  params: {
    q?: string;
    status?: string;
    type?: string;
  },
  page?: number,
) {
  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.status) {
    search.set("status", params.status);
  }

  if (params.type) {
    search.set("type", params.type);
  }

  if (page && page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();

  return query ? `/clientes?${query}` : "/clientes";
}

export default async function ClientsPage({ searchParams }: PageProps) {
  /*
   * =========================
   * PERMISO BASE
   * =========================
   */

  try {
    await requirePermission(PERMISSIONS.CLIENTS.VIEW);
  } catch {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page ?? 1) || 1);

  const status =
    params.status === "active" || params.status === "inactive"
      ? params.status
      : undefined;

  const type =
    params.type === "natural" || params.type === "juridica"
      ? params.type
      : undefined;

  /*
   * =========================
   * LISTADO + PERMISOS UI
   * =========================
   */

  const [result, canCreate, canEdit, canChangeStatus] = await Promise.all([
    makeListClientsUseCase().execute({
      search: params.q,

      status,

      type,

      page: currentPage,

      pageSize: 20,
    }),

    can(PERMISSIONS.CLIENTS.CREATE),

    can(PERMISSIONS.CLIENTS.EDIT),

    can(PERMISSIONS.CLIENTS.CHANGE_STATUS),
  ]);

  /*
   * URL limpia del listado.
   *
   * Conserva filtros cuando
   * cerramos un modal.
   */
  const listHref = buildListHref(
    {
      q: params.q,
      status,
      type,
    },
    currentPage,
  );

  /*
   * =========================
   * CONTROL DE MODALES
   * =========================
   */

  const mode = params.mode;

  /*
   * Si intenta acceder manualmente
   * a una operación sin permiso,
   * volvemos al listado.
   */
  if (mode === "create" && !canCreate) {
    redirect(listHref);
  }

  if (mode === "edit" && !canEdit) {
    redirect(listHref);
  }

  if (mode === "status" && !canChangeStatus) {
    redirect(listHref);
  }

  const modalNeedsClient =
    mode === "view" || mode === "edit" || mode === "status";

  const selectedId = params.id && isUuid(params.id) ? params.id : null;

  const detail =
    modalNeedsClient && selectedId
      ? await makeGetClientUseCase().execute(selectedId)
      : null;

  /*
   * Helper para abrir un modal
   * conservando filtros.
   */
  function modalHref(targetMode: string, id?: string) {
    const search = new URLSearchParams();

    if (params.q) {
      search.set("q", params.q);
    }

    if (status) {
      search.set("status", status);
    }

    if (type) {
      search.set("type", type);
    }

    if (currentPage > 1) {
      search.set("page", String(currentPage));
    }

    search.set("mode", targetMode);

    if (id) {
      search.set("id", id);
    }

    return `/clientes?${search.toString()}`;
  }

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8">
        {/* =========================
            ENCABEZADO
        ========================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Comercial
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Clientes
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Administración de clientes y sus contactos.
            </p>
          </div>

          {canCreate && (
            <Link
              href={modalHref("create")}
              scroll={false}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Nuevo cliente
            </Link>
          )}
        </div>

        {/* =========================
            FILTROS
        ========================== */}

        <form
          method="get"
          className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_190px_190px_auto]"
        >
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Buscar nombre, DNI o RUC..."
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="">Todos los tipos</option>

            <option value="natural">Persona natural</option>

            <option value="juridica">Persona jurídica</option>
          </select>

          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-500"
          >
            <option value="">Todos los estados</option>

            <option value="active">Activos</option>

            <option value="inactive">Inactivos</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Buscar
            </button>

            {(params.q || params.status || params.type) && (
              <Link
                href="/clientes"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Limpiar
              </Link>
            )}
          </div>
        </form>

        {/* =========================
            TABLA
        ========================== */}

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left font-medium text-slate-600">
                  Cliente
                </th>

                <th className="px-5 py-4 text-left font-medium text-slate-600">
                  Documento
                </th>

                <th className="px-5 py-4 text-left font-medium text-slate-600">
                  Tipo
                </th>

                <th className="px-5 py-4 text-left font-medium text-slate-600">
                  Estado
                </th>

                <th className="px-5 py-4 text-left font-medium text-slate-600">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {result.items.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{client.name}</p>

                    {client.commercialName && (
                      <p className="mt-1 text-xs text-slate-500">
                        {client.commercialName}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium uppercase text-slate-400">
                      {client.documentType}
                    </span>

                    <p className="mt-1 text-slate-700">
                      {client.documentNumber}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {client.type === "natural"
                      ? "Persona natural"
                      : "Persona jurídica"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        client.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {client.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <Link
                        href={modalHref("view", client.id)}
                        scroll={false}
                        prefetch={false}
                        className="font-medium text-slate-700 transition hover:text-slate-950"
                      >
                        Ver
                      </Link>

                      {canEdit && (
                        <Link
                          href={modalHref("edit", client.id)}
                          scroll={false}
                          prefetch={false}
                          className="font-medium text-slate-700 transition hover:text-slate-950"
                        >
                          Editar
                        </Link>
                      )}

                      {canChangeStatus && (
                        <Link
                          href={modalHref("status", client.id)}
                          scroll={false}
                          prefetch={false}
                          className={
                            client.status === "active"
                              ? "font-medium text-red-600 transition hover:text-red-700"
                              : "font-medium text-emerald-700 transition hover:text-emerald-800"
                          }
                        >
                          {client.status === "active"
                            ? "Desactivar"
                            : "Activar"}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {result.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="font-medium text-slate-700">
                      No se encontraron clientes.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Prueba modificando los filtros de búsqueda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =========================
            PAGINACIÓN
        ========================== */}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {result.total} {result.total === 1 ? "cliente" : "clientes"}
          </p>

          <div className="flex items-center gap-3">
            {result.page > 1 ? (
              <Link
                href={buildListHref(
                  {
                    q: params.q,
                    status,
                    type,
                  },
                  result.page - 1,
                )}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Anterior
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-300">
                Anterior
              </span>
            )}

            <span className="text-sm text-slate-600">
              Página {result.page} de {result.totalPages}
            </span>

            {result.page < result.totalPages ? (
              <Link
                href={buildListHref(
                  {
                    q: params.q,
                    status,
                    type,
                  },
                  result.page + 1,
                )}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Siguiente
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-300">
                Siguiente
              </span>
            )}
          </div>
        </div>
      </main>

      {/* =========================
          CREAR CLIENTE
      ========================== */}

      {mode === "create" && canCreate && (
        <Modal
          title="Nuevo cliente"
          description="Registra la información principal del cliente."
          closeHref={listHref}
          size="lg"
        >
          <ClientForm action={createClientAction} />
        </Modal>
      )}

      {/* =========================
          DETALLE
      ========================== */}

      {mode === "view" && detail && (
        <Modal
          title="Detalle del cliente"
          description={`${detail.client.documentType.toUpperCase()} ${detail.client.documentNumber}`}
          closeHref={listHref}
          size="lg"
        >
          <ClientDetail
            client={detail.client}
            contacts={detail.contacts}
            canEdit={canEdit}
            canChangeStatus={canChangeStatus}
          />
        </Modal>
      )}

      {/* =========================
          EDITAR
      ========================== */}

      {mode === "edit" && detail && canEdit && (
        <Modal
          title="Editar cliente"
          description={`${detail.client.documentType.toUpperCase()} ${detail.client.documentNumber}`}
          closeHref={listHref}
          size="lg"
        >
          <ClientForm client={detail.client} action={updateClientAction} />
        </Modal>
      )}

      {/* =========================
          CAMBIAR ESTADO
      ========================== */}

      {mode === "status" && detail && canChangeStatus && (
        <Modal
          title={
            detail.client.status === "active"
              ? "Desactivar cliente"
              : "Activar cliente"
          }
          description={detail.client.name}
          closeHref={listHref}
          size="sm"
        >
          <p className="text-sm leading-6 text-slate-600">
            {detail.client.status === "active"
              ? "El cliente quedará inactivo y no debería utilizarse en nuevas operaciones mientras permanezca en este estado."
              : "El cliente volverá a estar disponible para nuevas operaciones."}
          </p>

          <form
            action={changeClientStatusAction}
            className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"
          >
            <input type="hidden" name="id" value={detail.client.id} />

            <input
              type="hidden"
              name="status"
              value={detail.client.status === "active" ? "inactive" : "active"}
            />

            <Link
              href={listHref}
              scroll={false}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className={
                detail.client.status === "active"
                  ? "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                  : "rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              }
            >
              {detail.client.status === "active"
                ? "Sí, desactivar"
                : "Sí, activar"}
            </button>
          </form>
        </Modal>
      )}

      {/* =========================
          CLIENTE NO ENCONTRADO
      ========================== */}

      {modalNeedsClient && (!selectedId || !detail) && (
        <Modal
          title="Cliente no encontrado"
          description="No fue posible localizar el cliente solicitado."
          closeHref={listHref}
          size="sm"
        >
          <div className="flex justify-end">
            <Link
              href={listHref}
              scroll={false}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Cerrar
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
