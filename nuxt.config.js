import axios from "axios";

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",
  ssr: false,
  server: {
    port: 8088,
  },
  publicRuntimeConfig: {
    functionsURL:
      process.env.NODE_ENV == "development"
        ? process.env.FIREBASE_FUNCTIONS_DEV
        : process.env.FIREBASE_FUNCTIONS_PROD,
    firestoreURL: process.env.FIRESTORE,
    monthlyRate: process.env.MONTHLY_RATE,
    weeklyRate: process.env.WEEKLY_RATE,
    recaptcha: process.env.RECAPTCHA_SITE_KEY,
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
          "https://fonts.googleapis.com/css2?family=Martel:wght@400;700&family=Montserrat:wght@500;600;700;800;900&display=swap",
      },
      {
        href: "https://unpkg.com/vueperslides/dist/vueperslides.css",
        rel: "stylesheet",
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "~/plugins/google-maps", ssr: false },
    { src: "~/plugins/v-calendar.js", ssr: false },
    { src: "~/plugins/vue-fabric.js", ssr: false },
    // { src: "~/plugins/vue-konva.js", ssr: false },
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
    "@nuxtjs/style-resources",
    "@nuxtjs/fontawesome",
    "@nuxtjs/firebase",
    "@nuxtjs/axios",
    "bootstrap-vue/nuxt",
    "@nuxtjs/dayjs",
    "@nuxtjs/recaptcha",
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },
  dayjs: {
    weekStart: 1,
    defaultLocale: "en",
    defaultTimeZone: "America/Chicago",
    plugins: ["utc", "timezone"],
  },
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    hideBadge: false,
    language: "en",
    version: 2,
    size: "normal",
  },

  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
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
        emulatorPort: process.env.NODE_ENV === "development" ? 9099 : undefined,
        emulatorHost: "http://localhost",
      },
      firestore: {
        enablePersistence: true,
        settings: {
          host:
            process.env.NODE_ENV === "development"
              ? "localhost:8080"
              : undefined,
          ssl: process.env.NODE_ENV === "development" ? false : undefined,
        },
        // emulatorPort: process.env.NODE_ENV === "development" ? 8080 : undefined,
      },
    },
  },

  fontawesome: {
    icons: {
      solid: [
        "faMapMarkerAlt",
        "faPhoneSquare",
        "faEnvelope",
        "faCalendarAlt",
        "faTable",
        "faExclamationCircle",
        "faUserFriends",
        "faCoins",
        "faTint",
        "faUtensils",
        "faBolt",
        "faMoneyBillWave",
        "faExpandArrowsAlt",
        "faCaravan",
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
  generate: {
    fallback: true,
  },
};
