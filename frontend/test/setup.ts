import { setup } from '@nuxt/test-utils'

export default async () => {
  await setup({
    server: true,  
    browser: false,
    watch: true,
 })
}
