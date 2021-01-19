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
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Llano Estacado RV Park - Lubbock, TX",
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
        content: "",
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
      solid: ["faMapMarkerAlt", "faPhoneSquare", "faEnvelope"],
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
