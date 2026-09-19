import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const profileStatusEnum = pgEnum("profile_status", [
  "active",
  "inactive",
]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),

    fullName: varchar("full_name", {
      length: 160,
    }),

    status: profileStatusEnum("status").notNull().default("active"),

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
    index("profiles_status_idx").on(table.status),

    index("profiles_full_name_idx").on(table.fullName),
  ],
);
