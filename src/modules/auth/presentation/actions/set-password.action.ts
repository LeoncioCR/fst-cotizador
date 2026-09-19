"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

import { setPasswordSchema } from "../schemas/set-password.schema";

export interface SetPasswordActionState {
  error?: string;

  fieldErrors?: {
    password?: string[];
    confirmPassword?: string[];
  };
}

export async function setPasswordAction(
  _previousState: SetPasswordActionState,
  formData: FormData,
): Promise<SetPasswordActionState> {
  const validation = setPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "La sesión no es válida o la invitación ha expirado.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
      return {
        error: "No fue posible guardar la contraseña. Inténtalo nuevamente.",
      };
    }
  } catch {
    return {
      error: "Ocurrió un error al guardar la contraseña.",
    };
  }

  revalidatePath("/", "layout");

  redirect("/dashboard");
}
