"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "../../application/guards/require-role";
import { makeChangeUserStatusUseCase } from "../../infrastructure/identity-container";
import { changeUserStatusSchema } from "../schemas/user.schema";

export async function changeUserStatusAction(formData: FormData) {
  await requireRole("administrador");

  const validation = changeUserStatusSchema.parse({
    userId: formData.get("userId"),
    status: formData.get("status"),
  });

  await makeChangeUserStatusUseCase().execute(validation);

  revalidatePath("/usuarios");
  revalidatePath(`/usuarios/${validation.userId}`);
}
