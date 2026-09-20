import type { RoleRepository } from "../ports/role.repository";

export class GetUserRolesUseCase {
  constructor(private readonly roles: RoleRepository) {}

  execute(userId: string) {
    return this.roles.getUserRoles(userId);
  }
}
