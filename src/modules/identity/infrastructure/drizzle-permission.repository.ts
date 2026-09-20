import { asc, eq, inArray } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "@/infrastructure/database/schema";

import type { Permission } from "../domain/permission";

import type {
  PermissionRepository,
  UserPermissionContext,
} from "../application/ports/permission.repository";

export class DrizzlePermissionRepository implements PermissionRepository {
  async findAll(): Promise<Permission[]> {
    return db
      .select()
      .from(permissions)
      .orderBy(asc(permissions.module), asc(permissions.displayName));
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) {
      return [];
    }

    return db.select().from(permissions).where(inArray(permissions.id, ids));
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const [role] = await db
      .select({
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    /*
     * 7.24:
     *
     * administrador siempre posee
     * todos los permisos.
     */
    if (role?.name === "administrador") {
      return this.findAll();
    }

    return db
      .select({
        id: permissions.id,

        name: permissions.name,

        module: permissions.module,

        displayName: permissions.displayName,

        description: permissions.description,

        isSystem: permissions.isSystem,

        createdAt: permissions.createdAt,

        updatedAt: permissions.updatedAt,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId))
      .orderBy(asc(permissions.module), asc(permissions.displayName));
  }

  /*
   * Obtiene roles + permisos efectivos
   * en UNA SOLA consulta.
   *
   * Antes:
   *
   * permiso A -> consulta administrador
   *           -> consulta permiso
   *
   * permiso B -> consulta administrador
   *           -> consulta permiso
   *
   * etc.
   *
   * Ahora:
   *
   * usuario
   *   ↓
   * una consulta
   *   ↓
   * administrador + permisos
   */
  async getUserPermissionContext(
    userId: string,
  ): Promise<UserPermissionContext> {
    const rows = await db
      .select({
        roleName: roles.name,

        permissionName: permissions.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(userRoles.userId, userId));

    const isAdministrator = rows.some(
      (row) => row.roleName === "administrador",
    );

    /*
     * Eliminamos permisos repetidos,
     * porque varios roles pueden
     * otorgar el mismo permiso.
     */
    const permissionNames = [
      ...new Set(
        rows
          .map((row) => row.permissionName)
          .filter(
            (permissionName): permissionName is string =>
              permissionName !== null,
          ),
      ),
    ];

    return {
      isAdministrator,

      permissionNames,
    };
  }

  async userHasPermission(
    userId: string,
    permissionName: string,
  ): Promise<boolean> {
    const context = await this.getUserPermissionContext(userId);

    /*
     * 7.24:
     *
     * administrador es superrol.
     */
    if (context.isAdministrator) {
      return true;
    }

    return context.permissionNames.includes(permissionName);
  }

  async replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId));

      if (permissionIds.length === 0) {
        return;
      }

      await tx.insert(rolePermissions).values(
        permissionIds.map((permissionId) => ({
          roleId,

          permissionId,

          assignedBy,
        })),
      );
    });
  }
}
