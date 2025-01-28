<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white">
      <div class="p-4">
        <div class="flex items-center gap-2 text-xl font-bold">
          <div class="w-8 h-8 bg-red-500 rounded-lg"></div>
          <span>ACTIVE<span class="text-red-500">ECOMMERCE</span></span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="px-4 mt-6">
        <input v-model="searchQuery" type="search" placeholder="Search in menu"
          class="w-full px-4 py-2 bg-gray-800 rounded-md text-sm" />
      </div>

      <!-- Menu Items -->
      <nav class="mt-6">
        <template v-for="(item, index) in filteredMenuItems" :key="index">
          <router-link :to="item.path" class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800"
            :class="{ 'bg-gray-800': item.active }">
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </template>
      </nav>
    </aside>
    <!--till this sidebar-->



    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <!-- Header -->
      <header class="bg-white border-b">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-gray-100 rounded-md">
              <Menu class="w-5 h-5" />
            </button>
            <nav class="flex space-x-4">
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


        <!-- Stats Grid -->
        <div class="grid grid-cols-4 gap-6 mb-6">
          <!-- Total Customer -->
          <router-link to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[0].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[0].title }}</p>
          </router-link>

          <!-- Total Products -->
          <router-link to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[1].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[1].title }}</p>
          </router-link>

          <!-- Total Sales -->
          <router-link to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[2].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[2].title }}</p>
          </router-link>

          <!-- Total Sellers -->
          <router-link to="/stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold mb-1">{{ stats[3].value }}</h3>
            <p class="text-gray-500 text-sm">{{ stats[3].title }}</p>
          </router-link>
        </div>



        <!-- Categories and Brands Section -->
        <div class="grid grid-cols-2 gap-6 mb-6">
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
        <div class="grid grid-cols-3 gap-6">
          <router-link to="orders-stats" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
            <h3 class="text-4xl font-bold text-purple-500 mb-2">153</h3>
            <p class="text-gray-500 mb-4">Total Order</p>
            <button class="w-full mt-4 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600">
              All Orders
            </button>
          </router-link>

          <div class="col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <router-link to="/sales_current_month" class="bg-white p-6 rounded-lg shadow-sm cursor-pointer">
              <h3 class="font-semibold">Sales this month</h3>
              <div class="h-64 flex items-end justify-between">
                <div v-for="i in 12" :key="i" class="w-8">
                  <div class="bg-blue-500 h-32" :style="{ height: `${Math.random() * 100}%` }"></div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Menu, Plus, FileText, CheckCircle } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const stats = [
  { title: 'Total Customer', value: '15' },
  { title: 'Total Products', value: '178' },
  { title: 'Total Sales', value: '6.9K' },
  { title: 'Total sellers', value: '100' },
];

const categories = [
  { name: 'Computer & Accessories', value: 2447110 },
  { name: 'Men Clothing & Fashion', value: 1901550 },
  { name: 'Cellphones & Tabs', value: 1494000 },
];

const brands = [
  { name: 'Samsung', value: 2008000 },
  { name: 'Nike', value: 983600 },
];

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', active: true },
  { name: 'POS System', path: '/pos-system', icon: 'CreditCard' },
  { name: 'Products', path: '/products', icon: 'Package' },
  { name: 'Orders', path: '/orders', icon: 'ShoppingCart' },
  { name: 'Customers', path: '/customers', icon: 'Users' },
  { name: 'Reports', path: '/reports', icon: 'BarChart' },
];

// Reactive search query
const searchQuery = ref('');

// Filter menu items based on search query
const filteredMenuItems = computed(() => {
  return menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
/* Custom styles */
</style>
