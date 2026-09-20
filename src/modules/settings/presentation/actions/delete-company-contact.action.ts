"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeDeleteCompanyContactUseCase } from "../../infrastructure/settings-container";

export async function deleteCompanyContactAction(formData: FormData) {
  await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const id = z.string().uuid().parse(formData.get("id"));

  await makeDeleteCompanyContactUseCase().execute(id);

  revalidatePath("/configuracion");
}
