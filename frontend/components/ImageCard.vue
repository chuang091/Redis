<script setup lang="ts">
import type { Image } from '../types/image';
import UltraLoading from './UltraLoading.vue';

defineProps<{
  image: Image;
  isLoading: boolean;
}>();
</script>

<template>
  <UCard
    class="flex items-center justify-center aspect-square w-full rounded-lg overflow-hidden"
    :ui="{ body: { padding: 'py-0 sm:p-0' }  }"
  >
    <template v-if="isLoading">
      <div class="flex items-center justify-center">
        <UltraLoading 
        :size="100"
        class="text-gray-400 py-4"
        />
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center aspect-[1/1]">
        <img
        :src="image.url"
        class="object-cover w-full h-full aspect-[1/1]"
      />
      </div>
    </template>
  </UCard>
</template>
