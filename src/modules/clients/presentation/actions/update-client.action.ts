"use server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { z } from "zod";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { makeUpdateClientUseCase } from "../../infrastructure/clients-container";

import { clientFormSchema } from "../schemas/client.schema";

export async function updateClientAction(formData: FormData) {
  const currentUser = await requirePermission(PERMISSIONS.CLIENTS.EDIT);

  const id = z.string().uuid().parse(formData.get("id"));

  const data = clientFormSchema.parse({
    type: formData.get("type"),

    documentType: formData.get("documentType"),

    documentNumber: formData.get("documentNumber"),

    name: formData.get("name"),

    commercialName: formData.get("commercialName") ?? "",

    address: formData.get("address") ?? "",

    notes: formData.get("notes") ?? "",
  });

  await makeUpdateClientUseCase().execute({
    id,

    ...data,

    updatedBy: currentUser.id,
  });

  revalidatePath("/clientes");

  redirect(`/clientes?mode=view&id=${id}`);
}
