export interface AuthUser {
  id: string;

  email: string;

  emailConfirmed: boolean;

  createdAt: string;

  lastSignInAt: string | null;
}

export interface InviteUserInput {
  email: string;
  fullName: string;
}

export interface UpdateAuthUserInput {
  email?: string;
}

export interface UserAuthAdminPort {
  listUsers(): Promise<AuthUser[]>;

  getUserById(id: string): Promise<AuthUser | null>;

  inviteUser(input: InviteUserInput): Promise<AuthUser>;

  updateUser(id: string, input: UpdateAuthUserInput): Promise<AuthUser>;
}
