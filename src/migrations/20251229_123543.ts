import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hostels_facilities" AS ENUM('WiFi', 'AC', 'Laundry', 'Kitchen', '24/7 Security', 'Attached Bathroom', 'Parking', 'Generator/UPS');
  CREATE TYPE "public"."enum_hostels_beds_per_room" AS ENUM('single', 'double', 'triple');
  CREATE TYPE "public"."enum_hostels_room_type" AS ENUM('male', 'female', 'mixed');
  CREATE TYPE "public"."enum_tenants_occupation" AS ENUM('student', 'working', 'business', 'other');
  CREATE TYPE "public"."enum_tenants_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_payments_payment_type" AS ENUM('rent', 'deposit', 'late_fee', 'maintenance', 'utility', 'other');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'paid', 'overdue', 'partial', 'refunded');
  CREATE TYPE "public"."enum_payments_payment_method" AS ENUM('cash', 'bank_transfer', 'jazzcash', 'easypaisa', 'cheque', 'online');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "hostels_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "hostels_facilities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_hostels_facilities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "hostels_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"room_number" varchar NOT NULL,
  	"bed_number" varchar,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"monthly_rent" numeric,
  	"deposit_paid" numeric,
  	"notes" varchar
  );
  
  CREATE TABLE "hostels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"address_street" varchar NOT NULL,
  	"address_area" varchar NOT NULL,
  	"address_city" varchar NOT NULL,
  	"address_postal_code" varchar,
  	"address_location_latitude" numeric NOT NULL,
  	"address_location_longitude" numeric NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"total_rooms" numeric NOT NULL,
  	"total_beds" numeric NOT NULL,
  	"occupied_beds" numeric DEFAULT 0 NOT NULL,
  	"available_beds" numeric NOT NULL,
  	"beds_per_room" "enum_hostels_beds_per_room" NOT NULL,
  	"room_type" "enum_hostels_room_type" NOT NULL,
  	"rent_per_bed" numeric NOT NULL,
  	"security_deposit" numeric NOT NULL,
  	"manager" varchar NOT NULL,
  	"contact_number" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"cnic" varchar NOT NULL,
  	"contact_number" varchar NOT NULL,
  	"email" varchar,
  	"emergency_contact_name" varchar,
  	"emergency_contact_relationship" varchar,
  	"emergency_contact_phone" varchar,
  	"occupation" "enum_tenants_occupation" NOT NULL,
  	"occupation_details" varchar,
  	"status" "enum_tenants_status" DEFAULT 'active' NOT NULL,
  	"cnic_photo_id" integer,
  	"profile_photo_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"payment_id" varchar NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"hostel_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"payment_type" "enum_payments_payment_type" NOT NULL,
  	"for_month" timestamp(3) with time zone,
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"payment_date" timestamp(3) with time zone,
  	"payment_method" "enum_payments_payment_method",
  	"transaction_reference" varchar,
  	"receipt_number" varchar,
  	"receipt_document_id" integer,
  	"late_fee" numeric DEFAULT 0,
  	"discount" numeric DEFAULT 0,
  	"notes" varchar,
  	"collected_by" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"hostels_id" integer,
  	"tenants_id" integer,
  	"payments_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hostels_images" ADD CONSTRAINT "hostels_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hostels_images" ADD CONSTRAINT "hostels_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hostels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hostels_facilities" ADD CONSTRAINT "hostels_facilities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hostels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hostels_tenants" ADD CONSTRAINT "hostels_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hostels_tenants" ADD CONSTRAINT "hostels_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hostels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hostels" ADD CONSTRAINT "hostels_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_cnic_photo_id_media_id_fk" FOREIGN KEY ("cnic_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_profile_photo_id_media_id_fk" FOREIGN KEY ("profile_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_hostel_id_hostels_id_fk" FOREIGN KEY ("hostel_id") REFERENCES "public"."hostels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_receipt_document_id_media_id_fk" FOREIGN KEY ("receipt_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hostels_fk" FOREIGN KEY ("hostels_id") REFERENCES "public"."hostels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "hostels_images_order_idx" ON "hostels_images" USING btree ("_order");
  CREATE INDEX "hostels_images_parent_id_idx" ON "hostels_images" USING btree ("_parent_id");
  CREATE INDEX "hostels_images_image_idx" ON "hostels_images" USING btree ("image_id");
  CREATE INDEX "hostels_facilities_order_idx" ON "hostels_facilities" USING btree ("order");
  CREATE INDEX "hostels_facilities_parent_idx" ON "hostels_facilities" USING btree ("parent_id");
  CREATE INDEX "hostels_tenants_order_idx" ON "hostels_tenants" USING btree ("_order");
  CREATE INDEX "hostels_tenants_parent_id_idx" ON "hostels_tenants" USING btree ("_parent_id");
  CREATE INDEX "hostels_tenants_tenant_idx" ON "hostels_tenants" USING btree ("tenant_id");
  CREATE INDEX "hostels_thumbnail_idx" ON "hostels" USING btree ("thumbnail_id");
  CREATE INDEX "hostels_updated_at_idx" ON "hostels" USING btree ("updated_at");
  CREATE INDEX "hostels_created_at_idx" ON "hostels" USING btree ("created_at");
  CREATE UNIQUE INDEX "tenants_cnic_idx" ON "tenants" USING btree ("cnic");
  CREATE INDEX "tenants_cnic_photo_idx" ON "tenants" USING btree ("cnic_photo_id");
  CREATE INDEX "tenants_profile_photo_idx" ON "tenants" USING btree ("profile_photo_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE UNIQUE INDEX "payments_payment_id_idx" ON "payments" USING btree ("payment_id");
  CREATE INDEX "payments_tenant_idx" ON "payments" USING btree ("tenant_id");
  CREATE INDEX "payments_hostel_idx" ON "payments" USING btree ("hostel_id");
  CREATE INDEX "payments_receipt_document_idx" ON "payments" USING btree ("receipt_document_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_hostels_id_idx" ON "payload_locked_documents_rels" USING btree ("hostels_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "hostels_images" CASCADE;
  DROP TABLE "hostels_facilities" CASCADE;
  DROP TABLE "hostels_tenants" CASCADE;
  DROP TABLE "hostels" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_hostels_facilities";
  DROP TYPE "public"."enum_hostels_beds_per_room";
  DROP TYPE "public"."enum_hostels_room_type";
  DROP TYPE "public"."enum_tenants_occupation";
  DROP TYPE "public"."enum_tenants_status";
  DROP TYPE "public"."enum_payments_payment_type";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_payments_payment_method";`)
}
