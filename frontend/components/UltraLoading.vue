<script setup lang="ts">
defineProps<{
  color?: string; 
  size?: number;
  strokeWidth?: number;
}>();

const defaultSize = 32;
const defaultStrokeWidth = 4;
</script>

<template>
  <svg
    class="spinner"
    viewBox="25 25 50 50"
    :stroke-width="strokeWidth || defaultStrokeWidth"
    :width="size || defaultSize"
    :height="size || defaultSize"
    :stroke="color || 'currentColor'"
  >
    <circle class="spinner-circle" cx="50" cy="50" r="20" />
  </svg>
</template>

<style scoped lang="scss">
.spinner {
  animation: spin 1.5s linear infinite;
}

.spinner-circle {
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dashoffset: -120px;
  }
}
</style>
