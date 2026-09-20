export interface Permission {
  id: string;

  name: string;

  module: string;

  displayName: string;

  description: string | null;

  isSystem: boolean;

  createdAt: Date;

  updatedAt: Date;
}
