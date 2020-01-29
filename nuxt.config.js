// const pkg = require('./package')
import { cfg } from './wedvite.config.js'

module.exports = {
  // router: {
  //   base: `/${cfg.name}`
  // },
  generate: {
    dir: `./dist`
  },
  server: {
    host: '0.0.0.0', // default: localhost
    port: '3001'
  },
  mode: 'spa',

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
    vendor: [],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
