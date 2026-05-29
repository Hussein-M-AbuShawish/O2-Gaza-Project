CREATE TABLE "restaurant_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"branch" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"rating" text NOT NULL,
	"rating_value" integer NOT NULL,
	"food_quality" integer,
	"variety" integer,
	"prices" integer,
	"service" integer,
	"cleanliness" integer,
	"atmosphere" integer,
	"liked_most" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
