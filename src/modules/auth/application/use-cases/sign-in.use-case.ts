import type { Result } from "@/shared/types/result";

import type { AuthenticatedUser } from "../../domain/authenticated-user";

import type { AccountAccessPort } from "../ports/account-access.port";

import type { AuthProviderPort } from "../ports/auth-provider.port";

interface SignInCommand {
  email: string;
  password: string;
}

export class SignInUseCase {
  constructor(
    private readonly auth: AuthProviderPort,

    private readonly accountAccess: AccountAccessPort,
  ) {}

  async execute(command: SignInCommand): Promise<Result<AuthenticatedUser>> {
    const authentication = await this.auth.signIn({
      email: command.email,
      password: command.password,
    });

    if (!authentication.success) {
      return authentication;
    }

    const user = authentication.data;

    const status = await this.accountAccess.getStatus(user.id);

    if (status === null) {
      await this.auth.signOut();

      return {
        success: false,

        error: {
          code: "PROFILE_NOT_FOUND",

          message: "El usuario no tiene un perfil configurado.",
        },
      };
    }

    if (status !== "active") {
      await this.auth.signOut();

      return {
        success: false,

        error: {
          code: "ACCOUNT_INACTIVE",

          message: "El usuario está inactivo.",
        },
      };
    }

    return {
      success: true,
      data: user,
    };
  }
}
