"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeAssignRolePermissionsUseCase } from "../../infrastructure/identity-container";

import { assignRolePermissionsSchema } from "../schemas/permission.schema";

export async function assignRolePermissionsAction(formData: FormData) {
  const currentUser = await requirePermission(
    PERMISSIONS.ROLES.ASSIGN_PERMISSIONS,
  );

  const validation = assignRolePermissionsSchema.parse({
    roleId: formData.get("roleId"),

    permissionIds: formData.getAll("permissionIds").map(String),
  });

  await makeAssignRolePermissionsUseCase().execute({
    ...validation,

    assignedBy: currentUser.id,
  });

  revalidatePath("/roles");

  revalidatePath(`/roles/${validation.roleId}/permisos`);

  redirect("/roles");
}
