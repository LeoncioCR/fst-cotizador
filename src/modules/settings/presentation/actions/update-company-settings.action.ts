"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeUpdateCompanySettingsUseCase } from "../../infrastructure/settings-container";

import { companySettingsSchema } from "../schemas/settings.schema";

export async function updateCompanySettingsAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const data = companySettingsSchema.parse({
    legalName: formData.get("legalName") ?? "",

    tradeName: formData.get("tradeName"),

    ruc: formData.get("ruc") ?? "",

    address: formData.get("address") ?? "",

    email: formData.get("email") ?? "",

    website: formData.get("website") ?? "",

    quotationFooter: formData.get("quotationFooter") ?? "",
  });

  await makeUpdateCompanySettingsUseCase().execute({
    ...data,

    updatedBy: currentUser.id,
  });

  revalidatePath("/configuracion");
}
