import { ChangeUserStatusUseCase } from "../application/use-cases/change-user-status.use-case";

import { GetUserUseCase } from "../application/use-cases/get-user.use-case";

import { InviteUserUseCase } from "../application/use-cases/invite-user.use-case";

import { ListUsersUseCase } from "../application/use-cases/list-users.use-case";

import { UpdateUserUseCase } from "../application/use-cases/update-user.use-case";

import { DrizzleUserProfileRepository } from "./drizzle-user-profile.repository";

import { SupabaseUserAuthAdmin } from "./supabase-user-auth-admin";

import { AssignUserRolesUseCase } from "../application/use-cases/assign-user-roles.use-case";

import { CreateRoleUseCase } from "../application/use-cases/create-role.use-case";

import { DeleteRoleUseCase } from "../application/use-cases/delete-role.use-case";

import { GetUserRolesUseCase } from "../application/use-cases/get-user-roles.use-case";

import { ListRolesUseCase } from "../application/use-cases/list-roles.use-case";

import { UpdateRoleUseCase } from "../application/use-cases/update-role.use-case";

import { DrizzleRoleRepository } from "./drizzle-role.repository";

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

  return new ChangeUserStatusUseCase(profiles, new DrizzleRoleRepository());
}

export function makeRoleRepository() {
  return new DrizzleRoleRepository();
}

export function makeListRolesUseCase() {
  return new ListRolesUseCase(new DrizzleRoleRepository());
}

export function makeCreateRoleUseCase() {
  return new CreateRoleUseCase(new DrizzleRoleRepository());
}

export function makeUpdateRoleUseCase() {
  return new UpdateRoleUseCase(new DrizzleRoleRepository());
}

export function makeDeleteRoleUseCase() {
  return new DeleteRoleUseCase(new DrizzleRoleRepository());
}

export function makeGetUserRolesUseCase() {
  return new GetUserRolesUseCase(new DrizzleRoleRepository());
}

export function makeAssignUserRolesUseCase() {
  return new AssignUserRolesUseCase(
    new DrizzleRoleRepository(),

    new DrizzleUserProfileRepository(),
  );
}
