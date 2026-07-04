import { pgTable, serial, text, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  transmission: text("transmission").notNull(),
  fuel: text("fuel").notNull(),
  seats: integer("seats").notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("available"),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull().default("4.5"),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array(),
  featured: boolean("featured").notNull().default(false),
  description: text("description"),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable).omit({ id: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehiclesTable.$inferSelect;
