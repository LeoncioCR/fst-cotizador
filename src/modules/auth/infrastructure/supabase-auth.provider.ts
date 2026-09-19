import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

import type { Result } from "@/shared/types/result";

import type { AuthenticatedUser } from "../domain/authenticated-user";

import type {
  AuthProviderPort,
  SignInInput,
} from "../application/ports/auth-provider.port";

export class SupabaseAuthProvider implements AuthProviderPort {
  async signIn(input: SignInInput): Promise<Result<AuthenticatedUser>> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      return {
        success: false,

        error: {
          code: "INVALID_CREDENTIALS",

          message: "Correo o contraseña incorrectos.",
        },
      };
    }

    return {
      success: true,

      data: {
        id: data.user.id,

        email: data.user.email ?? null,
      },
    };
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseServerClient();

    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub) {
      return null;
    }

    const email =
      typeof data.claims.email === "string" ? data.claims.email : null;

    return {
      id: data.claims.sub,
      email,
    };
  }
}
