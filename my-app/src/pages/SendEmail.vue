<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Send Email (Resend API)</h1>

    <!-- 输入表单 -->
    <input
      v-model="to"
      type="email"
      placeholder="Recipient Email"
      class="border p-2 mb-2 w-80"
    />
    <input
      v-model="subject"
      placeholder="Subject"
      class="border p-2 mb-2 w-80"
    />
    <textarea
      v-model="message"
      placeholder="Message"
      class="border p-2 mb-2 w-80 h-24"
    ></textarea>

    <!-- 发送按钮 -->
    <button
      @click="handleSendEmail"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      :disabled="loading"
    >
      {{ loading ? "Sending..." : "Send Email" }}
    </button>

    <!-- 状态提示 -->
    <p v-if="status" class="mt-4 text-gray-700">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const to = ref("");
const subject = ref("");
const message = ref("");
const status = ref("");
const loading = ref(false);

async function handleSendEmail() {
  if (!to.value || !subject.value || !message.value) {
    alert("Please fill in all fields!");
    return;
  }

  loading.value = true;
  status.value = "Sending email...";

  try {
    // ✅ 调用你在 server/sendEmailServer.js 中启动的后端接口
    const response = await fetch("http://localhost:3000/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: to.value,
        subject: subject.value,
        text: message.value,
      }),
    });

    const result = await response.json();

    if (result.success) {
      status.value = "✅ Email sent successfully!";
    } else {
      status.value = "❌ Failed to send email: " + result.error;
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    status.value = "❌ Network error. Check backend server.";
  } finally {
    loading.value = false;
  }
}
</script>
