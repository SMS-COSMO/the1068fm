// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@unocss/nuxt',
    'radix-vue/nuxt'
  ],
  build: {
    transpile: ['trpc-nuxt'],
  },
  devtools: { enabled: true }
})
