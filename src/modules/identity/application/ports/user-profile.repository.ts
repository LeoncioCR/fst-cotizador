import type { UserProfile } from "../../domain/user-profile";

import type { UserStatus } from "../../domain/user";

export interface UserProfileRepository {
  findAll(): Promise<UserProfile[]>;

  findById(id: string): Promise<UserProfile | null>;

  updateFullName(id: string, fullName: string): Promise<void>;

  updateStatus(id: string, status: UserStatus): Promise<void>;
}
