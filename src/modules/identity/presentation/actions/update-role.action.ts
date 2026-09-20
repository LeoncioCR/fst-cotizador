"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requireRole } from "../../application/guards/require-role";

import { makeUpdateRoleUseCase } from "../../infrastructure/identity-container";

import { roleFormSchema, roleIdSchema } from "../schemas/role.schema";

export async function updateRoleAction(formData: FormData) {
  await requireRole("administrador");

  const id = roleIdSchema.parse(formData.get("id"));

  const data = roleFormSchema.parse({
    displayName: formData.get("displayName"),

    description: formData.get("description"),
  });

  await makeUpdateRoleUseCase().execute({
    id,
    ...data,
  });

  revalidatePath("/roles");

  redirect("/roles");
}
