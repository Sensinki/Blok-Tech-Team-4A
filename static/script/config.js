require("dotenv").config(); // Laad omgevingsvariabelen uit het .env-bestand

module.exports = {
  MONGO_URI: process.env.MONGO_URI, // MongoDB-verbinding URI
  API_KEY: process.env.API_KEY, // API-sleutel
  API_CAPTCHA: process.env.API_CAPTCHA,
};
