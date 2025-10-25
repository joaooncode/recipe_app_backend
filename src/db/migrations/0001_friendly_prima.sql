ALTER TABLE "favorites" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
CREATE EXTENSION IF NOT EXISTS 'pgcrypto'