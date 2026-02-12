/**
 * InteractiveFlow — Basic Usage Example
 *
 * This example demonstrates:
 * 1. Building a static info card with FlowContainer.
 * 2. Creating a paginated list of items with FlowPaginator.
 *
 * Prerequisites:
 *   - A Discord bot token in your environment as DISCORD_TOKEN.
 *   - A guild with slash commands registered.
 *
 * Usage:
 *   npx ts-node examples/basic-usage.ts
 */

import {
    Client,
    GatewayIntentBits,
    Events,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import { FlowContainer, FlowPaginator } from "../src/index.js";

/* ── Bot Setup ────────────────────────────────────────────────────── */

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

/* ── Event Handlers ───────────────────────────────────────────────── */

client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    /* ── /info — Static Container Example ──────────────────────────── */
    if (interaction.commandName === "info") {
        const card = new FlowContainer({ accentColor: 0x5865f2 })
            .addTitle("# 📋 Server Information")
            .addSeparator()
            .addDescription(
                "Welcome to the server! Here are some quick details about what we offer."
            )
            .addSection({
                content: "🔗 **Website**\nVisit our homepage for the latest news.",
                buttonAccessory: new ButtonBuilder()
                    .setLabel("Visit")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://example.com"),
            })
            .addSeparator({ divider: false, spacing: "small" });

        await interaction.reply({
            components: [card.toBuilder()],
            flags: 1 << 15, // MessageFlags.IsComponentsV2
        });
    }

    /* ── /users — Paginated List Example ───────────────────────────── */
    if (interaction.commandName === "users") {
        const users = [
            "Alice",
            "Bob",
            "Charlie",
            "Dave",
            "Eve",
            "Frank",
            "Grace",
            "Heidi",
            "Ivan",
            "Judy",
            "Karl",
            "Laura",
            "Mallory",
            "Nancy",
            "Oscar",
        ];

        const paginator = new FlowPaginator<string>({
            data: users,
            pageSize: 5,
            idleTimeout: 30_000,
            render: (items, pageIndex, totalPages) => {
                const list = items
                    .map(
                        (name, i) =>
                            `**${pageIndex * 5 + i + 1}.** ${name}`
                    )
                    .join("\n");

                return new FlowContainer({ accentColor: 0x57f287 })
                    .addTitle(`# 👥 User Directory`)
                    .addSeparator()
                    .addDescription(list)
                    .addSeparator({ divider: false, spacing: "small" })
                    .addDescription(
                        `-# Page ${pageIndex + 1} of ${totalPages} • ${users.length} total users`
                    );
            },
        });

        await paginator.send(interaction);
    }
});

/* ── Start ────────────────────────────────────────────────────────── */

client.login(process.env.DISCORD_TOKEN);
