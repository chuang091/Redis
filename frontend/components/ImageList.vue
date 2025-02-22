<script setup lang="ts">
import { useImages } from '~/composables/useImages';
import ImageCard from './ImageCard.vue';

const { images, loading } = useImages();

const props = defineProps({
  active: Boolean,
  page: Number,
});
</script>

<template>
  <div>
    <div class="grid grid-cols-8 gap-4 my-2">
      <ImageCard v-for="image in images" :key="image.id" :image="image" :isLoading="true" />
    </div>
  </div>
</template>
