import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyTabs from '@/components/Tabs.vue'

describe('Tabs.vue', () => {
  it('emits "change" with item.active = true when index=0', async () => {
    // 1) Mount the component and stub UTabs
    const wrapper = mount(MyTabs, {
      global: {
        stubs: {
          UTabs: {
            name: 'UTabs',
            // 2) Minimal stub: let's simulate user picking a tab
            template: `
              <div data-testid="tabs-stub">
                <button @click="$emit('change', 0)">Tab 0</button>
                <button @click="$emit('change', 1)">Tab 1</button>
              </div>
            `,
          },
        },
      },
    })

    // 3) Find our stub wrapper
    const stub = wrapper.find('[data-testid="tabs-stub"]')
    expect(stub.exists()).toBe(true)

    // 4) Click the first "Tab 0" => triggers `@change="onChange"` with index=0
    await stub.find('button').trigger('click')

    // 5) Check that MyTabs emitted "change" with [true]
    // Because items[0].active = true
    expect(wrapper.emitted().change).toBeTruthy()
    expect(wrapper.emitted().change![0]).toEqual([true])
  })

  it('emits "change" with item.active = false when index=1', async () => {
    const wrapper = mount(MyTabs, {
      global: {
        stubs: {
          UTabs: {
            name: 'UTabs',
            template: `
              <div data-testid="tabs-stub">
                <button @click="$emit('change', 0)">Tab 0</button>
                <button @click="$emit('change', 1)">Tab 1</button>
              </div>
            `,
          },
        },
      },
    })

    const stub = wrapper.find('[data-testid="tabs-stub"]')
    expect(stub.exists()).toBe(true)

    // Click the second button => index=1 => items[1].active = false
    await stub.findAll('button')[1].trigger('click')

    expect(wrapper.emitted().change).toBeTruthy()
    expect(wrapper.emitted().change![0]).toEqual([false])
  })
})
