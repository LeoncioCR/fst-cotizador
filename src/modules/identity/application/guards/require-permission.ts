import { cache } from "react";

import { getCurrentUserCached } from "@/modules/auth";

import { ApplicationError } from "@/shared/errors/application-error";

import { makePermissionRepository } from "../../infrastructure/identity-container";

/*
 * Este contexto se obtiene UNA SOLA VEZ
 * durante la renderización/request.
 *
 * Aunque después preguntemos:
 *
 * usuarios.ver
 * roles.ver
 * roles.crear
 * roles.editar
 * roles.eliminar
 * roles.asignar_permisos
 *
 * no volvemos a consultar PostgreSQL
 * por cada permiso.
 */
const getPermissionContextCached = cache(async () => {
  const result = await getCurrentUserCached();

  if (!result.success) {
    throw new ApplicationError("Authentication required.", "AUTH_REQUIRED");
  }

  const repository = makePermissionRepository();

  const permissionContext = await repository.getUserPermissionContext(
    result.data.id,
  );

  return {
    user: result.data,

    isAdministrator: permissionContext.isAdministrator,

    permissions: new Set(permissionContext.permissionNames),
  };
});

export const requirePermission = cache(async (permissionName: string) => {
  const context = await getPermissionContextCached();

  /*
   * 7.24
   *
   * Administrador siempre tiene
   * acceso a cualquier permiso,
   * incluso permisos futuros.
   */
  if (context.isAdministrator) {
    return context.user;
  }

  const allowed = context.permissions.has(permissionName);

  if (!allowed) {
    throw new ApplicationError(
      "No tienes autorización para realizar esta acción.",
      "FORBIDDEN",
    );
  }

  return context.user;
});
