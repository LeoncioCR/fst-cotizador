import type { AuthenticatedUser } from "../../domain/authenticated-user";

import type { Result } from "@/shared/types/result";

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthProviderPort {
  signIn(input: SignInInput): Promise<Result<AuthenticatedUser>>;

  signOut(): Promise<void>;

  getCurrentUser(): Promise<AuthenticatedUser | null>;
}
