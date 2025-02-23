import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/components/Pagination.vue'

describe('Pagination.vue', () => {
  it('emits `update:modelValue` when the user changes pages', async () => {
    // 1) Mount component with default props
    const wrapper = mount(Pagination, {
      props: {
        modelValue: 1,
        total: 100,
        perPage: 10,
      },
      global: {
        // 2) Stub UPagination to simplify the test
        // We'll simulate a user clicking on a next page button
        stubs: {
          UPagination: {
            name: 'UPagination',
            template: `
              <div data-testid="pagination-stub" @click="$emit('update:modelValue', 2)">
                Stubbed UPagination
              </div>
            `,
          },
        },
      },
    })

    // 3) Find our stub
    const paginationStub = wrapper.find('[data-testid="pagination-stub"]')
    expect(paginationStub.exists()).toBe(true)

    // 4) Simulate the user changing pages (click triggers update:modelValue)
    await paginationStub.trigger('click')

    // 5) Check that the component emitted update:modelValue with [2]
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([2])
  })
})
