export type UserStatus = "active" | "inactive";

export interface SystemUser {
  id: string;

  email: string;

  fullName: string | null;

  status: UserStatus;

  emailConfirmed: boolean;

  createdAt: string;

  lastSignInAt: string | null;
}
