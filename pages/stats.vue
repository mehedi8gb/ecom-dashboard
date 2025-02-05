<template>
  <div>
    <!-- Content for stats will go here -->
  </div>
</template>

<script setup>
onMounted(() => {
  const stats = [
    { title: 'Total Customer', value: '1555' },
    { title: 'Total Products', value: '17888888888' },
    { title: 'Total Sales', value: '6.999K' },
    { title: 'Total Sellers', value: '16600' },
  ];
  localStorage.setItem('stats', JSON.stringify(stats));
});
</script>

<style>
/* Add styles if needed */
</style>
