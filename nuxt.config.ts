// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/eslint-module'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  components: [
    { path: '~/components/planner', pathPrefix: false },
    { path: '~/components/kostenvergleich', pathPrefix: false }
  ],

  routeRules: {
    '/': { prerender: true },
    '/wallbox': { prerender: true },
    '/auto-kostenvergleich': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  // eslint: {
  //   config: {
  //     stylistic: {
  //       commaDangle: 'never',
  //       braceStyle: '1tbs'
  //     }
  //   }
  // }
})