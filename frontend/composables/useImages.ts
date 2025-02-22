export function useImages(initialActive: boolean, initialPage: number) {
  const images = ref<any[]>([]);
  const loading = ref(false);
  const active = ref(initialActive); 
  const page = ref(initialPage);

  const fetchImages = async () => {
    console.log(`🔍 Fetching images for page ${page.value} and active ${active.value}`);
    loading.value = true;
    try {
      const response = await fetch(`/api/images?page=${page.value}&active=${active.value}`);
      const data = await response.json();
      images.value = data.message ? [] : data;
    } catch (error) {
      console.error('❌ Failed to fetch images:', error);
    } finally {
      loading.value = false;
    }
  };

  watch([active, page], fetchImages, { immediate: true });

  const update = (newActive: boolean, newPage: number) => {
    active.value = newActive;
    page.value = newPage;
  };

  return { images, loading, update };
}
