
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
    <div class="flex-1 overflow-auto transition-all duration-300">
      <!-- Header (Sticky at Top, Outside of Main) -->
      <header class="bg-white border-b sticky top-0 z-10">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <!-- Add content if necessary -->
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
      <main class="p-4 mt-0.5">
            
        <div class="container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Sales Report</h1>

    <!-- Monthly Income Table -->
    <div class="grid grid-cols-7 gap-6 mb-8">
      <div v-for="day in daysInMonth" :key="day" class="text-center">
        <p class="text-lg font-small text-gray-700 mb-2">Day {{ day }}</p>
        <input
          type="number"
          v-model="income[day - 1]"
          @input="handleInput(day - 1)"
          class="w-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-300"
          :placeholder="'Enter income for day ' + day"
        />
      </div>
    </div>

    <!-- Total Income and Store Button -->
    <div class="text-center mb-8">
      <p class="text-xl font-semibold text-gray-800">Total Income: ${{ formatNumber(totalIncome) }}</p>
      <button
        @click="confirmStoreAsPreviousMonthSales"
        class="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Store as Previous Month Sales
      </button>
    </div>

    <!-- Previous Month Sales Display -->
    <div class="text-center mb-8">
      <p class="text-lg font-semibold text-gray-600">Previous Month Sales: ${{ formatNumber(previousMonthSales) }}</p>
    </div>

    <!-- Sales Comparison -->
    <div v-if="previousMonthSales > 0" class="text-center mb-8">
      <p
        v-if="totalIncome > previousMonthSales"
        class="text-lg font-semibold text-blue-600"
      >
        Current month sales are higher by ${{ formatNumber(totalIncome - previousMonthSales) }}
      </p>
      <p
        v-if="totalIncome < previousMonthSales"
        class="text-lg font-semibold text-yellow-600"
      >
        Current month sales are lower by ${{ formatNumber(previousMonthSales - totalIncome) }}
      </p>
      <p
        v-if="totalIncome === previousMonthSales"
        class="text-lg font-semibold text-gray-600"
      >
        Current month sales are equal to previous month's sales.
      </p>
    </div>

    <!-- Payment Methods (Cash on Delivery, Mobile Pay, Cash on Store) -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="(payment, index) in paymentMethods"
        :key="index"
        class="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ payment.name }}</h3>
        <input
          type="number"
          v-model="payment.amount"
          @input="handleInput(payment)"
          class="w-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4 transition duration-300"
          :placeholder="'Enter ' + payment.name + ' amount'"
        />
        <div class="flex justify-center gap-6 mb-4">
          <button
            @click="addPaymentAmount(payment)"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Add
          </button>
          <button
            @click="resetPaymentAmount(payment)"
            class="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-300"
          >
            Reset
          </button>
        </div>
        <p class="text-lg font-semibold text-gray-600">Total {{ payment.name }}: ${{ formatNumber(payment.sum) }}</p>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-8 rounded-lg shadow-xl w-96 max-w-lg">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Are you sure?</h3>
        <p class="text-lg text-gray-700 mb-6">Are you sure you want to store the current month's total income as the previous month's sales?</p>
        <div class="flex justify-between gap-4">
          <button
            @click="storeAsPreviousMonthSales"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Yes
          </button>
          <button
            @click="showConfirmation = false"
            class="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition duration-300"
          >
            No
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

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "LayoutDashboard", active: true },
  { name: "Products", path: "/products", icon: "Package" },
  { name: "Orders", path: "/orders", icon: "ShoppingCart" },
  { name: "Customers", path: "/customers", icon: "Package" },
  { name: "Reports", path: "/reports", icon: "BarChart" },
  { name: "Manage Shop", path: "/manageShop", icon: "BarChart" },
  { name: "Cupon", path: "/cupon", icon: "BarChart" },
  { name: "Invoicing", path: "/invoicing", icon: "BarChart" },
];

// Reactive search query
const searchQuery = ref("");
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});


import { ref, computed } from 'vue'

// Array to store the income for each day of the month (1 to 31)
const income = ref(new Array(31).fill(0))  // 31 days in the month

// Store previous month's sales, initialize to 0
const previousMonthSales = ref(0)

// Payment methods and their amounts
const paymentMethods = ref([
  { name: 'Cash on Delivery', amount: 0, sum: 0 },
  { name: 'Mobile Pay', amount: 0, sum: 0 },
  { name: 'Cash on Store', amount: 0, sum: 0 },
])

// Function to format numbers to 2 decimal places
const formatNumber = (value) => {
  return value.toFixed(2)
}

// Calculate the total income for the month
const totalIncome = computed(() => {
  return income.value.reduce((sum, dailyIncome) => sum + dailyIncome, 0)
})

// Array representing days 1 to 31 of the month
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

// Flag to handle the confirmation modal
const showConfirmation = ref(false)

// Handle input event: if input is empty, set to 0
const handleInput = (index) => {
  if (income.value[index] === "") {
    income.value[index] = 0
  }
}

// Handle input event for payment methods
const handleInputPayment = (payment) => {
  if (payment.amount === "") {
    payment.amount = 0
  }
}

// Add the entered payment amount to the corresponding sum
const addPaymentAmount = (payment) => {
  payment.sum += parseFloat(payment.amount)
  payment.amount = 0 // Reset the input field after adding the amount
}

// Reset the payment amount for the specific method
const resetPaymentAmount = (payment) => {
  payment.sum = 0
  payment.amount = 0
}

// Function to store the total income as previous month's sales and reset the income
const storeAsPreviousMonthSales = () => {
  previousMonthSales.value = totalIncome.value // Store the total income as previous month's sales
  income.value = new Array(31).fill(0) // Reset the income values for the new month
  paymentMethods.value.forEach(payment => {
    payment.sum = 0 // Reset all payment method sums
  })
  showConfirmation.value = false // Close the confirmation modal
}

// Show the confirmation modal
const confirmStoreAsPreviousMonthSales = () => {
  showConfirmation.value = true
}

</script>



















<style scoped>
/* General container styles */
.container {
  max-width: 1200px;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 16px;
}

/* Inputs and buttons */
input[type="number"] {
  width: 100%;
  text-align: center;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

button {
  cursor: pointer;
}

/* Card style for payment methods */
.bg-white {
  background-color: #fff;
}

/* Input transition */
input[type="number"]:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

</style>