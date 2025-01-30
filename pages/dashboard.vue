<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-2/5 sm:w-64 bg-gray-900 text-white transition-all duration-300 flex-shrink-0 overflow-auto"> 
      <div class="p-2 sm:p-4">
        <div class="flex items-center gap-2 text-sm sm:text-xl font-bold">
          <div class="w-6 sm:w-8 h-6 sm:h-8 bg-red-500 rounded-lg"></div>
          <span class="ml-3">ACTIVE<span class="text-red-500">ECOMMERCE</span></span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="px-2 sm:px-4 mt-2 sm:mt-6">
        <input v-model="searchQuery" type="search" placeholder="Search"
          class="w-full px-2 sm:px-4 py-1 sm:py-2 bg-gray-800 rounded-md text-xs sm:text-sm" />
      </div>

      <!-- Menu Items -->
      <nav class="mt-3 sm:mt-6">
        <template v-for="(item, index) in filteredMenuItems" :key="index">
          <router-link :to="item.path" class="flex items-center px-2 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-gray-800">
            <component :is="item.icon" class="w-5 h-5" />
            <span class="ml-3">{{ item.name }}</span>
          </router-link>
        </template>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="w-3/5 sm:flex-1 overflow-auto transition-all duration-300">
      <!-- Header -->
      <header class="bg-white border-b">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-gray-100 rounded-md">
              <Menu class="w-5 h-5" />
            </button>
            <nav class="flex flex-wrap space-x-4">
              <router-link to="/dashboard" class="text-blue-500 border-b-2 border-blue-500 pb-4">Dashboard</router-link>
              <router-link to="/orders" class="text-gray-500 hover:text-gray-700">Orders</router-link>
              <router-link to="/preorders" class="text-gray-500 hover:text-gray-700">Preorders</router-link>
              <router-link to="/earnings" class="text-gray-500 hover:text-gray-700">Earnings</router-link>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-blue-500 flex items-center">
              <Plus class="w-5 h-5 mr-1" />
              Add New
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <router-link v-if="stats.length > 0" to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[0].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[0].title }}</p>
          </router-link>

          <router-link v-if="stats.length > 1" to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[1].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[1].title }}</p>
          </router-link>

          <router-link v-if="stats.length > 2" to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[2].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[2].title }}</p>
          </router-link>

          <router-link v-if="stats.length > 3" to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[3].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[3].title }}</p>
          </router-link>
        </div>

        <!-- Categories and Brands Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <router-link to="/categories" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="font-semibold mb-4">Total Category</h3>
            <div class="space-y-3">
              <div v-for="category in categories" :key="category.name" class="flex justify-between">
                <span>{{ category.name }}</span>
                <span>${{ category.value.toLocaleString() }}</span>
              </div>
            </div>
          </router-link>

          <router-link to="/brands" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="font-semibold mb-4">Top Brands</h3>
            <div class="space-y-3">
              <div v-for="brand in brands" :key="brand.name" class="flex justify-between">
                <span>{{ brand.name }}</span>
                <span>${{ brand.value.toLocaleString() }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Orders Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="orders-stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold text-purple-500 mb-2">153</h3>
            <p class="text-gray-500 mb-4">Total Order</p>
            <button class="w-full mt-4 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
              All Orders
            </button>
          </router-link>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div class="col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h3 class="font-semibold mb-4">
                Sales Distribution for This Month
              </h3>
              <canvas ref="chartCanvas"></canvas>

              <div class="mt-4">
                <p>
                  <strong>Total Sales for This Month:</strong> ${{ thisMonthTotal }}
                </p>
                <p>
                  <strong>Total Sales for Previous Month:</strong> ${{ previousMonthTotal }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from "vue";
import { Menu, Plus, FileText, CheckCircle } from "lucide-vue-next";
import { useRouter } from "vue-router";
import Chart from "chart.js/auto";

const router = useRouter();

const stats = ref([]);
const categories = ref([]);
const brands = ref([]);
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", active: true },
  { name: "POS System", path: "/pos-system", icon: "CreditCard" },
  { name: "Products", path: "/products", icon: "Package" },
  { name: "Orders", path: "/orders", icon: "ShoppingCart" },
  { name: "Customers", path: "/customers", icon: "Users" },
  { name: "Reports", path: "/reports", icon: "BarChart" },
];

// Reactive search query
const searchQuery = ref("");
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Sales Data
const chartCanvas = ref(null);
const thisMonthTotal = ref(0);
const previousMonthTotal = ref(0);

const loadSalesData = () => {
  const storedData = localStorage.getItem("salesData");
  return storedData ? JSON.parse(storedData) : null;
};

onMounted(() => {
  const storedStats = localStorage.getItem("stats");
  stats.value = storedStats ? JSON.parse(storedStats) : [];

  const storedCategories = localStorage.getItem("categories");
  categories.value = storedCategories ? JSON.parse(storedCategories) : [];

  const storedBrands = localStorage.getItem("brands");
  brands.value = storedBrands ? JSON.parse(storedBrands) : [];

  const salesData = loadSalesData();

  if (salesData && chartCanvas.value) {
    const thisMonth = salesData.thisMonth;
    const previousMonth = salesData.previousMonth;

    thisMonthTotal.value = thisMonth.cashOnDelivery + thisMonth.mobilePayment + thisMonth.other;
    previousMonthTotal.value = previousMonth.cashOnDelivery + previousMonth.mobilePayment + previousMonth.other;

    const chartData = {
      labels: ["Cash on Delivery", "Mobile Payment", "Other"],
      datasets: [
        {
          data: [thisMonth.cashOnDelivery, thisMonth.mobilePayment, thisMonth.other],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF4567", "#3B85D1", "#FFB84F"],
        },
      ],
    };

    new Chart(chartCanvas.value, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `$${tooltipItem.raw.toLocaleString()}`,
            },
          },
        },
      },
    });
  }
});
</script>

<style scoped>
/* Custom styles */
</style>
