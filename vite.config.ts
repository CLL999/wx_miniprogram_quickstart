import uni from '@dcloudio/vite-plugin-uni'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import postcssRemToResponsivePixel from 'postcss-rem-to-responsive-pixel'
import tailwindcss from 'tailwindcss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import postcssWeappTailwindcssRename from 'weapp-tailwindcss-webpack-plugin/postcss'
import vwt from 'weapp-tailwindcss-webpack-plugin/vite'

const isH5 = process.env.UNI_PLATFORM === 'h5'

function omitFalse<T>(array: Array<T | false>): T[] {
  const excluded: T[] = []
  for (const item of array) {
    if (item) excluded.push(item)
  }
  return excluded
}
export default defineConfig({
  root: process.cwd(),
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
    },
  },
  plugins: omitFalse([
    // Components 要在 uni 前面，否则会导致 uni 无法识别组件
    Components({
      dts: 'src/types/components.d.ts',
      dirs: ['src/components'],
    }),

    uni({
      vueOptions: {
        reactivityTransform: true,
      },
    }),
    !isH5 && vwt(),

    AutoImport({
      imports: [
        'vue',
        'pinia',
        'uni-app',
        {
          '@vue/apollo-composable': ['useQuery', 'useMutation', 'useApolloClient'],
        },
        {
          '@apollo/client/core': ['ApolloError', 'NetworkStatus'],
        },
        {
          immer: ['produce'],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/assets/**',
        'src/hooks/**',
        'src/stores',
        'src/graphql/documents/**',
        'src/constants',
        'src/utils/**',
      ],
      vueTemplate: true,
    }),
  ]),
  css: {
    postcss: {
      plugins: omitFalse([
        tailwindcss(),
        autoprefixer(),
        !isH5 &&
          postcssRemToResponsivePixel({
            rootValue: 32,
            propList: ['*'],
            transformUnit: 'rpx',
          }),
        !isH5 &&
          (postcssWeappTailwindcssRename({
            cssPreflight: { 'box-sizing': 'content-box' },
          }) as any),
      ]),
    },
  },
})
