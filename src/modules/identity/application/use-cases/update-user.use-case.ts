import type { UserAuthAdminPort } from "../ports/user-auth-admin.port";

import type { UserProfileRepository } from "../ports/user-profile.repository";

interface UpdateUserCommand {
  id: string;
  email: string;
  fullName: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly auth: UserAuthAdminPort,

    private readonly profiles: UserProfileRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    await this.auth.updateUser(command.id, {
      email: command.email,
    });

    await this.profiles.updateFullName(command.id, command.fullName);
  }
}
