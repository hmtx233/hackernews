// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //SSR渲染。 若设置为false, 则表示单页开发
  ssr: true,
  devtools: { enabled: true },
  devServer: {
    port: 4002
  },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'nuxt-gtag',
    '@nuxtjs/i18n'
  ],
  tailwindcss: {
    config: {
      theme: {
        screens: {
          '3xs': '200px',
          '2xs': '400px',
          'xs': '520px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        }
      },
    },
  },
  gtag: {
    id: 'G-R60WDDBRWE',
  },
  i18n: {
    // defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'zh',
        name: '简体中文'
      }
    ]
  },
  app: {
    head: {
      script: [
        {
          src: 'https://us.umami.is/script.js',
          defer: true,
          'data-website-id': '1f1a2aac-3834-4fb4-a6e4-54ce73e70cbd'
        }
      ]
    }
  },
})
