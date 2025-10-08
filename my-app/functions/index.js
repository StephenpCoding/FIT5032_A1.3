// ✅ Firebase Functions v2 + Firestore Trigger + Resend API
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import fetch from "node-fetch";

initializeApp();

const RESEND_API_KEY = "re_bxorwVLi_KH8dscDQ6Wx7Rh5FvFbPbiV4";

// ✅ 当 Firestore 集合 "activities" 新增文档时触发
export const onActivityAdded = onDocumentCreated("activities/{docId}", async (event) => {
  const data = event.data.data();
  console.log("🔥 New activity added:", data);

  const message = `New Activity Added: ${data.activity} - ${data.duration} mins`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Community Sport Health <noreply@resend.dev>",
        to: "cszc0906@gmail.com", // ⚠️ 改为你的邮箱
        subject: "New Activity Added",
        html: `<p>${message}</p>`,
      }),
    });

    const result = await response.json();
    console.log("✅ Email sent:", result);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
});
