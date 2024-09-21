export default defineNuxtConfig({
  devtools: { enabled: true, componentInspector: false },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  veeValidate: {
    autoImports: true,
    componentNames: {
      Field: 'UiFormField',
    },
  },

  tailwindcss: {
    cssPath: '~/styles/tailwind.css',
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  hooks: {
    'components:dirs': (dirs) => {
      dirs.unshift({
        path: '~/components/ui',
        extensions: ['.vue'],
        prefix: 'Ui',
        pathPrefix: false,
      });
    },
  },

  build: {
    transpile: ['trpc-nuxt', 'vue-sonner'],
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  compatibilityDate: '2024-08-22',
});
