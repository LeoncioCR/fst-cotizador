"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeAssignUserRolesUseCase } from "../../infrastructure/identity-container";

import { assignRolesSchema } from "../schemas/role.schema";

export async function assignUserRolesAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.USERS.ASSIGN_ROLES);

  const validation = assignRolesSchema.parse({
    userId: formData.get("userId"),

    roleIds: formData.getAll("roleIds").map(String),
  });

  await makeAssignUserRolesUseCase().execute({
    ...validation,

    assignedBy: currentUser.id,
  });

  revalidatePath("/usuarios");

  revalidatePath(`/usuarios/${validation.userId}`);

  revalidatePath(`/usuarios/${validation.userId}/roles`);

  redirect(`/usuarios/${validation.userId}`);
}
