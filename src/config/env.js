import "dotenv/config";
export const ENV = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_URL: process.env.API_URL || "http://localhost:5001",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
