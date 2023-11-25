// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
  ],
  veeValidate: {
    autoImports: true,
    componentNames: {
      Field: 'UiFormField',
    },
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
        pathPrefix: false
      })
    }
  },
  build: {
    transpile: ['trpc-nuxt', 'vue-sonner'],
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    devProxy: {
      '/liuzhijin': {
        target: 'https://music.liuzhijin.cn',
        changeOrigin: true,
      },
    }
  },
  devtools: { enabled: true }
})
