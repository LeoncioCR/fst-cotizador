import type {
  CompanyContact,
  CompanyContactType,
} from "../../domain/company-contact";

import type { CompanySettings } from "../../domain/company-settings";

import type { QuotationSettings } from "../../domain/quotation-settings";

export interface UpdateCompanySettingsData {
  legalName: string | null;

  tradeName: string;

  ruc: string | null;

  address: string | null;

  email: string | null;

  website: string | null;

  quotationFooter: string | null;

  updatedBy: string;
}

export interface UpdateQuotationSettingsData {
  currencyCode: string;

  igvRate: string;

  pricesIncludeIgv: boolean;

  defaultCashDiscount: string;

  defaultInstallmentDiscount: string;

  defaultCardMonths: number;

  quotationPrefix: string;

  numberingPadding: number;

  resetNumberingYearly: boolean;

  defaultValidityDays: number | null;

  updatedBy: string;
}

export interface CreateCompanyContactData {
  area: string;

  type: CompanyContactType;

  value: string;

  sortOrder: number;
}

export interface SettingsRepository {
  getCompanySettings(): Promise<CompanySettings>;

  updateCompanySettings(data: UpdateCompanySettingsData): Promise<void>;

  getQuotationSettings(): Promise<QuotationSettings>;

  updateQuotationSettings(data: UpdateQuotationSettingsData): Promise<void>;

  listContacts(): Promise<CompanyContact[]>;

  createContact(data: CreateCompanyContactData): Promise<CompanyContact>;

  deleteContact(id: string): Promise<void>;

  updateLogoPath(path: string, updatedBy: string): Promise<void>;
}
