<template>
  <div class="p-6">
    <h1
      class="text-xl font-bold mb-4"
      tabindex="0"
      aria-label="Community Geo Location using Google Maps"
    >
      🗺️ Community Geo Location (Google Maps)
    </h1>

    <!-- 🔍 搜索框 -->
    <form
      class="flex mb-4"
      role="search"
      aria-label="Search nearby places"
      @submit.prevent="searchPlaces"
    >
      <label for="searchBox" class="sr-only">Search nearby places</label>
      <input
        id="searchBox"
        v-model="query"
        placeholder="Search nearby (e.g. cafe, park)"
        class="border p-2 mr-2 flex-1"
        aria-label="Search for nearby places"
        aria-describedby="searchHelp"
        role="searchbox"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>

    <p id="searchHelp" class="text-sm text-gray-500 mb-2">
      Type a keyword and press Enter to find nearby locations.
    </p>

    <!-- 🗺️ 地图区域 -->
    <div
      id="map"
      class="w-full h-[500px] rounded shadow"
      tabindex="0"
      role="region"
      aria-label="Interactive Google map showing community locations and routes"
    ></div>

    <!-- �‍♂️ 路程信息 -->
    <div v-if="routes.length > 0" class="mt-4 p-4 bg-white rounded shadow">
      <h2 class="font-bold mb-2">📍 Distance Information:</h2>
      <div class="space-y-2">
        <div v-for="(route, index) in routes" :key="index" class="flex items-center">
          <span class="text-blue-600 mr-2">🎯</span>
          <span>{{ route.name }}:</span>
          <span class="ml-2 text-gray-600">{{ route.distance }}</span>
          <span class="mx-2">·</span>
          <span class="text-gray-600">{{ route.duration }}</span>
        </div>
      </div>
    </div>

    <!-- �📅 弹出预约日历 -->
    <div
      v-if="showCalendar"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white rounded shadow-lg w-11/12 max-w-4xl p-6 relative">
        <button
          class="absolute top-3 right-3 text-red-600 font-bold"
          @click="showCalendar = false"
        >
          ✖
        </button>

        <!-- ✅ 动态传入选中地点 -->
        <BookingCalendar v-if="selectedPlace" :placeName="selectedPlace" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BookingCalendar from "./BookingCalendar.vue";

const query = ref("");
const showCalendar = ref(false);
const selectedPlace = ref(null);
const routes = ref([]); // 存储所有路程信息

let map;
let userPos = null;
let markers = [];
let directionsService;
let directionsRenderer;

const GOOGLE_API_KEY = "AIzaSyBlo22SK9e2GIa633RafAsZKdMcqgSg3y4";

onMounted(async () => {
  await initMap();

  // ✅ 读取上次选择的地点（可用于返回后继续显示）
  const savedPlace = localStorage.getItem("selectedPlace");
  if (savedPlace) {
    selectedPlace.value = savedPlace;
  }
});

// ✅ 初始化地图
async function initMap() {
  if (!window.google || !window.google.maps) {
    await loadGoogleMapsScript();
  }

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { DirectionsService, DirectionsRenderer } =
    await google.maps.importLibrary("routes");

  directionsService = new DirectionsService();
  directionsRenderer = new DirectionsRenderer();

  map = new Map(document.getElementById("map"), {
    center: { lat: -37.8136, lng: 144.9631 },
    zoom: 14,
    mapId: "cc845a0688c802fd1abacf0d",
  });

  directionsRenderer.setMap(map);

  // ✅ 用户定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setCenter(userPos);
        new AdvancedMarkerElement({
          map,
          position: userPos,
          title: "📍 You are here",
        });
      },
      (err) => handleGeoError(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// ✅ 定位错误提示
function handleGeoError(err) {
  console.error("❌ Geolocation error:", err);
  userPos = { lat: -37.8136, lng: 144.9631 };
  map.setCenter(userPos);
  alert("Failed to access your location. Defaulting to Melbourne city center.");
}

  // ✅ 搜索地点并显示 marker
async function searchPlaces() {
  if (!query.value) return alert("Please enter a search keyword!");
  if (!userPos) return alert("Please enable location first!");

  const { Place } = await google.maps.importLibrary("places");

  const request = {
    textQuery: query.value,
    fields: ["displayName", "formattedAddress", "location"],
    locationBias: { center: userPos, radius: 2000 },
  };

  const { places } = await Place.searchByText(request);

  if (!places || places.length === 0) {
    alert("No results found.");
    return;
  }

  // ✅ 更新地点列表并通知 BookingCalendar 组件
  const placeNames = places.map(place => place.displayName);
  localStorage.setItem("searchedPlaces", JSON.stringify(placeNames));
  document.dispatchEvent(new CustomEvent("searchedPlacesUpdated", { 
    detail: placeNames 
  }));

  // 清理旧数据
  markers.forEach((m) => (m.map = null));
  markers = [];
  routes.value = [];
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] });
  }

  // 计算所有地点的路程信息
  for (const place of places) {
    try {
      const result = await calculateRoute(place.location, place.displayName);
      if (result) {
        routes.value.push({
          name: place.displayName,
          distance: result.distance,
          duration: result.duration
        });
      }
    } catch (error) {
      console.error("Failed to calculate route:", error);
    }
  }

  places.forEach((place) => {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: place.location,
      title: place.displayName,
    });

    marker.element.setAttribute("aria-label", `Location marker for ${place.displayName}`);

    // ✅ 点击 marker → 保存地点名 → 打开日历
    marker.addListener("click", async () => {
      selectedPlace.value = place.displayName;
      localStorage.setItem("selectedPlace", place.displayName); // ⬅️ 保存地点
      
      // 点击时显示到该地点的路线
      const result = await calculateRoute(place.location, place.displayName);
      if (result) {
        const routeIndex = routes.value.findIndex(r => r.name === place.displayName);
        if (routeIndex !== -1) {
          routes.value[routeIndex] = {
            name: place.displayName,
            distance: result.distance,
            duration: result.duration
          };
        }
      }
      
      showCalendar.value = true;
    });

    markers.push(marker);
  });

  map.setCenter(places[0].location);
}

// ✅ 加载 Google Maps 脚本
function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existing) {
      existing.addEventListener("load", resolve);
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ✅ 计算路线和距离信息
async function calculateRoute(destination, placeName) {
  if (!userPos || !destination) return null;

  try {
    const result = await new Promise((resolve, reject) => {
      const request = {
        origin: userPos,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING, // 使用步行模式
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          // 显示到当前选中地点的路线
          if (placeName === selectedPlace.value) {
            directionsRenderer.setDirections(result);
          }
          
          const route = result.routes[0].legs[0];
          resolve({
            distance: route.distance.text,
            duration: route.duration.text
          });
        } else {
          reject(new Error(status));
        }
      });
    });

    return result;
  } catch (error) {
    console.error(`Failed to calculate route to ${placeName}:`, error);
    return null;
  }
}

onUnmounted(() => {
  markers.forEach((m) => (m.map = null));
  if (directionsRenderer) directionsRenderer.setMap(null);
});
</script>

<style>
#map {
  height: 500px;
  width: 100%;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
:focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
</style>
