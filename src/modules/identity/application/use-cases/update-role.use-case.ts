import { ApplicationError } from "@/shared/errors/application-error";

import { normalizeRoleName } from "../../domain/normalize-role-name";

import type { RoleRepository } from "../ports/role.repository";

interface UpdateRoleCommand {
  id: string;

  displayName: string;

  description?: string | null;
}

export class UpdateRoleUseCase {
  constructor(private readonly roles: RoleRepository) {}

  async execute(command: UpdateRoleCommand) {
    const role = await this.roles.findById(command.id);

    if (!role) {
      throw new ApplicationError("Rol no encontrado.", "ROLE_NOT_FOUND");
    }

    if (role.name === "administrador" || role.isSystem) {
      throw new ApplicationError(
        "El rol administrador está protegido.",
        "SYSTEM_ROLE_PROTECTED",
      );
    }

    const name = normalizeRoleName(command.displayName);

    const existing = await this.roles.findByName(name);

    if (existing && existing.id !== role.id) {
      throw new ApplicationError(
        "Ya existe un rol con ese nombre.",
        "ROLE_ALREADY_EXISTS",
      );
    }

    return this.roles.update(role.id, {
      name,

      displayName: command.displayName.trim(),

      description: command.description?.trim() || null,
    });
  }
}
