import { ApplicationError } from "@/shared/errors/application-error";

import { normalizeRoleName } from "../../domain/normalize-role-name";

import type { RoleRepository } from "../ports/role.repository";

interface CreateRoleCommand {
  displayName: string;
  description?: string | null;
}

export class CreateRoleUseCase {
  constructor(private readonly roles: RoleRepository) {}

  async execute(command: CreateRoleCommand) {
    const name = normalizeRoleName(command.displayName);

    if (!name) {
      throw new ApplicationError(
        "El nombre del rol no es válido.",
        "INVALID_ROLE_NAME",
      );
    }

    const existing = await this.roles.findByName(name);

    if (existing) {
      throw new ApplicationError(
        "Ya existe un rol con ese nombre.",
        "ROLE_ALREADY_EXISTS",
      );
    }

    return this.roles.create({
      name,

      displayName: command.displayName.trim(),

      description: command.description?.trim() || null,
    });
  }
}
