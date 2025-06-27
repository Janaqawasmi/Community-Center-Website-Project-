const axios = require("axios");
const functions = require("firebase-functions");

async function verifyRecaptcha(token) {
  const secret = functions.config().recaptcha.secret;

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({
      secret: secret,
      response: token,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

module.exports = { verifyRecaptcha };
