import { Resend } from "resend";

// ✅ 用你自己的 Resend API key（注意要加引号）
const resend = new Resend("re_bxorwVLi_KH8dscDQ6Wx7Rh5FvFbPbiV4");

export async function sendEmail(to, subject, text) {
  try {
    const data = await resend.emails.send({
      from: "HealthSport App <onboarding@resend.dev>", // 可用官方默认地址
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", data);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
}
