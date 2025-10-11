<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">📊 Activity Statistics</h1>

    <!-- 图表类型选择 -->
    <div class="mb-4">
      <label class="mr-2">Chart Type:</label>
      <select v-model="chartType" class="border p-2 rounded">
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
      </select>
    </div>

    <!-- 图表容器 -->
    <div class="bg-white p-4 rounded shadow">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { auth, db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Chart from "chart.js/auto";

const chartType = ref("bar");
const chartRef = ref(null);
let myChart = null;

// 从 Firestore 获取数据
async function fetchData() {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "userActivities", auth.currentUser.uid, "records"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

// 处理数据用于图表显示
function processDataForChart(data) {
  // 按活动类型分组并计算总时长
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.activity]) {
      acc[item.activity] = 0;
    }
    acc[item.activity] += item.duration;
    return acc;
  }, {});

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped),
  };
}

// 创建图表
function createChart(processedData) {
  const ctx = chartRef.value.getContext("2d");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: chartType.value,
    data: {
      labels: processedData.labels,
      datasets: [
        {
          label: "Total Duration (minutes)",
          data: processedData.data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Duration (minutes)",
          },
        },
      },
    },
  });
}

// 更新图表
async function updateChart() {
  const data = await fetchData();
  const processedData = processDataForChart(data);
  createChart(processedData);
}

// 监听图表类型变化
watch(chartType, () => {
  updateChart();
});

// 组件加载时初始化图表
onMounted(() => {
  updateChart();
});
</script>
  &lt;div class=&quot;p-6&quot;&gt;
    &lt;h1 class=&quot;text-xl font-bold mb-4&quot;&gt;📊 Activity Statistics&lt;/h1&gt;

    &lt;!-- 图表类型选择 --&gt;
    &lt;div class=&quot;mb-4&quot;&gt;
      &lt;label class=&quot;mr-2&quot;&gt;Chart Type:&lt;/label&gt;
      &lt;select v-model=&quot;chartType&quot; class=&quot;border p-2 rounded&quot;&gt;
        &lt;option value=&quot;bar&quot;&gt;Bar Chart&lt;/option&gt;
        &lt;option value=&quot;line&quot;&gt;Line Chart&lt;/option&gt;
      &lt;/select&gt;
    &lt;/div&gt;

    &lt;!-- 图表容器 --&gt;
    &lt;div class=&quot;bg-white p-4 rounded shadow&quot;&gt;
      &lt;canvas ref=&quot;chartRef&quot;&gt;&lt;/canvas&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, onMounted, watch } from 'vue';
import { auth, db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';

const chartType = ref('bar');
const chartRef = ref(null);
let myChart = null;

// 从 Firestore 获取数据
async function fetchData() {
  if (!auth.currentUser) return [];
  
  const q = query(
    collection(db, 'userActivities', auth.currentUser.uid, 'records'),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

// 处理数据用于图表显示
function processDataForChart(data) {
  // 按活动类型分组并计算总时长
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.activity]) {
      acc[item.activity] = 0;
    }
    acc[item.activity] += item.duration;
    return acc;
  }, {});

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped)
  };
}

// 创建图表
function createChart(processedData) {
  const ctx = chartRef.value.getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: chartType.value,
    data: {
      labels: processedData.labels,
      datasets: [{
        label: 'Total Duration (minutes)',
        data: processedData.data,
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Duration (minutes)'
          }
        }
      }
    }
  });
}

// 更新图表
async function updateChart() {
  const data = await fetchData();
  const processedData = processDataForChart(data);
  createChart(processedData);
}

// 监听图表类型变化
watch(chartType, () => {
  updateChart();
});

// 组件加载时初始化图表
onMounted(() => {
  updateChart();
});
&lt;/script&gt;