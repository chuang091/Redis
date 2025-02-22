<script setup lang="ts">
import { useImages } from '~/composables/useImages';
import ImageCard from './ImageCard.vue';

const props = defineProps({
  active: Boolean,
  page: Number,
});

const { images, loading, update } = useImages(props.active, props.page ?? 1);

// watch page
watch(
  () => props.page,
  (newPage) => {
    update(props.active, newPage ?? 1);
  },
  { immediate: true }
);

// watch active
watch(
  () => props.active,
  (newActive) => {
    update(newActive, props.page ?? 1);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div class="grid grid-cols-8 gap-4 my-2">
      <ImageCard v-for="image in images" :key="image._id" :image="image" :isLoading="loading" />
    </div>
  </div>
</template>
