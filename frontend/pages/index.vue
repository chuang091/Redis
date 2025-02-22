<script setup lang="ts">
import UploadButton from '~/components/UploadButton.vue';
import ImageList from '~/components/ImageList.vue';
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Image Gallery</h1>
    <UploadButton />
    <ImageList />
  </div>
</template>
