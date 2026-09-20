import { ApplicationError } from "@/shared/errors/application-error";

import type { UserStatus } from "../../domain/user";

import type { RoleRepository } from "../ports/role.repository";
import type { UserProfileRepository } from "../ports/user-profile.repository";

interface ChangeStatusCommand {
  userId: string;
  status: UserStatus;
}

export class ChangeUserStatusUseCase {
  constructor(
    private readonly profiles: UserProfileRepository,
    private readonly roles: RoleRepository,
  ) {}

  async execute(command: ChangeStatusCommand): Promise<void> {
    const profile = await this.profiles.findById(command.userId);

    if (!profile) {
      throw new ApplicationError("Usuario no encontrado.", "USER_NOT_FOUND");
    }

    /*
     * RN-ROL-008
     *
     * Solo debemos proteger la operación cuando:
     *
     * - el usuario actualmente está activo;
     * - se intenta desactivarlo;
     * - posee el rol administrador.
     */
    if (profile.status === "active" && command.status === "inactive") {
      const isAdministrator = await this.roles.userHasRole(
        command.userId,
        "administrador",
      );

      if (isAdministrator) {
        const activeAdmins =
          await this.roles.countActiveUsersByRoleName("administrador");

        if (activeAdmins <= 1) {
          throw new ApplicationError(
            "No puede desactivar al último administrador activo.",
            "LAST_ADMINISTRATOR",
          );
        }
      }
    }

    /*
     * Si el estado ya es el solicitado,
     * no necesitamos ejecutar UPDATE.
     */
    if (profile.status === command.status) {
      return;
    }

    await this.profiles.updateStatus(command.userId, command.status);
  }
}
