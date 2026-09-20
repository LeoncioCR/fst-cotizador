import { and, asc, count, eq, inArray } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import { profiles, roles, userRoles } from "@/infrastructure/database/schema";

import type { Role, RoleSummary } from "../domain/role";

import type {
  CreateRoleData,
  RoleRepository,
  UpdateRoleData,
} from "../application/ports/role.repository";

export class DrizzleRoleRepository implements RoleRepository {
  async findAll(): Promise<RoleSummary[]> {
    const rows = await db
      .select({
        id: roles.id,
        name: roles.name,

        displayName: roles.displayName,

        description: roles.description,

        isSystem: roles.isSystem,

        createdAt: roles.createdAt,

        updatedAt: roles.updatedAt,

        userCount: count(userRoles.userId),
      })
      .from(roles)

      .leftJoin(userRoles, eq(roles.id, userRoles.roleId))

      .groupBy(
        roles.id,
        roles.name,
        roles.displayName,
        roles.description,
        roles.isSystem,
        roles.createdAt,
        roles.updatedAt,
      )

      .orderBy(asc(roles.displayName));

    return rows;
  }

  async findById(id: string): Promise<Role | null> {
    const [row] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    return row ?? null;
  }

  async findByName(name: string): Promise<Role | null> {
    const [row] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);

    return row ?? null;
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    if (ids.length === 0) {
      return [];
    }

    return db.select().from(roles).where(inArray(roles.id, ids));
  }

  async create(data: CreateRoleData): Promise<Role> {
    const [role] = await db
      .insert(roles)
      .values({
        name: data.name,

        displayName: data.displayName,

        description: data.description ?? null,

        isSystem: data.isSystem ?? false,
      })
      .returning();

    return role;
  }

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const [role] = await db
      .update(roles)
      .set({
        name: data.name,

        displayName: data.displayName,

        description: data.description ?? null,

        updatedAt: new Date(),
      })
      .where(eq(roles.id, id))
      .returning();

    return role;
  }

  async delete(id: string): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }

  async countUsers(roleId: string): Promise<number> {
    const [row] = await db
      .select({
        total: count(),
      })
      .from(userRoles)
      .where(eq(userRoles.roleId, roleId));

    return row?.total ?? 0;
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const rows = await db
      .select({
        id: roles.id,
        name: roles.name,

        displayName: roles.displayName,

        description: roles.description,

        isSystem: roles.isSystem,

        createdAt: roles.createdAt,

        updatedAt: roles.updatedAt,
      })

      .from(userRoles)

      .innerJoin(roles, eq(userRoles.roleId, roles.id))

      .where(eq(userRoles.userId, userId))

      .orderBy(asc(roles.displayName));

    return rows;
  }

  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    const [row] = await db
      .select({
        roleId: userRoles.roleId,
      })

      .from(userRoles)

      .innerJoin(roles, eq(userRoles.roleId, roles.id))

      .where(
        and(
          eq(userRoles.userId, userId),

          eq(roles.name, roleName),
        ),
      )

      .limit(1);

    return Boolean(row);
  }

  async countActiveUsersByRoleName(roleName: string): Promise<number> {
    const [row] = await db
      .select({
        total: count(),
      })

      .from(userRoles)

      .innerJoin(roles, eq(userRoles.roleId, roles.id))

      .innerJoin(profiles, eq(userRoles.userId, profiles.id))

      .where(
        and(
          eq(roles.name, roleName),

          eq(profiles.status, "active"),
        ),
      );

    return row?.total ?? 0;
  }

  async replaceUserRoles(
    userId: string,
    roleIds: string[],
    assignedBy: string,
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(userRoles).where(eq(userRoles.userId, userId));

      if (roleIds.length === 0) {
        return;
      }

      await tx.insert(userRoles).values(
        roleIds.map((roleId) => ({
          userId,
          roleId,
          assignedBy,
        })),
      );
    });
  }
}
