<script setup lang="ts">
import { ref } from 'vue';
import UploadButton from '~/components/UploadButton.vue';
import ImageList from '~/components/ImageList.vue';
import Tabs from '~/components/Tabs.vue';
import Pagination from '~/components/Pagination.vue';

const active = ref(true);


const page = ref(1);
const totalItems = ref(100); // 總圖片數量
const perPage = ref(10); // 每頁顯示數量

const onPageChange = (newPage: number) => {
  page.value = newPage;
  console.log(`🔄 Page changed to: ${newPage}`);
};


</script>

<template>
  <div class="p-6 flex flex-col h-screen">
    <!-- Tabs & Upload Button Row -->
    <div class="flex justify-between items-center">
      <Tabs @change="active = $event" class="flex-grow" />
      <UploadButton class="ml-4" />
    </div>

    <!-- Image List (Takes Full Height) -->
    <div class="flex-grow overflow-y-auto mt-4">
      <ImageList
      :active="active" 
      :page="page"
      class="w-full h-full" 
      />
    </div>

    <!-- Pagination (Centered) -->
    <div class="flex justify-center mt-4">
      <Pagination :model-value="page" :total="totalItems" :per-page="perPage" @update:model-value="onPageChange" />
    </div>
  </div>
</template>
