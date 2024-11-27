import { render } from "vue";

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
  ],
  googleFonts: {
    preload: true,
    families: {
      Quicksand: "300..700",
    },
  },
  colorMode: {
    classSuffix: "",
    storage: "cookie",
    preference: "system",
  },
  webpack: {
    analyze: true,
    optimizeCSS: true,
  },
  hooks: {
    "build:manifest": (manifest) => {
      // find the app entry, css list
      const css = Object.values(manifest).find(
        (options) => options.isEntry
      )?.css;
      if (css) {
        // start from the end of the array and go to the beginning
        for (let i = css.length - 1; i >= 0; i--) {
          // if it starts with 'entry', remove it from the list
          if (css[i].startsWith("entry")) css.splice(i, 1);
        }
      }
    },
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