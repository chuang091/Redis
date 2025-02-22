import { ref, onMounted } from 'vue';
import type { Image } from '~/types/image';

export const useImages = () => {
  const images = ref<Image[]>([]);
  const loading = ref(false);

  const fetchImages = async () => {
    loading.value = true;
    const res = await fetch('/api/images');
    images.value = await res.json();
    loading.value = false;
  };

  onMounted(fetchImages);

  return { images, fetchImages, loading };
};
