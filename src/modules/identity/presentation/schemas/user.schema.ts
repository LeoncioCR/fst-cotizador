import { z } from "zod";

export const inviteUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Ingrese el nombre completo.")
    .max(160, "El nombre es demasiado largo."),

  email: z.string().trim().email("Ingrese un correo válido."),
});

export const updateUserSchema = inviteUserSchema.extend({
  id: z.string().uuid(),
});

export const changeUserStatusSchema = z.object({
  userId: z.string().uuid(),

  status: z.enum(["active", "inactive"]),
});
