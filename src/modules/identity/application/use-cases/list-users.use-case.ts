import type { SystemUser } from "../../domain/user";

import type { UserAuthAdminPort } from "../ports/user-auth-admin.port";

import type { UserProfileRepository } from "../ports/user-profile.repository";

export class ListUsersUseCase {
  constructor(
    private readonly auth: UserAuthAdminPort,

    private readonly profiles: UserProfileRepository,
  ) {}

  async execute(): Promise<SystemUser[]> {
    const [authUsers, profiles] = await Promise.all([
      this.auth.listUsers(),
      this.profiles.findAll(),
    ]);

    const profileMap = new Map(
      profiles.map((profile) => [profile.id, profile]),
    );

    return authUsers
      .map((authUser): SystemUser => {
        const profile = profileMap.get(authUser.id);

        return {
          ...authUser,

          fullName: profile?.fullName ?? null,

          status: profile?.status ?? "inactive",
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
