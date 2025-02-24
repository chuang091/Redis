<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const loading = ref(false);

const resetImages = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
    });
    const data = await response.json();

    console.log('🔄 Reset Data:', data);
    toast.success(`${data.statusMessage || '✅ Images reset successfully'}`, { autoClose: 2000 });

  } catch (error) {
    console.error('❌ Failed to reset images:', error);
    toast.error('❌ Failed to reset images!', { autoClose: 2500 });
  } finally {
    loading.value = false;
  }
};

const addMoreImages = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/generate-heavy', {
      method: 'POST',
    });
    const data = await response.json();

    console.log('🚀 Add More Data:', data);
    if (data.status === 'error') {
      toast.error(data.message || '❌ Failed to generate images!', { autoClose: 2500 });
    } else {
      toast.success(`${data.statusMessage || '✅ More images added successfully'}`, { autoClose: 2000 });
    }

  } catch (error) {
    console.error('❌ Failed to add more images:', error);
    toast.error('❌ Failed to generate images!', { autoClose: 2500 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex gap-4">
    <UButton data-testid="resetBtn" :loading="loading" size="md" class="mb-2" @click="resetImages">
      🔄 Reset Images to Default
    </UButton>

    <UButton data-testid="addBtn" :loading="loading" size="md" class="mb-2" @click="addMoreImages">
      ➕ Add More Images
    </UButton>
  </div>
</template>