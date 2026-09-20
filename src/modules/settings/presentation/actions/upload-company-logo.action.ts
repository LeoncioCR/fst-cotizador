"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeSettingsRepository } from "../../infrastructure/settings-container";

import { SupabaseCompanyAssets } from "../../infrastructure/supabase-company-assets";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const MAX_SIZE = 2 * 1024 * 1024;

export async function uploadCompanyLogoAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Seleccione un archivo.");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de logo no permitido.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("El logo no puede superar los 2 MB.");
  }

  const assets = new SupabaseCompanyAssets();

  const path = await assets.uploadLogo(file);

  await makeSettingsRepository().updateLogoPath(path, currentUser.id);

  revalidatePath("/configuracion");
}
