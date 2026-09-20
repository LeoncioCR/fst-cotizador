export interface ClientContact {
  id: string;

  clientId: string;

  fullName: string;

  position: string | null;

  email: string | null;

  phone: string | null;

  whatsapp: string | null;

  isPrimary: boolean;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}
