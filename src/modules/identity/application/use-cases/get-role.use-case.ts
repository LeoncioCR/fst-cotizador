import type { RoleRepository } from "../ports/role.repository";

export class GetRoleUseCase {
  constructor(private readonly roles: RoleRepository) {}

  execute(roleId: string) {
    return this.roles.findById(roleId);
  }
}
