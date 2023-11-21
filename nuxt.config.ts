// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
  ],
  veeValidate: {
    autoImports: true,
    componentNames: {
      Field: 'UiFormField',
    },
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
    transpile: ['trpc-nuxt'],
  },
  devtools: { enabled: true }
})
