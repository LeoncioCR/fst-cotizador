import type { UserStatus } from "../../domain/user";

import type { UserProfileRepository } from "../ports/user-profile.repository";

interface ChangeStatusCommand {
  userId: string;
  status: UserStatus;
}

export class ChangeUserStatusUseCase {
  constructor(private readonly profiles: UserProfileRepository) {}

  async execute(command: ChangeStatusCommand): Promise<void> {
    await this.profiles.updateStatus(command.userId, command.status);
  }
}
