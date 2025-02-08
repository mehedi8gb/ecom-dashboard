<template>
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-2/5 sm:w-64 bg-gray-900 text-white transition-all duration-300 flex-shrink-0 overflow-auto">
        <div class="p-2 sm:p-4">
          <div class="flex items-center gap-2 text-sm sm:text-xl font-bold">
            <div class="w-6 sm:w-8 h-6 sm:h-8 bg-red-500 rounded-lg"></div>
            <span class="ml-3">{{ shop.name ? shop.name + "'s" : 'ACTIVE' }}<span class="text-red-500">Platform</span></span>
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
        <router-link to="/" class=" mx-7 py-80  text-red-500 text-left block">Logout</router-link>
      </aside>
  
      <!-- Main Content -->
      <div class="flex-1 overflow-auto transition-all duration-300">
        <!-- Header (Sticky at Top, Outside of Main) -->
        <header class="bg-white border-b sticky top-0 z-10">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <!-- Add content if necessary -->
            </div>
            <div class="flex items-center space-x-4">
              <router-link to="/manageShop" class="w-9 h-9 rounded-full overflow-hidden cursor-pointer">
                <img 
                  v-if="shop.logo" 
                  :src="shop.logo" 
                  alt="Shop Logo" 
                  class="w-full h-full object-cover" />
                <img 
                  v-else 
                  src="/avatar-placeholder.png" 
                  alt="Default Logo" 
                  class="w-full h-full object-cover" />
              </router-link>
            </div>
          </div>
        </header>
  
        <!-- Dashboard Content -->
        <main class="p-4 mt-0.5">
    <div class="flex h-screen justify-center items-center bg-gradient-to-b from-red-800 to-red-950">
      <div class="min-h-screen bg-gradient-to-b from-red-800 to-red-950 flex flex-col items-center justify-center p-6 relative">
        
        <!-- Sparkles effect -->
        <div class="absolute inset-0 z-0">
          <div v-for="n in 12" :key="n" 
               class="absolute w-1 h-1 bg-yellow-200 rounded-full animate-twinkle"
               :style="`top: ${Math.random() * 100}%; left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 2}s`">
          </div>
        </div>

        <div class="max-w-2xl w-full space-y-8">
          <!-- Main section with spinner and results -->
          <div class="flex flex-col justify-center items-center">
            <!-- Spin Wheel -->
            <div class="relative w-80 h-80 flex justify-center items-center">
              <div
                class="w-full h-full border-4 border-gray-300 rounded-full flex justify-center items-center"
                :style="{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3s ease-out' : 'none' }"
              >
                <svg viewBox="0 0 100 100" class="absolute w-full h-full">
                  <g v-for="(item, index) in items" :key="index" :transform="`rotate(${(360 / items.length) * index}, 50, 50)`">
                    <path
                      :d="`M50,50 L100,50 A50,50 0 0,1 50,0 Z`"
                      :fill="index % 2 === 0 ? '#FF0000' : '#FFD700'"
                      stroke="black"
                      stroke-width="0.5"
                    />
                    <text x="75" y="25" text-anchor="middle" transform="rotate(90, 75, 25)" class="text-xs fill-black">{{ item }}</text>
                  </g>
                </svg>
              </div>
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#FFD700] w-2 h-8"></div>
            </div>

            <!-- Spin Button and Result Boxes -->
            <div class="w-full max-w-xs mt-4 flex flex-col items-center">
              <!-- Spin Button -->
              <button 
                @click="spin" 
                class="bg-yellow-500 text-black px-4 py-2 rounded disabled:bg-gray-400 hover:bg-yellow-400 relative z-10" 
                :disabled="spinsLeft === 0"
              >
                Spin ({{ spinsLeft }} left)
              </button>

              <div v-if="spinsLeft === 0" class="mt-2 text-yellow-200">No spins left. Please wait 24 hours for a reset.</div>

              <!-- Show results in 3 boxes -->
              <div class="flex mt-4 gap-4 w-full justify-center">
                <div v-for="(result, index) in results" :key="index" class="w-20 h-20 border-2 border-gray-300 flex items-center justify-center text-sm text-yellow-200">
                  {{ result }}
                </div>
              </div>
            </div>

            <div v-if="selectedItem" class="mt-4 text-lg font-bold text-yellow-300">
              You won: {{ selectedItem }}
            </div>
          </div>

          <!-- Editable Items button on the right side -->
          <div class="absolute mx-14 right-9 top-4">
            <button @click="toggleSidebar" class="bg-yellow-500 text-black px-4 py-2 rounded">
              {{ isSidebarOpen ? 'Hide Editable Items' : 'Show Editable Items' }}
            </button>
          </div>

          <!-- Collapsible Sidebar for Editable Items -->
          <div v-if="isSidebarOpen" class="absolute right-0 top-16 p-4 bg-white border shadow-lg max-w-xs">
            <label for="spin-items" class="text-sm font-medium text-yellow-800">Edit Spin Items:</label>
            <div v-for="(item, index) in items" :key="index" class="flex items-center mt-2">
              <input
                v-model="items[index]"
                type="text"
                class="px-4 py-2 border rounded"
                @input="saveItems"
              />
            </div>
          </div>
          
          <!-- Reset Button -->
           <div class="px-20">
          <button 
            @click="resetResults" 
            class="bg-red-500 text-white px-4 py-2 rounded mt-4 z-20 relative"
          >
            Reset Results
          </button>
        </div>
        </div>
      </div>
    </div>
  </main>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue';

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", active: true },
  { name: "Products", path: "/products", icon: "Package" },
  { name: "Orders", path: "/orders", icon: "ShoppingCart" },
  { name: "Customers", path: "/customers", icon: "Package" },
  { name: "Reports", path: "/reports", icon: "BarChart" },
  { name: "Manage Shop", path: "/manageShop", icon: "BarChart" },
  { name: "Cupon", path: "/cupon", icon: "BarChart" },
  { name: "Invoicing", path: "/invoicing", icon: "BarChart" },
  { name: "Lucky Spin", path: "/luckyspin", icon: "BarChart" },
];

