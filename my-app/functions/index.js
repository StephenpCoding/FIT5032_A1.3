// ✅ Firebase Cloud Function - Firestore Trigger + Resend Email

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// 替换为你的 Resend API Key
const RESEND_API_KEY = "re_bxorwVLi_KH8dscDQ6Wx7Rh5FvFbPbiV4";

// 当 Firestore 的 "activities" 集合新增数据时触发
exports.onActivityAdded = functions.firestore
  .document("activities/{docId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    console.log("New activity added:", data);

    const message = `New Activity Added: ${data.activity} - ${data.duration} mins`;

    // 发送邮件通知（可选）
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cloud Function <noreply@yourdomain.com>",
          to: "cszc0906@gmail.com", // ⚠️ 改成你的邮箱
          subject: "New Sport Activity Added",
          html: `<p>${message}</p>`,
        }),
      });

      const result = await response.json();
      console.log("✅ Email sent:", result);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }
  });
