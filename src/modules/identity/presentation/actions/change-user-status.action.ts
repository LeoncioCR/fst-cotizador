"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requirePermission } from "../../application/guards/require-permission";

import { PERMISSIONS } from "../../domain/permissions";

import { makeChangeUserStatusUseCase } from "../../infrastructure/identity-container";

import { changeUserStatusSchema } from "../schemas/user.schema";

export async function changeUserStatusAction(formData: FormData) {
  await requirePermission(PERMISSIONS.USERS.CHANGE_STATUS);

  const validation = changeUserStatusSchema.parse({
    userId: formData.get("userId"),

    status: formData.get("status"),
  });

  await makeChangeUserStatusUseCase().execute(validation);

  revalidatePath("/usuarios");

  redirect("/usuarios");
}
