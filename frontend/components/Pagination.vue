<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: 1 }, // 當前頁數
  total: { type: Number, default: 100 }, // 總數量
  perPage: { type: Number, default: 10 }, // 每頁顯示數量
});

const emit = defineEmits(['update:modelValue']);

const onPageChange = (newPage: number) => {
  emit('update:modelValue', newPage);
};
</script>

<template>
  <div class="flex justify-center">
    <UPagination
      :first-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'First', color: 'gray' }"
      :last-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Last', color: 'gray' }"
      :model-value="modelValue"
      :total="total"
      :page-count="Math.ceil(total / perPage)"
      show-first
      show-last
      @update:model-value="onPageChange"
    />
  </div>
</template>
