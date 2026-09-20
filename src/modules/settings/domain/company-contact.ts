export type CompanyContactType = "phone" | "whatsapp" | "email" | "other";

export interface CompanyContact {
  id: string;

  area: string;

  type: CompanyContactType;

  value: string;

  sortOrder: number;

  isActive: boolean;
}
