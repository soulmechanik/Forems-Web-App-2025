import sendEmail from "./utils/sendEmail.js";

(async () => {
  console.log("🚀 Starting test email...");
  const result = await sendEmail(
    "owarotimiadebowale@gmail.com", // replace with a real recipient
    "Test Email from Forems",
    "This is a test email from Forems Africa.",
    "<p>This is a test email from <strong>Forems Africa</strong>.</p>"
  );

  if (result) console.log("✅ Test email sent successfully");
  else console.log("❌ Test email failed to send.");
})();
