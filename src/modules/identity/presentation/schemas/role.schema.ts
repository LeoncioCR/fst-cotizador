import { z } from "zod";

export const roleFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Ingrese un nombre.")
    .max(120, "El nombre es demasiado largo."),

  description: z
    .string()
    .trim()
    .max(500, "La descripción es demasiado larga.")
    .optional(),
});

export const roleIdSchema = z.string().uuid();

export const assignRolesSchema = z.object({
  userId: z.string().uuid(),

  roleIds: z.array(z.string().uuid()),
});
