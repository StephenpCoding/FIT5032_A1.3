// ✅ Firebase Functions v2 + Firestore Trigger + Resend API + Bulk Email API
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import * as logger from "firebase-functions/logger";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

initializeApp();

// 🟢 替换为你的 Resend API Key
const RESEND_API_KEY = "re_bxorwVLi_KH8dscDQ6Wx7Rh5FvFbPbiV4";

// ==========================================
// ✅ Part 1. Firestore 触发器：活动新增 → 自动邮件通知
// ==========================================
export const onActivityAdded = onDocumentCreated(
  "activities/{docId}",
  async (event) => {
    const data = event.data.data();
    logger.info("🔥 New activity added:", data);

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
          to: "cszc0906@gmail.com", // ✅ 这里可以换成管理员邮箱
          subject: "New Activity Added",
          html: `<p>${message}</p>`,
        }),
      });

      const result = await response.json();
      logger.info("✅ Email sent:", result);
    } catch (error) {
      logger.error("❌ Failed to send email:", error);
    }
  }
);

// ==========================================
// ✅ Part 2. Express REST API: 批量邮件群发接口
// ==========================================
import { onRequest } from "firebase-functions/v2/https";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ✅ POST /send-bulk-email
app.post("/send-bulk-email", async (req, res) => {
  try {
    const { subject, message, recipients, sender } = req.body;

    // 权限验证
    if (!sender || sender !== "admin@example.com") {
      return res.status(403).json({ error: "Access denied: Admin only" });
    }

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: "No recipients provided" });
    }

    logger.info("📧 Sending bulk email:", { subject, count: recipients.length });

    // 并行发送（Resend 限制：每次请求一个收件人）
    const results = await Promise.allSettled(
      recipients.map(async (email) => {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Community Sport Health <noreply@resend.dev>",
            to: email,
            subject,
            html: `<p>${message}</p>`,
          }),
        });
        return response.json();
      })
    );

    logger.info("✅ Bulk email results:", results);
    res.json({ success: true, count: recipients.length, results });
  } catch (err) {
    logger.error("❌ Error in /send-bulk-email:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 导出 HTTPS Function
export const api = onRequest(app);
