"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { requireBootstrapAdmin } from "../../application/guards/require-bootstrap-admin";

import { makeUpdateUserUseCase } from "../../infrastructure/identity-container";

import { updateUserSchema } from "../schemas/user.schema";

export async function updateUserAction(formData: FormData) {
  await requireBootstrapAdmin();

  const validation = updateUserSchema.parse({
    id: formData.get("id"),

    fullName: formData.get("fullName"),

    email: formData.get("email"),
  });

  await makeUpdateUserUseCase().execute(validation);

  revalidatePath("/usuarios");

  redirect(`/usuarios/${validation.id}`);
}
