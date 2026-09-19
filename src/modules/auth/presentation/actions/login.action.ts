"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { makeSignInUseCase } from "../../infrastructure/auth-container";

import { loginSchema } from "../schemas/login.schema";

export interface LoginActionState {
  error?: string;

  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

export async function loginAction(
  _previousState: LoginActionState,

  formData: FormData,
): Promise<LoginActionState> {
  const validation = loginSchema.safeParse({
    email: formData.get("email"),

    password: formData.get("password"),
  });

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const useCase = makeSignInUseCase();

    const result = await useCase.execute(validation.data);

    if (!result.success) {
      switch (result.error.code) {
        case "ACCOUNT_INACTIVE":
          return {
            error: "Tu acceso al sistema está desactivado.",
          };

        case "PROFILE_NOT_FOUND":
          return {
            error: "La cuenta no está configurada correctamente.",
          };

        default:
          return {
            error: "Correo o contraseña incorrectos.",
          };
      }
    }
  } catch {
    return {
      error: "No fue posible iniciar sesión. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/", "layout");

  redirect("/dashboard");
}
