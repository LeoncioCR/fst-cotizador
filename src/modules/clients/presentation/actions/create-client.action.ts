"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeCreateClientUseCase } from "../../infrastructure/clients-container";

import { clientFormSchema } from "../schemas/client.schema";

export async function createClientAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.CLIENTS.CREATE);

  const data = clientFormSchema.parse({
    type: formData.get("type"),

    documentType: formData.get("documentType"),

    documentNumber: formData.get("documentNumber"),

    name: formData.get("name"),

    commercialName: formData.get("commercialName") ?? "",

    address: formData.get("address") ?? "",

    notes: formData.get("notes") ?? "",
  });

  await makeCreateClientUseCase().execute({
    ...data,

    createdBy: currentUser.id,
  });

  revalidatePath("/clientes");

  redirect("/clientes");
}
