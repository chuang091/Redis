// test/setup.ts
import { vi } from 'vitest'

// Mock any functions from #app you use, e.g. useFetch or useRuntimeConfig
vi.mock('#app', () => ({
  useFetch: vi.fn(() => Promise.resolve({ data: { value: [] } })),
  useRuntimeConfig: vi.fn(() => ({ public: { baseURL: 'http://localhost:3000' } })),
}))
