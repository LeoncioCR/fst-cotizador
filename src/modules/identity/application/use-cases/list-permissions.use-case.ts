import type { PermissionRepository } from "../ports/permission.repository";

export class ListPermissionsUseCase {
  constructor(private readonly permissions: PermissionRepository) {}

  execute() {
    return this.permissions.findAll();
  }
}
