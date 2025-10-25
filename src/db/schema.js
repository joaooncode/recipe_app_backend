import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";

export const favoritesTable = pgTable("favorites", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});
