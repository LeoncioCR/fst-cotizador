import { cache } from "react";

import { getCurrentUserCached } from "@/modules/auth";

import { ApplicationError } from "@/shared/errors/application-error";

import { makeRoleRepository } from "../../infrastructure/identity-container";

export const requireRole = cache(async (roleName: string) => {
  const authResult = await getCurrentUserCached();

  if (!authResult.success) {
    throw new ApplicationError("Authentication required.", "AUTH_REQUIRED");
  }

  const roles = makeRoleRepository();

  const hasRole = await roles.userHasRole(authResult.data.id, roleName);

  if (!hasRole) {
    throw new ApplicationError(
      "No tienes autorización para realizar esta acción.",
      "FORBIDDEN",
    );
  }

  return authResult.data;
});
