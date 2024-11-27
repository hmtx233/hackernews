// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // SSR渲染。 若设置为false, 则表示单页开发
    ssr: true,
    // 开启devtool
    devtools: {enabled: true},
    // 自定义端口
    devServer: {
        port: 4002
    },
    // 加载模块
    modules: [
        '@nuxt/ui',
        '@nuxtjs/color-mode',
        '@nuxtjs/tailwindcss',
        'nuxt-gtag',
        '@nuxtjs/i18n'
    ],
    // 自定义css
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

    // gtag 统计
    gtag: {
        id: 'G-R60WDDBRWE',
    },

    // i18n配置
    i18n: {
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

    // 客户端配置
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

    // 运行时配置
    runtimeConfig: {
        txSecretId: process.env.NUXT_TX_SECRET_ID || "",
        txSecretKey: process.env.NUXT_TX_SECRET_KEY || "",
        translateToken: process.env.NUXT_TRANSLATE_TOKEN || "",
        apiUrl: process.env.NUXT_API_URL || "",
        deepSeekApi: process.env.NUXT_DEEP_SEEK_API || "",
        deepSeekToken: process.env.NUXT_DEEP_SEEK_TOKEN || "",
        public: {},
    },

    compatibilityDate: '2024-11-25',
})