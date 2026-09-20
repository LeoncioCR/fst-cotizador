import { ApplicationError } from "@/shared/errors/application-error";

import type { PermissionRepository } from "../ports/permission.repository";

import type { RoleRepository } from "../ports/role.repository";

interface AssignRolePermissionsCommand {
  roleId: string;

  permissionIds: string[];

  assignedBy: string;
}

export class AssignRolePermissionsUseCase {
  constructor(
    private readonly roles: RoleRepository,

    private readonly permissions: PermissionRepository,
  ) {}

  async execute(command: AssignRolePermissionsCommand): Promise<void> {
    const role = await this.roles.findById(command.roleId);

    if (!role) {
      throw new ApplicationError("Rol no encontrado.", "ROLE_NOT_FOUND");
    }

    /*
     * Regla de negocio.
     *
     * Aunque el ejecutor tenga
     * roles.asignar_permisos,
     * administrador continúa protegido.
     */
    if (role.name === "administrador" || role.isSystem) {
      throw new ApplicationError(
        "Los permisos del rol administrador no pueden modificarse.",
        "SYSTEM_ROLE_PERMISSIONS_PROTECTED",
      );
    }

    const uniquePermissionIds = [...new Set(command.permissionIds)];

    const selectedPermissions =
      await this.permissions.findByIds(uniquePermissionIds);

    if (selectedPermissions.length !== uniquePermissionIds.length) {
      throw new ApplicationError(
        "Uno o más permisos seleccionados no existen.",
        "INVALID_PERMISSION_SELECTION",
      );
    }

    await this.permissions.replaceRolePermissions(
      role.id,
      uniquePermissionIds,
      command.assignedBy,
    );
  }
}
