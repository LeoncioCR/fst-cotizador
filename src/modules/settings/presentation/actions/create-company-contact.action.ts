"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeCreateCompanyContactUseCase } from "../../infrastructure/settings-container";

import { companyContactSchema } from "../schemas/settings.schema";

export async function createCompanyContactAction(formData: FormData) {
  await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const data = companyContactSchema.parse({
    area: formData.get("area"),

    type: formData.get("type"),

    value: formData.get("value"),

    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await makeCreateCompanyContactUseCase().execute(data);

  revalidatePath("/configuracion");
}
