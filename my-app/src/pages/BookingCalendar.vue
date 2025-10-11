<template>
  <div class="p-6">
    <!-- 标题区域 -->
    <h1 class="text-2xl font-bold mb-4">
      🗓️ Community Booking Calendar —
      <span v-if="selectedPlace">{{ selectedPlace }}</span>
      <span v-else>No place selected</span>
    </h1>

    <!-- 地点选择下拉框 -->
    <div class="mb-4 flex items-center space-x-3">
      <label class="font-semibold">Select Location:</label>
      <select
        v-model="selectedPlace"
        @change="handlePlaceChange"
        class="border p-2 rounded w-64"
      >
        <option disabled value="">-- Choose a place --</option>
        <option v-for="place in placeOptions" :key="place" :value="place">
          {{ place }}
        </option>
      </select>
    </div>

    <!-- FullCalendar 日历 -->
    <FullCalendar
      v-if="selectedPlace"
      :options="calendarOptions"
      class="border rounded shadow p-4 bg-white"
    />

    <!-- 未选择地点时提示 -->
    <p v-else class="text-gray-500 text-center mt-10">
      Please select a location on the map to view or create bookings.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const selectedPlace = ref("");
const bookings = ref([]);
const placeOptions = ref([]);  // 将改为动态地点列表

// ✅ 初始化 FullCalendar 配置
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  selectable: true,
  events: [],
  select: handleDateSelect,
  eventColor: "#2563eb",
  height: "auto",
});

// ✅ 加载上次选中的地点和地点列表
onMounted(async () => {
  // 从 localStorage 获取已搜索到的地点列表
  const savedPlaces = localStorage.getItem("searchedPlaces");
  if (savedPlaces) {
    placeOptions.value = JSON.parse(savedPlaces);
  }

  const savedPlace = localStorage.getItem("selectedPlace");
  if (savedPlace) {
    selectedPlace.value = savedPlace;
    await loadBookings();
  }

  // 监听来自地图的新地点事件
  window.addEventListener("searchedPlacesUpdated", (event) => {
    if (event.detail && Array.isArray(event.detail)) {
      placeOptions.value = event.detail;
      localStorage.setItem("searchedPlaces", JSON.stringify(event.detail));
    }
  });
});

// ✅ 当地点变化时重新加载数据
watch(selectedPlace, async (newPlace) => {
  if (newPlace) {
    localStorage.setItem("selectedPlace", newPlace);
    await loadBookings();
  } else {
    calendarOptions.value.events = [];
  }
});

// ✅ 加载 Firestore 数据
async function loadBookings() {
  try {
    console.log(`📖 Loading bookings for: ${selectedPlace.value}`);

    const q = query(
      collection(db, "bookings"),
      where("place", "==", selectedPlace.value)
    );
    const querySnapshot = await getDocs(q);

    bookings.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    calendarOptions.value.events = bookings.value.map((b) => ({
      title: b.title,
      start: b.date.toDate ? b.date.toDate() : b.date,
    }));

    console.log("✅ Loaded bookings:", bookings.value);
  } catch (err) {
    console.error("❌ Failed to load bookings:", err);
  }
}

// ✅ 创建新的预约事件
async function handleDateSelect(info) {
  const title = prompt("Enter event title:");
  if (!title) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first.");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      userId: user.uid,
      place: selectedPlace.value,
      title,
      date: Timestamp.fromDate(info.start),
    });

    alert("✅ Booking saved successfully!");
    await loadBookings();
  } catch (err) {
    console.error("❌ Failed to save booking:", err);
    alert("Failed to save booking: " + err.message);
  }
}

// ✅ 地点切换时重新加载预约
function handlePlaceChange() {
  if (selectedPlace.value) {
    loadBookings();
  }
}
</script>

<style scoped>
.fc {
  font-family: "Inter", sans-serif;
  background: white;
  border-radius: 0.5rem;
}
.fc-toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
