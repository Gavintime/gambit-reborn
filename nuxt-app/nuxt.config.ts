// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['sanitize.css', 'sanitize.css/forms.css', 'sanitize.css/typography.css'],
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
