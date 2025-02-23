import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Buttons from '@/components/UploadButton.vue'
import { toast } from 'vue3-toastify'

// Mock vue3-toastify
vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock fetch by default
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({ statusMessage: 'Some success message' }),
  })
})

describe('UploadButton.vue', () => {
  it('calls resetImages API and shows success toast', async () => {
    const wrapper = mount(Buttons, {
      global: {
        // 1) Stub the custom UButton, so it renders as a normal <button>
        stubs: {
          UButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    // 2) Select the button via data-testid
    const resetButton = wrapper.find('[data-testid="resetBtn"]')
    expect(resetButton.exists()).toBe(true)

    // 3) Click the button
    await resetButton.trigger('click')

    // Wait a tick for state updates
    await wrapper.vm.$nextTick()

    // 4) Check fetch call
    expect(global.fetch).toHaveBeenCalledWith('/api/generate', { method: 'POST' })

    // 5) Check toast
    expect(toast.success).toHaveBeenCalledWith('Some success message', { autoClose: 2000 })
  })

  it('calls addMoreImages API and shows success toast', async () => {
    const wrapper = mount(Buttons, {
      global: {
        stubs: {
          UButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    const addButton = wrapper.find('[data-testid="addBtn"]')
    expect(addButton.exists()).toBe(true)

    await addButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(global.fetch).toHaveBeenCalledWith('/api/generate-heavy', { method: 'POST' })
    expect(toast.success).toHaveBeenCalledWith('Some success message', { autoClose: 2000 })
  })

  it('handles fetch error gracefully', async () => {
    // Overwrite fetch to throw
    (global.fetch as any).mockRejectedValueOnce(new Error('Failed request'))

    const wrapper = mount(Buttons, {
      global: {
        stubs: {
          UButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    const resetButton = wrapper.find('[data-testid="resetBtn"]')
    await resetButton.trigger('click')
    await wrapper.vm.$nextTick()

    // fetch error => toast.error
    expect(toast.error).toHaveBeenCalledWith('❌ Failed to reset images!', { autoClose: 2500 })
  })
})
