import { defineNuxtConfig } from "nuxt"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        head: {
            title: "HSAKA 2022",
            viewport: "width=device-width, initial-scale=1",
            charset: "utf-8",
            link: [
                {
                    rel: "stylesheet",
                    href: "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",
                },
            ],
        },
    },
})
