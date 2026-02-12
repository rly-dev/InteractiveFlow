import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "InteractiveFlow",
    description: "Declarative Discord.js Containers & Stateful Pagination",
    base: "/InteractiveFlow/",

    themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'InteractiveFlow',

        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'API Reference', link: 'https://github.com/rly-dev/InteractiveFlow#api-reference' },
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'Getting Started', link: '/guide/getting-started' },
                    { text: 'Migration Guide', link: '/guide/migration' },
                ]
            },
            {
                text: 'Core Concepts',
                items: [
                    { text: 'FlowContainer', link: '/guide/flow-container' },
                    { text: 'FlowPaginator', link: '/guide/flow-paginator' },
                    { text: 'Advanced Usage', link: '/guide/advanced-usage' },
                ]
            },
            {
                text: 'Help',
                items: [
                    { text: 'FAQ', link: '/guide/faq' },
                    { text: 'Basic Example', link: 'https://github.com/rly-dev/InteractiveFlow/tree/main/examples' }
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
        ['link', { rel: 'icon', href: '/logo.svg' }]
    ]
})
