<template>
  <div>
    <!-- Content for categories will go here -->
  </div>
</template>

<script setup>
onMounted(() => {
  const categories = [
    { name: 'Computer & Accessories', value: 2447110 },
    { name: 'Men Clothing & Fashion', value: 1901550 },
    { name: 'Cellphones & Tabs', value: 1494000 },
    { name: 'Mobilephones & Tabs', value: 9999999 },
  ];
  localStorage.setItem('categories', JSON.stringify(categories));
});
</script>

<style>
/* Add styles if needed */
</style>
