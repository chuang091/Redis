import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageList from '~/components/ImageList.vue'
import UploadButton from '~/components/UploadButton.vue'
import { toast } from 'vue3-toastify'

describe('✅ UI Tests - Image Platform', () => {
  it('✅ Should display images on the homepage', async () => {
    const wrapper = mount(ImageList)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.image-card').length).toBeGreaterThan(0)
  })

  it('✅ Should show a toast when adding images', async () => {
    const wrapper = mount(UploadButton)
    await wrapper.find('button').trigger('click')
    expect(toast.success).toHaveBeenCalled()
  })
})
