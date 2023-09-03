// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // using takeover mode from volar extension
  typescript: {
    shim: false,
    strict: true,
    typeCheck: true
  },

  modules: [
    '@nuxtjs/eslint-module'
  ]
})
