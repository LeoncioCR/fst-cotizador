"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "../../application/guards/require-role";

import { makeDeleteRoleUseCase } from "../../infrastructure/identity-container";

import { roleIdSchema } from "../schemas/role.schema";

export async function deleteRoleAction(formData: FormData) {
  await requireRole("administrador");

  const id = roleIdSchema.parse(formData.get("id"));

  await makeDeleteRoleUseCase().execute(id);

  revalidatePath("/roles");
}
