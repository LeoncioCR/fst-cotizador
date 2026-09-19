"use server";

import { revalidatePath } from "next/cache";

import { requireBootstrapAdmin } from "../../application/guards/require-bootstrap-admin";

import { makeChangeUserStatusUseCase } from "../../infrastructure/identity-container";

import { changeUserStatusSchema } from "../schemas/user.schema";

export async function changeUserStatusAction(formData: FormData) {
  await requireBootstrapAdmin();

  const validation = changeUserStatusSchema.parse({
    userId: formData.get("userId"),
    status: formData.get("status"),
  });

  await makeChangeUserStatusUseCase().execute(validation);

  revalidatePath("/usuarios");
  revalidatePath(`/usuarios/${validation.userId}`);
}
