// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxt/scripts",
    "nuxt-purgecss",
    "@nuxt/rspack-builder",
  ],
  googleFonts: {
    preload: true,
    families: {
      Quicksand: "300..700",
    },
  },
  builder: 'rspack',
  colorMode: {
    classSuffix: "",
    storage: "cookie",
    preference: "system",
  },
  webpack: {
    analyze: true,
    optimizeCSS: true,
  },
  app: {
    head: {
      title: "SchoolAndFeedback",
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      charset: "utf-8",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "description", content: "SchoolAndFeedback" },
        { name: "robots", content: "index, follow" },
        { name: "author", content: "SchoolAndFeedback" },
        { name: "keywords", content: "SchoolAndFeedback" },
      ],
    },
  },
});