"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requireBootstrapAdmin } from "../../application/guards/require-bootstrap-admin";

import { makeInviteUserUseCase } from "../../infrastructure/identity-container";

import { inviteUserSchema } from "../schemas/user.schema";

export interface InviteUserState {
  error?: string;

  fieldErrors?: {
    fullName?: string[];
    email?: string[];
  };
}

export async function inviteUserAction(
  _state: InviteUserState,
  formData: FormData,
): Promise<InviteUserState> {
  try {
    await requireBootstrapAdmin();
  } catch {
    return {
      error: "No tienes autorización para realizar esta acción.",
    };
  }

  const validation = inviteUserSchema.safeParse({
    fullName: formData.get("fullName"),

    email: formData.get("email"),
  });

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await makeInviteUserUseCase().execute(validation.data);
  } catch {
    return {
      error:
        "No fue posible crear el usuario. Verifique que el correo no esté registrado.",
    };
  }

  revalidatePath("/usuarios");

  redirect("/usuarios");
}
