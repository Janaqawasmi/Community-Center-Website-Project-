const admin = require("firebase-admin");
const { verifyRecaptcha } = require("./recaptcha");

async function handleSendMessage(req, res) {
  const { recaptchaToken, ...messageData } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({
      success: false,
      message: "Missing reCAPTCHA token.",
    });
  }

  try {
    const verificationResult = await verifyRecaptcha(recaptchaToken);

    if (!verificationResult.success) {
      console.error("reCAPTCHA failed:", verificationResult["error-codes"]);
      return res.status(403).json({
        success: false,
        message: "reCAPTCHA verification failed.",
        errors: verificationResult["error-codes"] || [],
      });
    }

    await admin.firestore().collection("contactMessages").add({
      ...messageData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry sent successfully!",
    });

  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during reCAPTCHA verification.",
    });
  }
}

module.exports = { handleSendMessage };
