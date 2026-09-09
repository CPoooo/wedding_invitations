import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const rsvps = pgTable("rsvps", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(), // who filled out this form ex: Meris
  attending: boolean("attending").notNull(),

  guestCount: integer("guest_count").notNull().default(1), // total including themselves
  guestNames: text("guest_names").array(),                 // ex: ["Simon"] for the +1(s)

  dietaryRestrictions: text("dietary_restrictions"),  // optional dietary_restrictions
  message: text("message"),                           // optional well-wish message 

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;