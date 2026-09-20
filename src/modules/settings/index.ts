export {
  makeGetSettingsUseCase,
  makeUpdateCompanySettingsUseCase,
  makeUpdateQuotationSettingsUseCase,
  makeCreateCompanyContactUseCase,
  makeDeleteCompanyContactUseCase,
  makeSettingsRepository,
  makeCompanyAssets,
} from "./infrastructure/settings-container";

export type { CompanySettings } from "./domain/company-settings";

export type { QuotationSettings } from "./domain/quotation-settings";

export type {
  CompanyContact,
  CompanyContactType,
} from "./domain/company-contact";
