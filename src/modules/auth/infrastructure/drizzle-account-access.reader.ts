import { eq } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import { profiles } from "@/infrastructure/database/schema";

import type {
  AccountAccessPort,
  AccountStatus,
} from "../application/ports/account-access.port";

export class DrizzleAccountAccessReader implements AccountAccessPort {
  async getStatus(userId: string): Promise<AccountStatus | null> {
    const [profile] = await db
      .select({
        status: profiles.status,
      })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    return profile?.status ?? null;
  }
}
