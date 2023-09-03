// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    // using takeover mode from volar extension
    shim: false,
    strict: true,
    typeCheck: true
  },

  modules: [
    '@nuxtjs/eslint-module'
  ]
})
