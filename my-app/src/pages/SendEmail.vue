<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">
      📬 Send Email (Resend API)
    </h1>

    <!-- 🔹 收件人选择 -->
    <div class="border rounded p-4 bg-gray-50 mb-6">
      <h2 class="font-semibold mb-3">Select Recipients:</h2>

      <div v-if="loading" class="text-gray-400 text-sm">Loading users...</div>
      <div v-else-if="users.length === 0" class="text-gray-400 text-sm">
        No users found in Firestore.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        <label
          v-for="(user, index) in users"
          :key="index"
          class="flex items-center space-x-2 bg-white border rounded px-2 py-1 cursor-pointer hover:bg-blue-50"
        >
          <input
            type="checkbox"
            v-model="selectedRecipients"
            :value="user.email"
            class="cursor-pointer"
          />
          <span>{{ user.name || "Unnamed" }} — {{ user.email }}</span>
        </label>
      </div>
    </div>

    <!-- 🔹 邮件主题 -->
    <div class="mb-4">
      <label class="block font-semibold mb-1">Subject:</label>
      <input
        v-model="subject"
        type="text"
        class="border p-2 w-full rounded"
        placeholder="Enter email subject"
      />
    </div>

    <!-- 🔹 邮件正文 -->
    <div class="mb-6">
      <label class="block font-semibold mb-1">Message:</label>
      <textarea
        v-model="message"
        class="border p-2 w-full rounded h-32"
        placeholder="Enter your message here"
      ></textarea>
    </div>

    <!-- 🔹 发送按钮 -->
    <div class="text-center">
      <button
        @click="sendEmail"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        :disabled="selectedRecipients.length === 0 || loading"
      >
        {{ loading ? "Sending..." : "Send Selected Emails" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";

// ✅ 邮件数据
const users = ref([]);
const selectedRecipients = ref([]);
const subject = ref("");
const message = ref("");
const loading = ref(false);

// ✅ Function URL
const API_URL =
  "https://us-central1-community-sport-health.cloudfunctions.net/api/send-bulk-email";

// ✅ 从 Firestore 加载用户邮箱
onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    users.value = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  } catch (err) {
    console.error("❌ Failed to load users:", err);
    alert("Failed to load users: " + err.message);
  }
});

// ✅ 发送群发邮件
async function sendEmail() {
  if (!subject.value || !message.value) {
    alert("Please fill in both subject and message.");
    return;
  }

  loading.value = true;
  try {
    const sender = auth.currentUser?.email;

    const res = await axios.post(API_URL, {
      subject: subject.value,
      message: message.value,
      recipients: selectedRecipients.value,
      sender,
    });

    if (res.data.success) {
      alert(
        `✅ Sent to ${res.data.sent || selectedRecipients.value.length} recipients successfully!`
      );
      selectedRecipients.value = [];
      subject.value = "";
      message.value = "";
    } else {
      alert("❌ Failed: " + (res.data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Send failed:", err);
    alert("Error: " + err.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
label input[type="checkbox"] {
  accent-color: #2563eb;
}
</style>
