import axios from "axios";

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",
  ssr: false,
  server: {
    port: 8088,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Llano Estacado RV Park | Lubbock, TX",
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content:
          "Llano Estacado RV Park is the place to park your RV in Lubbock, TX. Convenient location, oversized spots, and locally owned.",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "Llano Estacado RV Park | Lubbock, TX",
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content:
          "Llano Estacado RV Park is the place to park your RV in Lubbock, TX. Convenient location, oversized spots, and locally owned.",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://www.llanoestacadorvpark.com/rv-driving-llano.jpg",
      },
      {
        hid: "twitter:image:alt",
        name: "twitter:image:alt",
        content: "Llano Estacado RV Park | Lubbock, TX",
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "Llano Estacado RV Park | Lubbock, TX",
      },
      {
        hid: "og:description",
        property: "og:description",
        content:
          "Llano Estacado RV Park is the place to park your RV in Lubbock, TX. Convenient location, oversized spots, and locally owned.",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://www.llanoestacadorvpark.com/rv-driving-llano.jpg",
      },
      {
        hid: "og:image:secure_url",
        property: "og:image:secure_url",
        content: "https://www.llanoestacadorvpark.com/rv-driving-llano.jpg",
      },
      {
        hid: "og:image:alt",
        property: "og:image:alt",
        content: "Llano Estacado RV Park | Lubbock, TX",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Martel:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800;900&display=swap",
      },
      {
        href: "https://unpkg.com/vueperslides/dist/vueperslides.css",
        rel: "stylesheet",
      },
    ],
    // script: [{
    //   charset: "utf-8",
    //   src: "https://widget.bandsintown.com/main.min.js",
    // }, ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "~/plugins/google-maps", ssr: false },
    { src: "~/plugins/v-calendar.js", ssr: false },
    // { src: "~/plugins/firebase.js", ssr: true },
  ],

  router: {
    middleware: "router-auth",
  },
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "@nuxtjs/style-resources",
    "@nuxtjs/fontawesome",
    "@nuxtjs/firebase",
    "bootstrap-vue/nuxt",
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },

  firebase: {
    config: {
      apiKey: "***REMOVED***",
      authDomain: "llano-estacado-rv-park.firebaseapp.com",
      projectId: "llano-estacado-rv-park",
      storageBucket: "llano-estacado-rv-park.appspot.com",
      messagingSenderId: "967435769392",
      appId: "1:967435769392:web:ea0d2e6dcdfce13c93bff5",
      databaseURL:
        "https://llano-estacado-rv-park-default-rtdb.firebaseio.com/",
    },
    services: {
      auth: {
        ssr: false,
        initialize: {
          onAuthStateChangedAction: "onAuthStateChanged",
          disableEmulatorWarnings: false,
        },
      },
      firestore: {
        enablePersistence: true,
      },
    },
  },

  fontawesome: {
    icons: {
      solid: [
        "faMapMarkerAlt",
        "faPhoneSquare",
        "faEnvelope",
        "faCaravan",
        "faMapSigns",
        "faHome",
        "faAtlas",
      ],
      brands: ["faGithub", "faInstagram"],
    },
  },

  styleResources: {
    scss: ["~/assets/scss/_variables.scss"],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [/^gmap-vue($|\/)/],
  },
  generate: {},
};
