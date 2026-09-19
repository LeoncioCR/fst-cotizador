import { createSupabaseAdminClient } from "@/infrastructure/supabase/admin-client";

import type {
  AuthUser,
  InviteUserInput,
  UpdateAuthUserInput,
  UserAuthAdminPort,
} from "../application/ports/user-auth-admin.port";

export class SupabaseUserAuthAdmin implements UserAuthAdminPort {
  async listUsers(): Promise<AuthUser[]> {
    const supabase = createSupabaseAdminClient();

    const users: AuthUser[] = [];

    const perPage = 1000;

    let page = 1;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        throw new Error("Unable to list Supabase users");
      }

      users.push(
        ...data.users.map(
          (user): AuthUser => ({
            id: user.id,

            email: user.email ?? "",

            emailConfirmed: Boolean(user.email_confirmed_at),

            createdAt: user.created_at,

            lastSignInAt: user.last_sign_in_at ?? null,
          }),
        ),
      );

      if (data.users.length < perPage) {
        break;
      }

      page++;
    }

    return users;
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.getUserById(id);

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,

      email: data.user.email ?? "",

      emailConfirmed: Boolean(data.user.email_confirmed_at),

      createdAt: data.user.created_at,

      lastSignInAt: data.user.last_sign_in_at ?? null,
    };
  }

  async inviteUser(input: InviteUserInput): Promise<AuthUser> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(
      input.email,
      {
        data: {
          full_name: input.fullName,
        },
      },
    );

    if (error || !data.user) {
      throw new Error(error?.message ?? "Unable to invite user");
    }

    return {
      id: data.user.id,

      email: data.user.email ?? input.email,

      emailConfirmed: false,

      createdAt: data.user.created_at,

      lastSignInAt: null,
    };
  }

  async updateUser(id: string, input: UpdateAuthUserInput): Promise<AuthUser> {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      email: input.email,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Unable to update user");
    }

    return {
      id: data.user.id,

      email: data.user.email ?? "",

      emailConfirmed: Boolean(data.user.email_confirmed_at),

      createdAt: data.user.created_at,

      lastSignInAt: data.user.last_sign_in_at ?? null,
    };
  }
}