const shop = ref({ name: "", logo: "" });
onMounted(() => {
  const savedShop = localStorage.getItem("shopData");
  if (savedShop) {
    shop.value = JSON.parse(savedShop);
  }
});

const searchQuery = ref("");
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const items = ref(["Item-1", "Item-2", "Item-3", "Item-4", "Item-5", "Item-6", "Item-7", "Item-8"]);
const rotation = ref(0);
const spinning = ref(false);
const selectedItem = ref(null);
const spinsLeft = ref(3);
const results = ref([null, null, null]);
const isSidebarOpen = ref(false);

onMounted(() => {
  const lastSpinDate = localStorage.getItem('lastSpinDate');
  const today = new Date().toISOString().split('T')[0];

  if (lastSpinDate !== today) {
    localStorage.setItem('spinsLeft', 10);
    localStorage.setItem('lastSpinDate', today);
    results.value = [null, null, null];
  }

  spinsLeft.value = parseInt(localStorage.getItem('spinsLeft')) || 3;
  const savedItems = JSON.parse(localStorage.getItem('spinItems'));
  if (savedItems) {
    items.value = savedItems;
  }

  const savedResults = JSON.parse(localStorage.getItem('spinResults'));
  if (savedResults) {
    results.value = savedResults;
  }
});

const saveItems = () => {
  localStorage.setItem('spinItems', JSON.stringify(items.value));
};

const saveResults = () => {
  localStorage.setItem('spinResults', JSON.stringify(results.value));
};

const spin = () => {
  if (spinning.value) return;

  spinning.value = true;
  const randomSpin = Math.floor(1800 + Math.random() * 1800);
  rotation.value += randomSpin;

  setTimeout(() => {
    spinning.value = false;
    const totalRotation = rotation.value % 360;
    const segmentSize = 360 / items.value.length;
    const index = Math.floor((totalRotation + segmentSize / 2) / segmentSize) % items.value.length;
    selectedItem.value = items.value[index];

    results.value.push(selectedItem.value);
    if (results.value.length > 3) results.value.shift();
    saveResults();
  }, 3000);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const resetResults = () => {
  results.value = [null, null, null]; // Reset results
  localStorage.setItem('spinResults', JSON.stringify(results.value)); // Save reset results in localStorage
};
</script>
  
  <style scoped>
  .text-xs {
    font-size: 5px;
  }
  .fill-black {
    fill: black;
  }
  
  .min-h-screen {
    position: relative;
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  
  .animate-twinkle {
    animation: twinkle 2s infinite;
  }
  </style>
  