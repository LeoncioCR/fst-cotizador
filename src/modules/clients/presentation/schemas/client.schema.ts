import { z } from "zod";

const nullableText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const clientFormSchema = z
  .object({
    type: z.enum(["natural", "juridica"]),

    documentType: z.enum(["dni", "ruc"]),

    documentNumber: z.string().trim(),

    name: z
      .string()
      .trim()
      .min(2, "Ingrese el nombre o razón social.")
      .max(180),

    commercialName: nullableText,

    address: nullableText,

    notes: nullableText,
  })

  .superRefine((value, context) => {
    const document = value.documentNumber.replace(/\D/g, "");

    if (value.documentType === "dni" && !/^\d{8}$/.test(document)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["documentNumber"],

        message: "El DNI debe contener 8 dígitos.",
      });
    }

    if (value.documentType === "ruc" && !/^\d{11}$/.test(document)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["documentNumber"],

        message: "El RUC debe contener 11 dígitos.",
      });
    }

    if (value.type === "juridica" && value.documentType !== "ruc") {
      context.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["documentType"],

        message: "Una persona jurídica debe utilizar RUC.",
      });
    }
  });

export const clientContactSchema = z.object({
  clientId: z.string().uuid(),

  fullName: z.string().trim().min(2).max(160),

  position: nullableText,

  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Correo inválido.",
    )
    .transform((value) => (value === "" ? null : value)),

  phone: nullableText,

  whatsapp: nullableText,

  isPrimary: z.boolean(),
});
