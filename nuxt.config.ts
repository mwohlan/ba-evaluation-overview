export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
 '@nuxtjs/fontaine',
  ],
  fontMetrics: {
    fonts: ['Mulish'],
  },
  experimental: {
    inlineSSRStyles: true,
  },
  vueuse: {
    ssrHandlers: false,
  },
  imports: {
    dirs: [
      'composables',
      'stores',
      'utility',
    ],
  },
  app: {
    head: {
      title: 'BA Evaluation',
    },
  },
  typescript: {
    shim: false,
  },
  unocss: {
    preflight: true,
  },
  ssr: false,
  runtimeConfig: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    public: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
    },
  },
})

