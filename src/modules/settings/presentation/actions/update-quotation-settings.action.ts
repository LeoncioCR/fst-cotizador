"use server";

import { revalidatePath } from "next/cache";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeUpdateQuotationSettingsUseCase } from "../../infrastructure/settings-container";

import { quotationSettingsSchema } from "../schemas/settings.schema";

export async function updateQuotationSettingsAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.SETTINGS.EDIT);

  const validityRaw = String(formData.get("defaultValidityDays") ?? "").trim();

  const data = quotationSettingsSchema.parse({
    currencyCode: formData.get("currencyCode"),

    igvRate: formData.get("igvRate"),

    pricesIncludeIgv: formData.has("pricesIncludeIgv"),

    defaultCashDiscount: formData.get("defaultCashDiscount"),

    defaultInstallmentDiscount: formData.get("defaultInstallmentDiscount"),

    defaultCardMonths: formData.get("defaultCardMonths"),

    quotationPrefix: formData.get("quotationPrefix"),

    numberingPadding: formData.get("numberingPadding"),

    resetNumberingYearly: formData.has("resetNumberingYearly"),

    defaultValidityDays: validityRaw === "" ? null : validityRaw,
  });

  await makeUpdateQuotationSettingsUseCase().execute({
    currencyCode: data.currencyCode,

    igvRate: data.igvRate.toFixed(2),

    pricesIncludeIgv: data.pricesIncludeIgv,

    defaultCashDiscount: data.defaultCashDiscount.toFixed(2),

    defaultInstallmentDiscount: data.defaultInstallmentDiscount.toFixed(2),

    defaultCardMonths: data.defaultCardMonths,

    quotationPrefix: data.quotationPrefix,

    numberingPadding: data.numberingPadding,

    resetNumberingYearly: data.resetNumberingYearly,

    defaultValidityDays: data.defaultValidityDays,

    updatedBy: currentUser.id,
  });

  revalidatePath("/configuracion");
}
