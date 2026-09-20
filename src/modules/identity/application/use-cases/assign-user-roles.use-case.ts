import { ApplicationError } from "@/shared/errors/application-error";

import type { UserProfileRepository } from "../ports/user-profile.repository";
import type { RoleRepository } from "../ports/role.repository";

interface AssignUserRolesCommand {
  userId: string;
  roleIds: string[];
  assignedBy: string;
}

export class AssignUserRolesUseCase {
  constructor(
    private readonly roles: RoleRepository,
    private readonly profiles: UserProfileRepository,
  ) {}

  async execute(command: AssignUserRolesCommand): Promise<void> {
    const profile = await this.profiles.findById(command.userId);

    if (!profile) {
      throw new ApplicationError("Usuario no encontrado.", "USER_NOT_FOUND");
    }

    const uniqueRoleIds = [...new Set(command.roleIds)];

    const selectedRoles = await this.roles.findByIds(uniqueRoleIds);

    if (selectedRoles.length !== uniqueRoleIds.length) {
      throw new ApplicationError(
        "Uno o más roles no existen.",
        "INVALID_ROLE_SELECTION",
      );
    }

    const currentRoles = await this.roles.getUserRoles(command.userId);

    const currentlyAdmin = currentRoles.some(
      (role) => role.name === "administrador",
    );

    const remainsAdmin = selectedRoles.some(
      (role) => role.name === "administrador",
    );

    /*
     * RN-ROL-008
     *
     * Solo afecta al número de administradores
     * activos si el usuario al que se le retira
     * el rol está actualmente activo.
     */
    if (currentlyAdmin && !remainsAdmin && profile.status === "active") {
      const activeAdmins =
        await this.roles.countActiveUsersByRoleName("administrador");

      if (activeAdmins <= 1) {
        throw new ApplicationError(
          "El sistema debe conservar al menos un administrador activo.",
          "LAST_ADMINISTRATOR",
        );
      }
    }

    await this.roles.replaceUserRoles(
      command.userId,
      uniqueRoleIds,
      command.assignedBy,
    );
  }
}
