<script setup lang="ts">
import type { Image } from '~/types/image';

defineProps<{ image: Image }>();
</script>

<template>
  <div class="p-2 border rounded-lg shadow-sm">
    <img :src="image.url" class="w-full h-40 object-cover rounded-md" />
    <p class="text-gray-500 text-sm">{{ image.createdAt }}</p>
  </div>
</template>
