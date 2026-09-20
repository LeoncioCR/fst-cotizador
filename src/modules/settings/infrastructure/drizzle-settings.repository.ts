import { asc, eq } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import {
  companyContacts,
  companySettings,
  quotationSettings,
} from "@/infrastructure/database/schema";

import type {
  SettingsRepository,
  UpdateCompanySettingsData,
  UpdateQuotationSettingsData,
  CreateCompanyContactData,
} from "../application/ports/settings.repository";

export class DrizzleSettingsRepository implements SettingsRepository {
  async getCompanySettings() {
    const [row] = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.id, "company"))
      .limit(1);

    if (!row) {
      throw new Error("Company settings not found");
    }

    return {
      legalName: row.legalName,

      tradeName: row.tradeName,

      ruc: row.ruc,

      address: row.address,

      email: row.email,

      website: row.website,

      logoPath: row.logoPath,

      quotationFooter: row.quotationFooter,
    };
  }

  async updateCompanySettings(data: UpdateCompanySettingsData): Promise<void> {
    await db
      .update(companySettings)
      .set({
        legalName: data.legalName,

        tradeName: data.tradeName,

        ruc: data.ruc,

        address: data.address,

        email: data.email,

        website: data.website,

        quotationFooter: data.quotationFooter,

        updatedBy: data.updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(companySettings.id, "company"));
  }

  async getQuotationSettings() {
    const [row] = await db
      .select()
      .from(quotationSettings)
      .where(eq(quotationSettings.id, "quotation"))
      .limit(1);

    if (!row) {
      throw new Error("Quotation settings not found");
    }

    return {
      currencyCode: row.currencyCode,

      igvRate: row.igvRate,

      pricesIncludeIgv: row.pricesIncludeIgv,

      defaultCashDiscount: row.defaultCashDiscount,

      defaultInstallmentDiscount: row.defaultInstallmentDiscount,

      defaultCardMonths: row.defaultCardMonths,

      quotationPrefix: row.quotationPrefix,

      numberingPadding: row.numberingPadding,

      resetNumberingYearly: row.resetNumberingYearly,

      defaultValidityDays: row.defaultValidityDays,
    };
  }

  async updateQuotationSettings(
    data: UpdateQuotationSettingsData,
  ): Promise<void> {
    await db
      .update(quotationSettings)
      .set({
        currencyCode: data.currencyCode,

        igvRate: data.igvRate,

        pricesIncludeIgv: data.pricesIncludeIgv,

        defaultCashDiscount: data.defaultCashDiscount,

        defaultInstallmentDiscount: data.defaultInstallmentDiscount,

        defaultCardMonths: data.defaultCardMonths,

        quotationPrefix: data.quotationPrefix,

        numberingPadding: data.numberingPadding,

        resetNumberingYearly: data.resetNumberingYearly,

        defaultValidityDays: data.defaultValidityDays,

        updatedBy: data.updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(quotationSettings.id, "quotation"));
  }

  async listContacts() {
    return db
      .select()
      .from(companyContacts)
      .orderBy(asc(companyContacts.sortOrder));
  }

  async createContact(data: CreateCompanyContactData) {
    const [contact] = await db
      .insert(companyContacts)
      .values({
        area: data.area,

        type: data.type,

        value: data.value,

        sortOrder: data.sortOrder,
      })
      .returning();

    return contact;
  }

  async deleteContact(id: string): Promise<void> {
    await db.delete(companyContacts).where(eq(companyContacts.id, id));
  }

  async updateLogoPath(path: string, updatedBy: string): Promise<void> {
    await db
      .update(companySettings)
      .set({
        logoPath: path,

        updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(companySettings.id, "company"));
  }
}
