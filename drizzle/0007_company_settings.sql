CREATE TYPE "public"."company_contact_type" AS ENUM('phone', 'whatsapp', 'email', 'other');--> statement-breakpoint
CREATE TABLE "company_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"area" varchar(120) NOT NULL,
	"type" "company_contact_type" NOT NULL,
	"value" varchar(200) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_contacts_sort_order_check" CHECK ("company_contacts"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "company_settings" (
	"id" varchar(32) PRIMARY KEY DEFAULT 'company' NOT NULL,
	"legal_name" varchar(180),
	"trade_name" varchar(160) DEFAULT 'FST Negocios' NOT NULL,
	"ruc" varchar(11),
	"address" text,
	"email" varchar(160),
	"website" varchar(220),
	"logo_path" text,
	"quotation_footer" text,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_settings_singleton_check" CHECK ("company_settings"."id" = 'company')
);
--> statement-breakpoint
CREATE TABLE "quotation_settings" (
	"id" varchar(32) PRIMARY KEY DEFAULT 'quotation' NOT NULL,
	"currency_code" varchar(3) DEFAULT 'PEN' NOT NULL,
	"igv_rate" numeric(5, 2) DEFAULT '18.00' NOT NULL,
	"prices_include_igv" boolean DEFAULT true NOT NULL,
	"default_cash_discount" numeric(5, 2) DEFAULT '30.00' NOT NULL,
	"default_installment_discount" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"default_card_months" integer DEFAULT 12 NOT NULL,
	"quotation_prefix" varchar(20) DEFAULT 'COT' NOT NULL,
	"numbering_padding" integer DEFAULT 6 NOT NULL,
	"reset_numbering_yearly" boolean DEFAULT true NOT NULL,
	"default_validity_days" integer,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quotation_settings_singleton_check" CHECK ("quotation_settings"."id" = 'quotation'),
	CONSTRAINT "quotation_settings_igv_check" CHECK ("quotation_settings"."igv_rate" >= 0
            AND "quotation_settings"."igv_rate" <= 100),
	CONSTRAINT "quotation_settings_cash_discount_check" CHECK ("quotation_settings"."default_cash_discount" >= 0
            AND "quotation_settings"."default_cash_discount" <= 100),
	CONSTRAINT "quotation_settings_installment_discount_check" CHECK ("quotation_settings"."default_installment_discount" >= 0
            AND "quotation_settings"."default_installment_discount" <= 100),
	CONSTRAINT "quotation_settings_card_months_check" CHECK ("quotation_settings"."default_card_months" >= 1
            AND "quotation_settings"."default_card_months" <= 60),
	CONSTRAINT "quotation_settings_padding_check" CHECK ("quotation_settings"."numbering_padding" >= 3
            AND "quotation_settings"."numbering_padding" <= 10),
	CONSTRAINT "quotation_settings_validity_check" CHECK ("quotation_settings"."default_validity_days" IS NULL
            OR "quotation_settings"."default_validity_days" >= 1)
);
--> statement-breakpoint
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_settings" ADD CONSTRAINT "quotation_settings_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "company_contacts_active_idx" ON "company_contacts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "company_contacts_sort_idx" ON "company_contacts" USING btree ("sort_order");