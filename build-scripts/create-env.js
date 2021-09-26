const fs = require("fs");
fs.writeFileSync(
  "./.env",
  `FIREBASE_API_KEY=${process.env.FIREBASE_API_KEY}\nRECAPTCHA_SITE_KEY=${process.env.RECAPTCHA_SITE_KEY}\nWEEKLY_RATE=${process.env.WEEKLY_RATE}\nMONTHLY_RATE=${process.env.MONTHLY_RATE}\nFIREBASE_FUNCTIONS_PROD=${process.env.FIREBASE_FUNCTIONS_PROD}\n`
);
