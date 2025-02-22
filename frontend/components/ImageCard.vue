<script setup lang="ts">

import type { Image } from '~/types';

defineProps<{
  image: Image;
}>();

</script>

<template>
    <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <img
      :src="image.url"
      class="object-cover w-full rounded-lg"
      style="aspect-ratio: 1 / 1"
    />
  </UCard>
  </template>
  
  
