import type { SystemUser } from "../../domain/user";

import type { UserAuthAdminPort } from "../ports/user-auth-admin.port";

import type { UserProfileRepository } from "../ports/user-profile.repository";

interface InviteUserCommand {
  email: string;
  fullName: string;
}

export class InviteUserUseCase {
  constructor(
    private readonly auth: UserAuthAdminPort,

    private readonly profiles: UserProfileRepository,
  ) {}

  async execute(command: InviteUserCommand): Promise<SystemUser> {
    const authUser = await this.auth.inviteUser(command);

    /*
     * Nuestro trigger auth.users
     * crea automáticamente profiles.
     *
     * Actualizamos el nombre como
     * medida explícita de consistencia.
     */

    await this.profiles.updateFullName(authUser.id, command.fullName);

    return {
      ...authUser,

      fullName: command.fullName,

      status: "active",
    };
  }
}
