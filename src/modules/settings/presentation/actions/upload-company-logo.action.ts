"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeCompanyAssets, makeSettingsRepository } from "@/modules/settings";

import { ApplicationError } from "@/shared/errors/application-error";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export async function uploadCompanyLogoAction(formData: FormData) {
  /*
   * RN-CONF-003
   *
   * Solo usuarios con
   * configuracion.editar
   * pueden modificar el logo.
   */
  const currentUser = await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const file = formData.get("logo");

  /*
   * Validar existencia.
   */
  if (!(file instanceof File)) {
    throw new ApplicationError("Debe seleccionar un archivo.", "INVALID_LOGO");
  }

  /*
   * Archivo vacío.
   */
  if (file.size === 0) {
    throw new ApplicationError(
      "El archivo seleccionado está vacío.",
      "INVALID_LOGO",
    );
  }

  /*
   * Límite funcional:
   * máximo 2 MB.
   *
   * Next.js puede aceptar 3 MB
   * en la Server Action para dejar
   * margen al multipart/form-data.
   */
  if (file.size > MAX_LOGO_SIZE) {
    throw new ApplicationError(
      "El logo no puede superar los 2 MB.",
      "INVALID_LOGO_SIZE",
    );
  }

  /*
   * Tipos permitidos.
   */
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new ApplicationError(
      "El logo debe ser PNG, JPG, JPEG o WEBP.",
      "INVALID_LOGO_TYPE",
    );
  }

  /*
   * RN-CONF-007
   *
   * El archivo se guarda en
   * Supabase Storage.
   *
   * PostgreSQL NO almacena
   * el binario.
   */
  const assets = makeCompanyAssets();

  const logoPath = await assets.uploadLogo(file);

  /*
   * PostgreSQL únicamente guarda
   * la referencia:
   *
   * company/logo
   *
   * También registramos quién
   * realizó la modificación.
   */
  const repository = makeSettingsRepository();

  await repository.updateLogoPath(logoPath, currentUser.id);

  /*
   * Refrescar configuración.
   */
  revalidatePath("/configuracion");

  /*
   * Limpiar cualquier estado
   * POST y volver a GET.
   */
  redirect("/configuracion");
}
