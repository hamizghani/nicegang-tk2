const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const requiredEnv = [
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // Keep startup strict so auth config mistakes are visible immediately.
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const authorizedEmails = (process.env.AUTHORIZED_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT) || 3000,
  sessionSecret: process.env.SESSION_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  authorizedEmails,
  isProduction: process.env.NODE_ENV === "production",
};
