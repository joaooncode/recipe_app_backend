import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";
const PORT = ENV.PORT;

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).send({
    status: "OK",
    message: "API is running...",
  });
});

// Favorites routes

// Get favorites
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    if (!favorites || favorites.length === 0) {
      return res.status(404).json({
        message: "No favorites found",
      });
    }
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching the favorites: ", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// New Favorite
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    const favorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(favorite[0]);
  } catch (error) {
    console.error("Error adding new favorite: ", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// Remove Favorite
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    // Validate required parameters
    if (!userId || !recipeId) {
      return res.status(400).json({
        error: "Missing required parameters: userId and recipeId",
      });
    }

    // Validate userId is not empty
    if (userId.trim() === "") {
      return res.status(400).json({
        error: "userId cannot be empty",
      });
    }

    // Validate and parse recipeId
    const parsedRecipeId = parseInt(recipeId);
    if (isNaN(parsedRecipeId) || parsedRecipeId <= 0) {
      return res.status(400).json({
        error: "recipeId must be a valid positive integer",
      });
    }

    // Check if the favorite exists before deleting
    const existingFavorite = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parsedRecipeId)
        )
      )
      .limit(1);

    if (existingFavorite.length === 0) {
      return res.status(404).json({
        error: "Favorite not found",
      });
    }

    // Delete the favorite
    const result = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parsedRecipeId)
        )
      )
      .returning();

    res.status(200).json({
      message: "Favorite removed successfully.",
      deletedFavorite: result[0],
    });
  } catch (error) {
    console.error("Error removing a favorite: ", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
