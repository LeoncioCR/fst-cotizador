import { redirect } from "next/navigation";

import { PERMISSIONS, requirePermission } from "@/modules/identity";

import { InviteUserForm } from "@/modules/identity/presentation/components/invite-user-form";

import { Modal } from "@/shared/ui/modal/modal";

export default async function NewUserModalPage() {
  try {
    await requirePermission(PERMISSIONS.USERS.CREATE);
  } catch {
    redirect("/dashboard");
  }

  return (
    <Modal
      title="Nuevo usuario"
      description="Registra los datos y envía una invitación de acceso."
      size="md"
    >
      <InviteUserForm />
    </Modal>
  );
}
