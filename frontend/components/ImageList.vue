<script setup lang="ts">
import { useImages } from '~/composables/useImages';
import ImageCard from '~/components/ImageCard.vue';

const { images, loading } = useImages();
</script>

<template>
  <div>
    <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }"  v-if = "loading" />
    <div class="grid grid-cols-8 gap-4">
      <ImageCard v-for="image in images" :key="image.id" :image="image" />
    </div>
  </div>
</template>
