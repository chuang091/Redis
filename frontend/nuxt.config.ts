// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  nitro: {
    serveStatic: true,
    routeRules: {
      '/api/**': { cors: true }  // Enable CORS for all API routes
    }
  },

  modules: ['@nuxt/ui'],
})