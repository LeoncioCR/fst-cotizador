export interface Role {
  id: string;

  name: string;

  displayName: string;

  description: string | null;

  isSystem: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface RoleSummary extends Role {
  userCount: number;
}
