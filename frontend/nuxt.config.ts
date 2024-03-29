import { defineNuxtConfig } from "nuxt"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            serverUrl: process.env.SERVER_URL || "https://backend.burg.games",
        },
    },
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
                {
                    rel: "stylesheet",
                    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css",
                    integrity:
                        "sha512-q3eWabyZPc1XTCmF+8/LuE1ozpg5xxn7iO89yfSOd5/oKvyqLngoNGsx8jq92Y8eXJ/IRxQbEC+FGSYxtk2oiw==",
                    crossorigin: "anonymous",
                    referrerpolicy: "no-referrer",
                },
            ],
        },
    },
})
