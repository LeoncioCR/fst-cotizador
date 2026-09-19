import { ChangeUserStatusUseCase } from "../application/use-cases/change-user-status.use-case";

import { GetUserUseCase } from "../application/use-cases/get-user.use-case";

import { InviteUserUseCase } from "../application/use-cases/invite-user.use-case";

import { ListUsersUseCase } from "../application/use-cases/list-users.use-case";

import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";

import { DrizzleUserProfileRepository } from "./drizzle-user-profile.repository";

import { SupabaseUserAuthAdmin } from "./supabase-user-auth-admin";

function dependencies() {
  return {
    auth: new SupabaseUserAuthAdmin(),

    profiles: new DrizzleUserProfileRepository(),
  };
}

export function makeListUsersUseCase() {
  const { auth, profiles } = dependencies();

  return new ListUsersUseCase(auth, profiles);
}

export function makeGetUserUseCase() {
  const { auth, profiles } = dependencies();

  return new GetUserUseCase(auth, profiles);
}

export function makeInviteUserUseCase() {
  const { auth, profiles } = dependencies();

  return new InviteUserUseCase(auth, profiles);
}

export function makeUpdateUserUseCase() {
  const { auth, profiles } = dependencies();

  return new UpdateUserUseCase(auth, profiles);
}

export function makeChangeUserStatusUseCase() {
  const { profiles } = dependencies();

  return new ChangeUserStatusUseCase(profiles);
}
