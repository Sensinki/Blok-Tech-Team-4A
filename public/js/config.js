require("dotenv").config(),
(module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  API_KEY: process.env.API_KEY,
  API_CAPTCHA: process.env.API_CAPTCHA,
});
