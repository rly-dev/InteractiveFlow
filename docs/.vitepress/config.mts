import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "InteractiveFlow",
    description: "Declarative Discord.js Containers & Stateful Pagination",
    base: "/InteractiveFlow/", // For GitHub Pages basic deployment
    themeConfig: {
        logo: '/banner.svg', // Will use the banner or a smaller icon if available
        siteTitle: 'InteractiveFlow',

        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API Reference', link: 'https://github.com/rly-dev/InteractiveFlow#api-reference' },
            // Link to README API section for now, or build a dedicated API page later
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'Getting Started', link: '/guide/getting-started' },
                ]
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'FlowContainer', link: '/guide/flow-container' },
                    { text: 'FlowPaginator', link: '/guide/flow-paginator' },
                ]
            },
            {
                text: 'Examples',
                items: [
                    { text: 'Basic Usage', link: 'https://github.com/rly-dev/InteractiveFlow/tree/main/examples' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/rly-dev/InteractiveFlow' }
        ],

        footer: {
            message: 'Released under the GPL-3.0 License.',
            copyright: 'Copyright © 2024-present rly-dev'
        },

        search: {
            provider: 'local'
        }
    },
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ]
})
