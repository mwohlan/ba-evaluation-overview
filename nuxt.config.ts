import { defineNuxtConfig } from 'nuxt3'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import presetAttributify from '@unocss/preset-attributify'
import presetWebFonts from '@unocss/preset-web-fonts'

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
    presets: [
      presetUno(),
      presetIcons({
        scale: 1.2,
      }),
      presetAttributify(),
      presetWebFonts({
        provider: 'google',
        fonts: {
          openSans: 'Open Sans:200,300,400,500,600,700,800,900',
          mulish: 'Mulish:200,300,400,500,600,700,800,900',
          sourceSansPro: 'Source Sans Pro:200,300,400,500,600,700,800,900',
        },
      }),

    ],
    preflight: true,
    shortcuts: [
      ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ],
  },

})
