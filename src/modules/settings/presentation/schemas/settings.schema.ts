import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const companySettingsSchema = z.object({
  legalName: optionalText,

  tradeName: z.string().trim().min(2, "Ingrese el nombre comercial.").max(160),

  ruc: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{11}$/.test(value),
      "El RUC debe contener 11 dígitos.",
    )
    .transform((value) => (value === "" ? null : value)),

  address: optionalText,

  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Ingrese un correo válido.",
    )
    .transform((value) => (value === "" ? null : value)),

  website: optionalText,

  quotationFooter: optionalText,
});

export const quotationSettingsSchema = z.object({
  currencyCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "La moneda debe tener 3 letras."),

  igvRate: z.coerce.number().min(0).max(100),

  pricesIncludeIgv: z.boolean(),

  defaultCashDiscount: z.coerce.number().min(0).max(100),

  defaultInstallmentDiscount: z.coerce.number().min(0).max(100),

  defaultCardMonths: z.coerce.number().int().min(1).max(60),

  quotationPrefix: z.string().trim().toUpperCase().min(1).max(20),

  numberingPadding: z.coerce.number().int().min(3).max(10),

  resetNumberingYearly: z.boolean(),

  defaultValidityDays: z.union([
    z.coerce.number().int().min(1).max(365),

    z.null(),
  ]),
});

export const companyContactSchema = z.object({
  area: z.string().trim().min(2).max(120),

  type: z.enum(["phone", "whatsapp", "email", "other"]),

  value: z.string().trim().min(2).max(200),

  sortOrder: z.coerce.number().int().min(0),
});
