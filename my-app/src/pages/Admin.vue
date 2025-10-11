<template>
  <div class="p-6 space-y-8">
    <!-- 📊 用户统计概览 -->
    <section class="bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 总用户数 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-700">Total Users</h3>
          <p class="text-3xl font-bold text-blue-900">{{ userStats.total }}</p>
        </div>
        <!-- 用户类型分布 -->
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-green-700">Regular Users</h3>
          <p class="text-3xl font-bold text-green-900">
            {{ userStats.regularUsers }}
          </p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-700">Admin Users</h3>
          <p class="text-3xl font-bold text-purple-900">
            {{ userStats.adminUsers }}
          </p>
        </div>
      </div>
    </section>

    <!-- 📈 评分统计模块 -->
    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Rating Statistics</h2>
      <p>Total Ratings: {{ ratingStore.ratings.length }}</p>
      <p>Average Score: {{ ratingStore.average }}</p>
    </section>

    <!-- 👥 用户列表 -->
    <section class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">User Management</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    user.isAdmin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  "
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.isAdmin ? "Admin" : "User" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.lastLogin) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 📢 新增：群发邮件模块 -->
    <section class="bg-white p-6 rounded shadow max-w-3xl">
      <h2 class="text-xl font-bold mb-4">📢 Bulk Email Notification</h2>

      <div class="space-y-4">
        <!-- 邮件主题 -->
        <div>
          <label class="block mb-2 font-semibold">Email Subject:</label>
          <input
            v-model="subject"
            type="text"
            class="border p-2 w-full rounded"
            placeholder="Enter email subject"
          />
        </div>

        <!-- 邮件正文 -->
        <div>
          <label class="block mb-2 font-semibold">Message Content:</label>
          <textarea
            v-model="message"
            class="border p-2 w-full h-32 rounded"
            placeholder="Enter email body (e.g. community announcement)"
          ></textarea>
        </div>

        <!-- 收件人展示 -->
        <div>
          <label class="block mb-2 font-semibold">Recipients:</label>
          <div class="border p-3 rounded bg-gray-50">
            <p v-if="recipients.length === 0" class="text-gray-400">
              Loading recipients from Firestore...
            </p>
            <ul v-else class="list-disc list-inside text-gray-700">
              <li v-for="(email, i) in recipients" :key="i">{{ email }}</li>
            </ul>
          </div>
        </div>

        <!-- 发送按钮 -->
        <button
          @click="sendBulkEmail"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Bulk Email
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRatingStore } from "../store/rating";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";

const ratingStore = useRatingStore();

// 用户统计数据
const userStats = ref({
  total: 0,
  regularUsers: 0,
  adminUsers: 0,
});

// 用户列表数据
const users = ref([]);

// ✅ 邮件数据
const subject = ref("");
const message = ref("");
const recipients = ref([]);

// ✅ Firebase Function URL (部署后复制你的真实地址)
const API_URL =
  "https://us-central1-your-project.cloudfunctions.net/api/send-bulk-email";

// 格式化日期
function formatDate(timestamp) {
  if (!timestamp) return "Never";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ✅ 从 Firestore 加载用户数据
onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const userData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      isAdmin: doc.data().email === "cszc0906@163.com", // 根据邮箱判断是否为管理员
      isActive: doc.data().lastLogin > Date.now() - 30 * 24 * 60 * 60 * 1000, // 30天内登录视为活跃
    }));

    // 更新用户列表
    users.value = userData;

    // 更新用户统计
    userStats.value = {
      total: userData.length,
      regularUsers: userData.filter((u) => !u.isAdmin).length,
      adminUsers: userData.filter((u) => u.isAdmin).length,
    };

    // 更新收件人列表
    recipients.value = userData.map((user) => user.email);
  } catch (err) {
    console.error("❌ Failed to load users:", err);
  }
});

// ✅ 批量发送邮件
async function sendBulkEmail() {
  if (!subject.value || !message.value) {
    alert("Please enter both subject and message.");
    return;
  }

  try {
    const sender = auth.currentUser?.email;
    const res = await axios.post(API_URL, {
      subject: subject.value,
      message: message.value,
      recipients: recipients.value,
      sender,
    });

    if (res.data.success) {
      alert("✅ Bulk emails sent successfully!");
      subject.value = "";
      message.value = "";
    }
  } catch (err) {
    console.error("❌ Send failed:", err);
    alert("Failed to send emails: " + err.message);
  }
}
</script>

<style scoped>
section {
  transition: all 0.2s ease-in-out;
}
section:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
}
</style>
