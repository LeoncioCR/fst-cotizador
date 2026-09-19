import { eq } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import { profiles } from "@/infrastructure/database/schema";

import type { UserStatus } from "../domain/user";

import type { UserProfile } from "../domain/user-profile";

import type { UserProfileRepository } from "../application/ports/user-profile.repository";

export class DrizzleUserProfileRepository implements UserProfileRepository {
  async findAll(): Promise<UserProfile[]> {
    const rows = await db
      .select({
        id: profiles.id,

        fullName: profiles.fullName,

        status: profiles.status,
      })
      .from(profiles);

    return rows;
  }

  async findById(id: string): Promise<UserProfile | null> {
    const [row] = await db
      .select({
        id: profiles.id,

        fullName: profiles.fullName,

        status: profiles.status,
      })
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    return row ?? null;
  }

  async updateFullName(id: string, fullName: string): Promise<void> {
    await db
      .update(profiles)
      .set({
        fullName,

        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id));
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await db
      .update(profiles)
      .set({
        status,

        updatedAt: new Date(),
      })
      .where(eq(profiles.id, id));
  }
}
