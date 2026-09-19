import type { Result } from "@/shared/types/result";

import type { AuthenticatedUser } from "../../domain/authenticated-user";

import type { AccountAccessPort } from "../ports/account-access.port";

import type { AuthProviderPort } from "../ports/auth-provider.port";

export class GetCurrentUserUseCase {
  constructor(
    private readonly auth: AuthProviderPort,

    private readonly accountAccess: AccountAccessPort,
  ) {}

  async execute(): Promise<Result<AuthenticatedUser>> {
    const user = await this.auth.getCurrentUser();

    if (!user) {
      return {
        success: false,

        error: {
          code: "AUTH_REQUIRED",
          message: "Authentication required.",
        },
      };
    }

    const status = await this.accountAccess.getStatus(user.id);

    if (status === null) {
      return {
        success: false,

        error: {
          code: "PROFILE_NOT_FOUND",

          message: "User profile not found.",
        },
      };
    }

    if (status !== "active") {
      return {
        success: false,

        error: {
          code: "ACCOUNT_INACTIVE",
          message: "Account is inactive.",
        },
      };
    }

    return {
      success: true,
      data: user,
    };
  }
}
