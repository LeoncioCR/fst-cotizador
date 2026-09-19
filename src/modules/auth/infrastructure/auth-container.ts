import { GetCurrentUserUseCase } from "../application/use-cases/get-current-user.use-case";

import { SignInUseCase } from "../application/use-cases/sign-in.use-case";

import { DrizzleAccountAccessReader } from "./drizzle-account-access.reader";

import { SupabaseAuthProvider } from "./supabase-auth.provider";

export function makeSignInUseCase() {
  return new SignInUseCase(
    new SupabaseAuthProvider(),

    new DrizzleAccountAccessReader(),
  );
}

export function makeGetCurrentUserUseCase() {
  return new GetCurrentUserUseCase(
    new SupabaseAuthProvider(),

    new DrizzleAccountAccessReader(),
  );
}

export function makeAuthProvider() {
  return new SupabaseAuthProvider();
}
