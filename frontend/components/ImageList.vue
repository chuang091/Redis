<script setup lang="ts">
import { useImages } from '~/composables/useImages';

const { images, loading } = useImages();
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div class="grid grid-cols-3 gap-4">
      <ImageCard v-for="image in images" :key="image.id" :image="image" />
    </div>
  </div>
</template>
