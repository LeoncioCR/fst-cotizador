import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingrese su correo.")
    .email("Ingrese un correo válido."),

  password: z.string().min(1, "Ingrese su contraseña."),
});
