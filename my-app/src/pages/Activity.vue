<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">🏃 Community Sport Activity Tracker</h1>

    <!-- ✅ 输入表单 -->
    <div class="mb-4" role="form" aria-label="Add new activity">
      <div class="flex items-center space-x-2">
        <label for="activity" class="sr-only">Activity name</label>
        <input
          id="activity"
          v-model="activity"
          placeholder="Activity (e.g., Jogging)"
          class="border p-2 mr-2"
          aria-label="Enter activity name"
          aria-required="true"
        />

        <label for="duration" class="sr-only">Activity duration</label>
        <input
          id="duration"
          v-model.number="duration"
          type="number"
          min="0"
          placeholder="Duration (minutes)"
          class="border p-2 mr-2"
          aria-label="Enter activity duration in minutes"
          aria-required="true"
        />

        <!-- 添加活动按钮 -->
        <button
          @click="addActivity"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Add new activity"
        >
          <span aria-hidden="true">➕</span> Add
        </button>

        <!-- ✅ 导出 CSV 按钮 -->
        <button
          @click="exportCSV"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Export activities to CSV file"
        >
          <span aria-hidden="true">📊</span> Export CSV
        </button>
      </div>
      <div id="formHelp" class="text-sm text-gray-600 mt-1">
        Fill in both activity name and duration to add a new activity.
      </div>
    </div>

    <!-- 搜索栏 -->
    <div
      class="mb-4 flex space-x-4"
      role="search"
      aria-label="Search activities"
    >
      <div class="flex-1">
        <label for="searchQuery" class="sr-only">Search activities</label>
        <input
          id="searchQuery"
          v-model="searchQuery"
          placeholder="Search activities..."
          class="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearch"
          aria-label="Search activities"
          role="searchbox"
        />
      </div>
      <div class="flex-1">
        <label for="searchColumn" class="sr-only">Select search column</label>
        <select
          id="searchColumn"
          v-model="searchColumn"
          class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select which column to search in"
        >
          <option value="all">Search All Columns</option>
          <option value="activity">Activity</option>
          <option value="duration">Duration</option>
          <option value="timestamp">Date</option>
        </select>
      </div>
    </div>

    <!-- 交互式数据表格 -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full bg-white rounded-lg overflow-hidden"
        role="grid"
        aria-label="Activities table"
      >
        <thead class="bg-gray-100">
          <tr>
            <th
              class="py-2 px-4 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              @click="sortBy('activity')"
              role="columnheader"
              aria-sort="{{ sortColumn === 'activity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none' }}"
              tabindex="0"
            >
              Activity
              <span class="sr-only"
                >Sort by activity
                {{
                  sortColumn === "activity"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : ""
                }}</span
              >
              <span aria-hidden="true" v-if="sortColumn === 'activity'">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              class="py-2 px-4 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              @click="sortBy('duration')"
              role="columnheader"
              aria-sort="{{ sortColumn === 'duration' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none' }}"
              tabindex="0"
            >
              Duration (mins)
              <span class="sr-only"
                >Sort by duration
                {{
                  sortColumn === "duration"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : ""
                }}</span
              >
              <span aria-hidden="true" v-if="sortColumn === 'duration'">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th
              class="py-2 px-4 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              @click="sortBy('timestamp')"
              role="columnheader"
              aria-sort="{{ sortColumn === 'timestamp' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none' }}"
              tabindex="0"
            >
              Date/Time
              <span class="sr-only"
                >Sort by date
                {{
                  sortColumn === "timestamp"
                    ? sortDirection === "asc"
                      ? "ascending"
                      : "descending"
                    : ""
                }}</span
              >
              <span aria-hidden="true" v-if="sortColumn === 'timestamp'">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedActivities"
            :key="index"
            class="border-b hover:bg-gray-50"
            role="row"
          >
            <td class="py-2 px-4" role="cell">{{ item.activity }}</td>
            <td class="py-2 px-4" role="cell">{{ item.duration }}</td>
            <td class="py-2 px-4" role="cell">{{ item.timestamp }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控制 -->
    <div
      class="mt-4 flex justify-between items-center"
      role="navigation"
      aria-label="Table navigation"
    >
      <div class="flex items-center space-x-2">
        <label for="pageSize" class="text-sm">Rows per page:</label>
        <select
          id="pageSize"
          v-model="pageSize"
          class="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select number of rows per page"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
      <div
        class="flex items-center space-x-2"
        role="group"
        aria-label="Pagination controls"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go to previous page"
        >
          <span aria-hidden="true">←</span>
          <span class="sr-only">Previous Page</span>
        </button>
        <div role="status" aria-live="polite" class="text-sm">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go to next page"
        >
          <span aria-hidden="true">→</span>
          <span class="sr-only">Next Page</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const activity = ref("");
const duration = ref(0);
const activities = ref([]);
let unsubscribe = null;

// 表格交互状态
const searchQuery = ref("");
const searchColumn = ref("all");
const sortColumn = ref("timestamp");
const sortDirection = ref("desc");
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性：过滤后的活动列表
const filteredActivities = computed(() => {
  let result = [...activities.value];

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((item) => {
      if (searchColumn.value === "all") {
        return (
          item.activity.toLowerCase().includes(query) ||
          item.duration.toString().includes(query) ||
          item.timestamp.toLowerCase().includes(query)
        );
      } else {
        const value = item[searchColumn.value].toString().toLowerCase();
        return value.includes(query);
      }
    });
  }

  // 排序
  result.sort((a, b) => {
    let valueA = a[sortColumn.value];
    let valueB = b[sortColumn.value];

    if (sortColumn.value === "duration") {
      valueA = Number(valueA);
      valueB = Number(valueB);
    }

    if (sortDirection.value === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return result;
});

// 计算属性：当前页的数据
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredActivities.value.slice(start, end);
});

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / pageSize.value);
});

