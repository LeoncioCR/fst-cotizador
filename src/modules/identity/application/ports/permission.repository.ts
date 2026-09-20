import type { Permission } from "../../domain/permission";

export interface UserPermissionContext {
  isAdministrator: boolean;

  permissionNames: string[];
}

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;

  findByIds(ids: string[]): Promise<Permission[]>;

  getRolePermissions(roleId: string): Promise<Permission[]>;

  /*
   * Devuelve todo el contexto RBAC
   * del usuario en una sola consulta.
   */
  getUserPermissionContext(userId: string): Promise<UserPermissionContext>;

  userHasPermission(userId: string, permissionName: string): Promise<boolean>;

  replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy: string,
  ): Promise<void>;
}
