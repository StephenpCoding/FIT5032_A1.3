// server/sendEmailServer.js
import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 使用你自己的 Resend API Key
const resend = new Resend("re_bxorwVLi_KH8dscDQ6Wx7Rh5FvFbPbiV4");

app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const data = await resend.emails.send({
      from: "HealthSport App <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", data);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Send email failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Local Email API running on http://localhost:3000/api/send-email");
});