// 排序处理函数
function sortBy(column) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
}

// 搜索处理函数
function handleSearch() {
  currentPage.value = 1; // 重置到第一页
}

// 监听页面大小变化
watch(pageSize, () => {
  currentPage.value = 1; // 重置到第一页
});

/* ✅ 添加活动（写入用户独立路径） */
async function addActivity() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first!");
    return;
  }

  if (!activity.value || !duration.value) {
    alert("Please fill in both fields!");
    return;
  }

  await addDoc(collection(db, "userActivities", user.uid, "records"), {
    activity: activity.value,
    duration: duration.value,
    timestamp: serverTimestamp(),
  });

  activity.value = "";
  duration.value = 0;
}

/* ✅ 等待身份加载后再监听数据 */
onAuthStateChanged(auth, (user) => {
  if (unsubscribe) unsubscribe(); // 切换用户时清理旧监听

  if (user) {
    const userActivitiesRef = collection(
      db,
      "userActivities",
      user.uid,
      "records"
    );
    const q = query(userActivitiesRef, orderBy("timestamp", "desc"));

    unsubscribe = onSnapshot(q, (snapshot) => {
      activities.value = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || "",
      }));
    });
  } else {
    activities.value = [];
    console.warn("⚠️ User not logged in, no data loaded.");
  }
});

/* ✅ 数据导出为 CSV 文件 */
function exportCSV() {
  if (!activities.value || activities.value.length === 0) {
    alert("No activity records to export!");
    return;
  }

  // 1️⃣ 定义 CSV 列头
  const headers = ["Activity", "Duration (minutes)", "Timestamp"];

  // 2️⃣ 将数据行转换为数组
  const rows = activities.value.map((item) => [
    item.activity,
    item.duration,
    item.timestamp,
  ]);

  // 3️⃣ 拼接成 CSV 字符串
  const csvContent = [headers, ...rows]
    .map((row) => row.map((v) => `"${v}"`).join(","))
    .join("\n");

  // 4️⃣ 创建 Blob 对象并生成下载链接
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // 5️⃣ 创建并触发下载
  const link = document.createElement("a");
  link.href = url;
  link.download = `my_activities_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  // 6️⃣ 释放对象 URL
  URL.revokeObjectURL(url);

  console.log("✅ Exported CSV successfully!");
}

/* ✅ 页面卸载时关闭监听 */
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style>
/* 可选样式扩展 */
</style>
