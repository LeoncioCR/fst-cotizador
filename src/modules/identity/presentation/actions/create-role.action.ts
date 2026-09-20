"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeCreateRoleUseCase } from "../../infrastructure/identity-container";

import { roleFormSchema } from "../schemas/role.schema";

export async function createRoleAction(formData: FormData) {
  await requirePermission(PERMISSIONS.ROLES.CREATE);

  const validation = roleFormSchema.safeParse({
    displayName: formData.get("displayName"),

    description: formData.get("description"),
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? "Datos inválidos.");
  }

  await makeCreateRoleUseCase().execute(validation.data);

  revalidatePath("/roles");

  redirect("/roles");
}
