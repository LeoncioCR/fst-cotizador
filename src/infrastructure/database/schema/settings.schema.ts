import { sql } from "drizzle-orm";

import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { profiles } from "./identity.schema";

export const companyContactTypeEnum = pgEnum("company_contact_type", [
  "phone",
  "whatsapp",
  "email",
  "other",
]);

export const companySettings = pgTable(
  "company_settings",

  {
    id: varchar("id", {
      length: 32,
    })
      .primaryKey()
      .default("company"),

    legalName: varchar("legal_name", {
      length: 180,
    }),

    tradeName: varchar("trade_name", {
      length: 160,
    })
      .notNull()
      .default("FST Negocios"),

    ruc: varchar("ruc", {
      length: 11,
    }),

    address: text("address"),

    email: varchar("email", {
      length: 160,
    }),

    website: varchar("website", {
      length: 220,
    }),

    logoPath: text("logo_path"),

    quotationFooter: text("quotation_footer"),

    updatedBy: uuid("updated_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    check("company_settings_singleton_check", sql`${table.id} = 'company'`),
  ],
);

export const quotationSettings = pgTable(
  "quotation_settings",

  {
    id: varchar("id", {
      length: 32,
    })
      .primaryKey()
      .default("quotation"),

    currencyCode: varchar("currency_code", {
      length: 3,
    })
      .notNull()
      .default("PEN"),

    igvRate: numeric("igv_rate", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("18.00"),

    pricesIncludeIgv: boolean("prices_include_igv").notNull().default(true),

    defaultCashDiscount: numeric("default_cash_discount", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("30.00"),

    defaultInstallmentDiscount: numeric("default_installment_discount", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("20.00"),

    defaultCardMonths: integer("default_card_months").notNull().default(12),

    quotationPrefix: varchar("quotation_prefix", {
      length: 20,
    })
      .notNull()
      .default("COT"),

    numberingPadding: integer("numbering_padding").notNull().default(6),

    resetNumberingYearly: boolean("reset_numbering_yearly")
      .notNull()
      .default(true),

    defaultValidityDays: integer("default_validity_days"),

    updatedBy: uuid("updated_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    check("quotation_settings_singleton_check", sql`${table.id} = 'quotation'`),

    check(
      "quotation_settings_igv_check",
      sql`${table.igvRate} >= 0
            AND ${table.igvRate} <= 100`,
    ),

    check(
      "quotation_settings_cash_discount_check",
      sql`${table.defaultCashDiscount} >= 0
            AND ${table.defaultCashDiscount} <= 100`,
    ),

    check(
      "quotation_settings_installment_discount_check",
      sql`${table.defaultInstallmentDiscount} >= 0
            AND ${table.defaultInstallmentDiscount} <= 100`,
    ),

    check(
      "quotation_settings_card_months_check",
      sql`${table.defaultCardMonths} >= 1
            AND ${table.defaultCardMonths} <= 60`,
    ),

    check(
      "quotation_settings_padding_check",
      sql`${table.numberingPadding} >= 3
            AND ${table.numberingPadding} <= 10`,
    ),

    check(
      "quotation_settings_validity_check",
      sql`${table.defaultValidityDays} IS NULL
            OR ${table.defaultValidityDays} >= 1`,
    ),
  ],
);

export const companyContacts = pgTable(
  "company_contacts",

  {
    id: uuid("id").defaultRandom().primaryKey(),

    area: varchar("area", {
      length: 120,
    }).notNull(),

    type: companyContactTypeEnum("type").notNull(),

    value: varchar("value", {
      length: 200,
    }).notNull(),

    sortOrder: integer("sort_order").notNull().default(0),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    index("company_contacts_active_idx").on(table.isActive),

    index("company_contacts_sort_idx").on(table.sortOrder),

    check("company_contacts_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);
