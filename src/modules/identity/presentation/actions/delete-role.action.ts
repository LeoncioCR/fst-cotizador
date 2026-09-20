"use server";

import { revalidatePath } from "next/cache";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeDeleteRoleUseCase } from "../../infrastructure/identity-container";

import { roleIdSchema } from "../schemas/role.schema";

export async function deleteRoleAction(formData: FormData) {
  /*
   * Autorización:
   * ¿el usuario puede intentar eliminar roles?
   */
  await requirePermission(PERMISSIONS.ROLES.DELETE);

  const id = roleIdSchema.parse(formData.get("id"));

  /*
   * Regla de negocio:
   *
   * El UseCase seguirá comprobando:
   * - administrador no eliminable
   * - roles de sistema no eliminables
   * - roles con usuarios no eliminables
   */
  await makeDeleteRoleUseCase().execute(id);

  revalidatePath("/roles");
}
