import type { SystemUser } from "../../domain/user";

import type { UserAuthAdminPort } from "../ports/user-auth-admin.port";

import type { UserProfileRepository } from "../ports/user-profile.repository";

export class GetUserUseCase {
  constructor(
    private readonly auth: UserAuthAdminPort,

    private readonly profiles: UserProfileRepository,
  ) {}

  async execute(id: string): Promise<SystemUser | null> {
    const [authUser, profile] = await Promise.all([
      this.auth.getUserById(id),

      this.profiles.findById(id),
    ]);

    if (!authUser || !profile) {
      return null;
    }

    return {
      ...authUser,

      fullName: profile.fullName,

      status: profile.status,
    };
  }
}
