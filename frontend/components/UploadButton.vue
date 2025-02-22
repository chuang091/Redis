<script setup lang="ts">
import { ref, computed } from 'vue';

const files = ref<File[]>([]);
const uploadedUrls = ref<string[]>([]);
const uploading = ref(false);

// Computed property to safely generate preview URLs
const previewUrls = computed(() => files.value.map(file => URL.createObjectURL(file)));

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  files.value = Array.from(input.files);
};

const uploadFiles = async () => {
  if (files.value.length === 0) return;

  uploading.value = true;
  const formData = new FormData();

  files.value.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    uploadedUrls.value = [...uploadedUrls.value, ...data.urls];

    // Clear selected files after successful upload
    files.value = [];
  } catch (error) {
    console.error('Upload error:', error);
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="p-4 border rounded-lg shadow-md">
    <input 
      type="file" 
      @change="handleFileChange" 
      class="hidden" 
      id="fileInput" 
      multiple 
    />
    <label for="fileInput" class="p-2 bg-blue-500 text-white rounded cursor-pointer">
      📤 Select Images
    </label>

    <button 
      v-if="files.length > 0" 
      @click="uploadFiles" 
      class="p-2 bg-green-500 text-white rounded ml-2"
      :disabled="uploading"
    >
      ⬆️ {{ uploading ? 'Uploading...' : 'Upload' }}
    </button>

    <p v-if="uploading" class="mt-2 text-gray-500">Uploading, please wait...</p>

    <div v-if="previewUrls.length > 0" class="mt-4 grid grid-cols-3 gap-4">
      <div v-for="(url, index) in previewUrls" :key="index" class="relative">
        <img :src="url" class="w-32 h-32 object-cover rounded-lg" />
      </div>
    </div>

    <div v-if="uploadedUrls.length > 0" class="mt-4">
      <h3 class="text-lg font-semibold">Uploaded Images:</h3>
      <div class="grid grid-cols-3 gap-4">
        <img v-for="url in uploadedUrls" :key="url" :src="url" class="w-32 h-32 object-cover rounded-lg" />
      </div>
    </div>
  </div>
</template>
