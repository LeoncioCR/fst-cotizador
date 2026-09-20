"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeDeleteRoleUseCase } from "../../infrastructure/identity-container";

import { roleIdSchema } from "../schemas/role.schema";

export async function deleteRoleAction(formData: FormData) {
  await requirePermission(PERMISSIONS.ROLES.DELETE);

  const id = roleIdSchema.parse(formData.get("id"));

  /*
   * DeleteRoleUseCase sigue
   * protegiendo:
   *
   * - administrador
   * - roles del sistema
   * - roles con usuarios
   */

  await makeDeleteRoleUseCase().execute(id);

  revalidatePath("/roles");

  redirect("/roles");
}
