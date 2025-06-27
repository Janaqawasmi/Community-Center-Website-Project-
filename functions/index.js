const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const { handleSendMessage } = require("./helpers/inquiry");
const { handleProgramRegistration } = require("./helpers/programRegistration");
const { handleEventRegistration } = require("./helpers/eventRegistration");
const { buildEmailHtml } = require("./helpers/email");
const cors = require("cors");
const corsHandler = cors({ origin: true });

admin.initializeApp();
const db = admin.firestore();

if (process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV === "development") {
  console.log("Skipping SendGrid key in local/dev mode");
} else {
  sgMail.setApiKey(functions.config().sendgrid.key);
}
exports.sendMessage = functions.https.onRequest(handleSendMessage);
exports.registerProgram = functions
  .region("us-central1")
  .https.onRequest((req, res) => {
    corsHandler(req, res, () => handleProgramRegistration(req, res));
  });

  exports.registerEvent = functions
  .region('us-central1')
   .https.onRequest((req, res) => {
    corsHandler(req, res, () => handleEventRegistration(req, res));
  });
  
// ✅ Program registration confirmation
exports.sendProgramConfirmation = functions.firestore
  .document("programRegistrations/{regId}")
  .onCreate(async (snap, context) => {
    const registration = snap.data();
    const programId = registration.docId;

    try {
      const programDoc = await db.collection("programs").doc(programId).get();
      const siteInfoDoc = await db.collection("siteInfo").doc("9ib8qFqM732MnTlg6YGz").get();

      if (!programDoc.exists || !siteInfoDoc.exists) {
        console.error("🚫 Program or siteInfo not found");
        return;
      }

      const program = programDoc.data();
      const siteInfo = siteInfoDoc.data();
      const recipientEmail = registration.email;

      const formattedDate = program.date?.toDate().toLocaleDateString("ar-EG", {
        weekday: "long", year: "numeric", month: "long",
      }) || "—";

      const daysList = Array.isArray(program.days)
        ? `<li><strong>الأيام:</strong> ${program.days.join(", ")}</li>`
        : "";

      const itemsHtml = `
        <li><strong>اسم البرنامج:</strong> ${program.name}</li>
        <li><strong>التاريخ:</strong> ${formattedDate}</li>
        <li><strong>الوقت:</strong> ${program.time || "—"}</li>
        <li><strong>الموقع:</strong> ${program.location || "مركز بيت حنينا"}</li>
        ${daysList}
      `;

      const msg = {
        to: recipientEmail,
        from: "qawasmija@post.jce.ac.il", // ✅ your verified sender
        subject: `تأكيد التسجيل في برنامج ${program.name}`,
        html: buildEmailHtml(registration.FirstName, "البرنامج", itemsHtml, siteInfo),
      };

      await sgMail.send(msg);
      console.log("📧 Program confirmation email sent to", recipientEmail);
    } catch (err) {
      console.error("❌ Error sending program email:", err);
    }
  });

// ✅ Event registration confirmation
exports.sendEventConfirmation = functions.firestore
  .document("eventRegistrations/{regId}")
  .onCreate(async (snap, context) => {
    const registration = snap.data();
    const eventId = registration.docId;

    try {
      const eventDoc = await db.collection("Events").doc(eventId).get();
      const siteInfoDoc = await db.collection("siteInfo").doc("9ib8qFqM732MnTlg6YGz").get();

      if (!eventDoc.exists || !siteInfoDoc.exists) {
        console.error("🚫 Event or siteInfo not found");
        return;
      }

      const eventInfo = eventDoc.data();
      const siteInfo = siteInfoDoc.data();
      const recipientEmail = registration.email;

      const formattedDate = eventInfo.date?.toDate().toLocaleDateString("ar-EG", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      }) || "—";

      const itemsHtml = `
        <li><strong>اسم الفعالية:</strong> ${eventInfo.name}</li>
        <li><strong>التاريخ:</strong> ${formattedDate}</li>
        <li><strong>الوقت:</strong> ${eventInfo.time || "—"}</li>
        <li><strong>الموقع:</strong> ${eventInfo.location || "مركز بيت حنينا"}</li>
      `;

      const msg = {
        to: recipientEmail,
        from: "qawasmija@post.jce.ac.il",
        subject: `تأكيد التسجيل في الفعالية ${eventInfo.name}`,
        html: buildEmailHtml(registration.FirstName, "الفعالية", itemsHtml, siteInfo),
      };

      await sgMail.send(msg);
      console.log("📧 Event confirmation email sent to", recipientEmail);
    } catch (err) {
      console.error("❌ Error sending event email:", err);
    }
  });
