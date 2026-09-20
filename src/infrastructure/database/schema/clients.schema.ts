import { sql } from "drizzle-orm";

import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { profiles } from "./identity.schema";

export const clientTypeEnum = pgEnum("client_type", ["natural", "juridica"]);

export const clientDocumentTypeEnum = pgEnum("client_document_type", [
  "dni",
  "ruc",
]);

export const clientStatusEnum = pgEnum("client_status", ["active", "inactive"]);

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    type: clientTypeEnum("type").notNull(),

    documentType: clientDocumentTypeEnum("document_type").notNull(),

    documentNumber: varchar("document_number", {
      length: 20,
    }).notNull(),

    /*
     * Persona natural:
     * nombre completo
     *
     * Persona jurídica:
     * razón social
     */
    name: varchar("name", {
      length: 180,
    }).notNull(),

    /*
     * Principalmente para
     * persona jurídica.
     */
    commercialName: varchar("commercial_name", {
      length: 180,
    }),

    address: text("address"),

    notes: text("notes"),

    status: clientStatusEnum("status").notNull().default("active"),

    createdBy: uuid("created_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

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
    uniqueIndex("clients_document_uidx").on(
      table.documentType,
      table.documentNumber,
    ),

    index("clients_name_idx").on(table.name),

    index("clients_status_idx").on(table.status),

    index("clients_type_idx").on(table.type),

    index("clients_document_number_idx").on(table.documentNumber),
  ],
);

export const clientContacts = pgTable(
  "client_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, {
        onDelete: "restrict",
      }),

    fullName: varchar("full_name", {
      length: 160,
    }).notNull(),

    position: varchar("position", {
      length: 120,
    }),

    email: varchar("email", {
      length: 160,
    }),

    phone: varchar("phone", {
      length: 40,
    }),

    whatsapp: varchar("whatsapp", {
      length: 40,
    }),

    isPrimary: boolean("is_primary").notNull().default(false),

    isActive: boolean("is_active").notNull().default(true),

    createdBy: uuid("created_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

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
    index("client_contacts_client_idx").on(table.clientId),

    index("client_contacts_active_idx").on(table.isActive),

    /*
     * Solo un contacto principal
     * ACTIVO por cliente.
     */
    uniqueIndex("client_contacts_primary_uidx")
      .on(table.clientId)
      .where(
        sql`${table.isPrimary} = true
              AND ${table.isActive} = true`,
      ),
  ],
);
