import { ref, watch } from 'vue';
import { useFetch, useRuntimeConfig } from '#app';

let toast: any = null;
if (process.client) {
  import('vue3-toastify').then((module) => {
    toast = module.toast;
    import('vue3-toastify/dist/index.css');
  });
}

// Define API response type
interface ImageData {
  _id: string;
  url: string;
  createdAt: string;
}

interface ApiResponse {
  status?: 'success' | 'cache' | 'warn' | 'error';
  statusMessage?: string;
  images?: ImageData[];
}

export function useImages(initialActive: boolean, initialPage: number) {
  const images = ref<ImageData[]>([]);
  const loading = ref(false);
  const active = ref(initialActive);
  const page = ref(initialPage);
  const config = useRuntimeConfig(); // Get Nuxt runtime config

  // **Fetch images from API**
  const fetchImages = async () => {
    console.log(`🔍 Fetching images for page ${page.value} and active ${active.value}`);
    loading.value = true;
    images.value = [];

    try {
      const url = `${config.public.baseURL || ''}/api/images?page=${page.value}&active=${active.value}`;

      // Explicitly define the response type
      const { data, error } = await useFetch<ApiResponse>(url, {
        key: `images-${page.value}-${active.value}`,
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      if (!data.value || !data.value.status) {
        throw new Error('Invalid API response');
      }

      // Ensure `statusMessage` is always a valid string
      const message = data.value.statusMessage || 'No status message provided';
      const executionTime = data.value.executionTime || 'Not provided';

      // **Ensure toast is only used in client-side**
      if (process.client && toast) {
        switch (data.value.status) {
          case 'success':
            toast.success(`✅ ${message} \n ${executionTime}`, { autoClose: 1500 });
            break;
          case 'cache':
            toast.info(`⚡ ${message}  \n ${executionTime}`, { autoClose: 1500 });
            break;
          case 'warn':
            toast.warn(`⚠️ ${message}  \n ${executionTime}`, { autoClose: 2000 });
            break;
          case 'error':
            toast.error(`❌ ${message}  \n ${executionTime}`, { autoClose: 2500 });
            break;
          default:
            toast.info('ℹ️ Unexpected API response', { autoClose: 2000 });
        }
      }

      images.value = data.value.images || [];
    } catch (error) {
      console.error('❌ Failed to fetch images:', error);

      if (process.client && toast) {
        toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to load images!'}`, { autoClose: 2500 });
      }
    } finally {
      loading.value = false;
    }
  };

  // **Watch `active` and `page` changes and fetch data**
  watch([active, page], fetchImages, { immediate: true });

  // **Method to update state from the component**
  const update = (newActive: boolean, newPage: number) => {
    if (active.value !== newActive || page.value !== newPage) {
      active.value = newActive;
      page.value = newPage;
    }
  };

  return { images, loading, update };
}
