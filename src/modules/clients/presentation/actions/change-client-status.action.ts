"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeChangeClientStatusUseCase } from "../../infrastructure/clients-container";

export async function changeClientStatusAction(formData: FormData) {
  const currentUser = await requirePermission(
    PERMISSIONS.CLIENTS.CHANGE_STATUS,
  );

  const data = z
    .object({
      id: z.string().uuid(),

      status: z.enum(["active", "inactive"]),
    })
    .parse({
      id: formData.get("id"),

      status: formData.get("status"),
    });

  await makeChangeClientStatusUseCase().execute({
    ...data,

    updatedBy: currentUser.id,
  });

  revalidatePath("/clientes");

  redirect("/clientes");
}
