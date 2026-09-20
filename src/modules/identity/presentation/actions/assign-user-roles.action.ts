"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "../../application/guards/require-role";

import { makeAssignUserRolesUseCase } from "../../infrastructure/identity-container";

import { assignRolesSchema } from "../schemas/role.schema";

export async function assignUserRolesAction(formData: FormData) {
  const currentUser = await requireRole("administrador");

  const validation = assignRolesSchema.parse({
    userId: formData.get("userId"),

    roleIds: formData.getAll("roleIds").map(String),
  });

  await makeAssignUserRolesUseCase().execute({
    ...validation,

    assignedBy: currentUser.id,
  });

  revalidatePath(`/usuarios/${validation.userId}`);

  revalidatePath(`/usuarios/${validation.userId}/roles`);
}
