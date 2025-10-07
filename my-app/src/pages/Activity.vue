<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">🏃 Community Sport Activity Tracker</h1>

    <!-- 输入表单 -->
    <div class="mb-4">
      <input
        v-model="activity"
        placeholder="Activity (e.g., Jogging)"
        class="border p-2 mr-2"
      />
      <input
        v-model.number="duration"
        type="number"
        placeholder="Duration (minutes)"
        class="border p-2 mr-2"
      />
      <button
        @click="addActivity"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add
      </button>
    </div>

    <!-- 实时显示所有活动 -->
    <h2 class="text-lg font-semibold mb-2">Live Activity Feed:</h2>
    <ul>
      <li
        v-for="(item, index) in activities"
        :key="index"
        class="border-b py-2 flex justify-between"
      >
        <span>{{ item.activity }} - {{ item.duration }} mins</span>
        <span class="text-gray-500 text-sm">{{ item.timestamp }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const activity = ref("");
const duration = ref(0);
const activities = ref([]);

const activitiesRef = collection(db, "activities");

// ✅ 实时监听数据库变化
onMounted(() => {
  const q = query(activitiesRef, orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    activities.value = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      timestamp: doc.data().timestamp?.toDate().toLocaleString() || "",
    }));
  });
});

// ✅ 添加活动记录
async function addActivity() {
  if (!activity.value || !duration.value)
    return alert("Please fill in both fields!");

  await addDoc(activitiesRef, {
    activity: activity.value,
    duration: duration.value,
    timestamp: serverTimestamp(),
  });

  activity.value = "";
  duration.value = 0;
}
</script>
