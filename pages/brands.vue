<template>
  <div>
    
  </div>
</template>

<script setup>
onMounted(() => {
  const brands = [
    { name: 'Samsung', value:  11111 },
    { name: 'Nike', value: 9999 },
    { name: 'Nike2', value: 9999 },
  ];
  localStorage.setItem('brands', JSON.stringify(brands));
});
</script>



<style>

</style>