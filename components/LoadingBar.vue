<script setup lang="ts">
</script>

<template>
  <div class="relative w-full h-1 bg-gray-200 overflow-hidden rounded">
    <div class="absolute top-0 left-0 h-full w-1/3 bg-brand animate-loading-bar"></div>
  </div>
</template>

<style scoped>
@keyframes loading-bar {
  0% {
    left: -33%;
  }

  50% {
    left: 50%;
  }

  100% {
    left: 100%;
  }
}

.animate-loading-bar {
  animation: loading-bar 1.5s infinite ease-in-out;
}
</style>
