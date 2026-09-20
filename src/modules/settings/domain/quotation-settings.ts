export interface QuotationSettings {
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
}
