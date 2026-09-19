import type { UserStatus } from "./user";

export interface UserProfile {
  id: string;

  fullName: string | null;

  status: UserStatus;
}
