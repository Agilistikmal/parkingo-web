// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  },

  modules: ["@nuxt/image", "@pinia/nuxt"],

  plugins: ["~/plugins/autoAnimate"],

  nitro: {
    preset: "bun",
  },

  // Fix serialization issues
  experimental: {
    payloadExtraction: false,
  },

  app: {
    keepalive: true,
  },
});
