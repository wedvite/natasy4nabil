// const pkg = require('./package')
import { cfg, project, userData } from './wedvite.config.js'

let themeScssFile = 'index.scss'
if (project !== "demo" && userData?.theme) {
  themeScssFile = userData.theme === "custom" ? 'custom/index.scss' : `_${userData.theme}.scss`;
}

console.log(userData?.theme, { themeScssFile });

module.exports = {
  // router: {
  //   base: `/${cfg.name}`
  // },
  generate: {
    dir: `./dist`
  },
  server: {
    host: '0.0.0.0', // default: localhost
    port: process.env.PORT || '3001'
  },

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  /*
  ** Headers of the page
  */
  head: {
    title: cfg.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "Wedding Invitation Website (Wedvite)" },
      { name: 'keywords', content: 'Wedding Invitation Website, Fadzil Jusri, fadziljusri, wedvite, Freelancer, undangan kahwin, perkahwinan, ' + cfg.name },
      { name: 'author', content: 'Fadzil Jusri' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `/favicon.ico` }
    ],
    script: [
      // {src: '~/plugins/ics.deps.min', type: "text/javascript"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    `~assets/scss/themes/${themeScssFile}`,
    '~assets/scss/modal.scss',
    'bulma-modal-fx/dist/css/modal-fx.min.css'
  ],

  /*
  */
  plugins: [
    // "~/plugins/bulma-modal-fx"
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    // '@nuxtjs/axios',
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: [
            'faChevronRight',
            'faChevronLeft',
            'faCalendarAlt',
            'faAddressBook',
            'faMapMarkedAlt',
            'faPhoneSquare',
            'faCalendarCheck',
            'faSmileWink',
            'faFrown',
            'faMeh',
            'faComments'
          ]
        },
        {
          set: '@fortawesome/fontawesome-free-brands',
          icons: ['faWhatsapp', 'faTelegramPlane']
        }
      ]
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },


  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
