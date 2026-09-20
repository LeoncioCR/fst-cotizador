import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
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

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 80,
    }).notNull(),

    displayName: varchar("display_name", {
      length: 120,
    }).notNull(),

    description: text("description"),

    isSystem: boolean("is_system").notNull().default(false),

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
    uniqueIndex("roles_name_uidx").on(table.name),

    index("roles_display_name_idx").on(table.displayName),
  ],
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, {
        onDelete: "cascade",
      }),

    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "restrict",
      }),

    assignedBy: uuid("assigned_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    primaryKey({
      name: "user_roles_pkey",

      columns: [table.userId, table.roleId],
    }),

    index("user_roles_user_idx").on(table.userId),

    index("user_roles_role_idx").on(table.roleId),
  ],
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 120,
    }).notNull(),

    module: varchar("module", {
      length: 80,
    }).notNull(),

    displayName: varchar("display_name", {
      length: 160,
    }).notNull(),

    description: text("description"),

    isSystem: boolean("is_system").notNull().default(true),

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
    uniqueIndex("permissions_name_uidx").on(table.name),

    index("permissions_module_idx").on(table.module),
  ],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
      }),

    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
      }),

    assignedBy: uuid("assigned_by").references(() => profiles.id, {
      onDelete: "set null",
    }),

    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    primaryKey({
      name: "role_permissions_pkey",

      columns: [table.roleId, table.permissionId],
    }),

    index("role_permissions_role_idx").on(table.roleId),

    index("role_permissions_permission_idx").on(table.permissionId),
  ],
);
