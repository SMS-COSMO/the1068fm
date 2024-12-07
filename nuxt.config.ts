// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/color-mode',
  ],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    classSuffix: '',
    disableTransition: true,
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 512,
    },
  },

  imports: {
    dirs: ['types', 'constants'],
    presets: [
      {
        from: '@tanstack/vue-query',
        imports: ['useMutation', 'useQuery', 'useQueryClient', 'skipToken'],
      },
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
    ],
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  compatibilityDate: '2024-10-03',
});
