"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeCreateClientContactUseCase } from "../../infrastructure/clients-container";

import { clientContactSchema } from "../schemas/client.schema";

export async function createClientContactAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.CLIENTS.EDIT);

  const data = clientContactSchema.parse({
    clientId: formData.get("clientId"),

    fullName: formData.get("fullName"),

    position: formData.get("position") ?? "",

    email: formData.get("email") ?? "",

    phone: formData.get("phone") ?? "",

    whatsapp: formData.get("whatsapp") ?? "",

    isPrimary: formData.has("isPrimary"),
  });

  await makeCreateClientContactUseCase().execute({
    ...data,

    createdBy: currentUser.id,
  });

  revalidatePath("/clientes");

  redirect(`/clientes?mode=view&id=${data.clientId}`);
}
