import type { PermissionRepository } from "../ports/permission.repository";

export class GetRolePermissionsUseCase {
  constructor(private readonly permissions: PermissionRepository) {}

  execute(roleId: string) {
    return this.permissions.getRolePermissions(roleId);
  }
}
