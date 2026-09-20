import { ApplicationError } from "@/shared/errors/application-error";

import type { RoleRepository } from "../ports/role.repository";

export class DeleteRoleUseCase {
  constructor(private readonly roles: RoleRepository) {}

  async execute(roleId: string): Promise<void> {
    const role = await this.roles.findById(roleId);

    if (!role) {
      throw new ApplicationError("Rol no encontrado.", "ROLE_NOT_FOUND");
    }

    if (role.name === "administrador" || role.isSystem) {
      throw new ApplicationError(
        "El rol administrador está protegido.",
        "SYSTEM_ROLE_PROTECTED",
      );
    }

    const userCount = await this.roles.countUsers(role.id);

    if (userCount > 0) {
      throw new ApplicationError(
        "No se puede eliminar un rol que tiene usuarios asignados.",
        "ROLE_HAS_USERS",
      );
    }

    await this.roles.delete(role.id);
  }
}
