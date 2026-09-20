"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

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
  /*
   * RBAC
   */
  try {
    await requirePermission(PERMISSIONS.USERS.CREATE);
  } catch {
    return {
      error: "No tienes autorización para crear usuarios.",
    };
  }

  /*
   * Validación
   */
  const validation = inviteUserSchema.safeParse({
    fullName: formData.get("fullName"),

    email: formData.get("email"),
  });

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  /*
   * Invitación
   */
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
