CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"attending" boolean NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"guest_names" text[],
	"dietary_restrictions" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
