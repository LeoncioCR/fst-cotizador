import type { Role, RoleSummary } from "../../domain/role";

export interface CreateRoleData {
  name: string;

  displayName: string;

  description?: string | null;

  isSystem?: boolean;
}

export interface UpdateRoleData {
  name: string;

  displayName: string;

  description?: string | null;
}

export interface RoleRepository {
  findAll(): Promise<RoleSummary[]>;

  findById(id: string): Promise<Role | null>;

  findByName(name: string): Promise<Role | null>;

  findByIds(ids: string[]): Promise<Role[]>;

  create(data: CreateRoleData): Promise<Role>;

  update(id: string, data: UpdateRoleData): Promise<Role>;

  delete(id: string): Promise<void>;

  countUsers(roleId: string): Promise<number>;

  getUserRoles(userId: string): Promise<Role[]>;

  userHasRole(userId: string, roleName: string): Promise<boolean>;

  countActiveUsersByRoleName(roleName: string): Promise<number>;

  replaceUserRoles(
    userId: string,
    roleIds: string[],
    assignedBy: string,
  ): Promise<void>;
}
