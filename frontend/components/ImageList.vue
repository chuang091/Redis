<script setup lang="ts">
import { useImages } from '~/composables/useImages';
import ImageCard from './ImageCard.vue';

const props = defineProps({
  active: Boolean,
  page: Number,
});

const { images: rawImages, loading, update } = useImages(props.active, props.page ?? 1);

const images = computed(() =>
  rawImages.value.map(image => ({
    id: image._id,
    url: image.url,
    createdAt: image.createdAt,
  }))
);

// watch page and active changes
watch(
  [() => props.page, () => props.active],
  () => {
    update(props.active, props.page ?? 1);
  },
  { immediate: true }
);



</script>

<template>
  <div>
    <div class="grid grid-cols-8 gap-4 my-2">
      <ImageCard v-for="image in images" :key="image.createdAt" :image="image" :isLoading="loading" />
    </div>
  </div>
</template>
