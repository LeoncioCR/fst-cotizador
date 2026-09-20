import type { RoleRepository } from "../ports/role.repository";

export class ListRolesUseCase {
  constructor(private readonly roles: RoleRepository) {}

  execute() {
    return this.roles.findAll();
  }
}
