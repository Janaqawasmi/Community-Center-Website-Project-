const { verifyRecaptcha } = require("./recaptcha");
const admin = require("firebase-admin");
const cors = require("cors");
const corsHandler = cors({ origin: true });

async function handleEventRegistration(req, res) {
  const { recaptchaToken, ...registrationData } = req.body;

  if (!recaptchaToken) {
    return res.status(409).json({
  success: false,
  message: "Duplicate registration detected.",
  reason: "duplicate",
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

   // ✅ Check for duplicate registration
    const idWithoutLast = registrationData.id;
    const docId = registrationData.docId;

    const duplicateQuery = await admin
      .firestore()
      .collection("eventRegistrations")
      .where("id", "==", idWithoutLast)
      .where("docId", "==", docId)
      .get();

    if (!duplicateQuery.empty) {
      console.log("Duplicate registration found for ID:", idWithoutLast);
      return res.status(409).json({
        success: false,
        message: "Duplicate registration detected.",
      });
    }

    await admin.firestore().collection("eventRegistrations").add({
      ...registrationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Event registration successful!",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal error during registration.",
    });
  }
}

module.exports = { handleEventRegistration };
