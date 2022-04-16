import { defineNuxtConfig } from 'nuxt3'
export default defineNuxtConfig({
  // meta: {
  //   title: 'Vitesse Nuxt 3',
  // },
  meta: {
    title: 'BA Evaluation',
  },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    'floating-vue/nuxt',
  ],
  vueuse: {
    ssrHandlers: true,
  },
  ssr: true,
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
  },
  privateRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
  },
  unocss: {
    webFonts: {
      provider: 'google',
      fonts: {
        mulish: 'Mulish:200,300,400,500,600,700,800,900',
      },
    },
    uno: true,
    icons: {
      scale: 1.2,
    },
    attributify: true,
    preflight: true,
    shortcuts: [
      ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ],
  },

})
