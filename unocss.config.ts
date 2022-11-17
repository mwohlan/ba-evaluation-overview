import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'



export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        mulish: 'Mulish:200,300,400,500,600,700,800,900',
      },
    }),
    presetUno(),
    presetAttributify(),
    presetTypography(),
  ],
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],

})
