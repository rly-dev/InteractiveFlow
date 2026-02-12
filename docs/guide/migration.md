# Migration Guide

Migrating from vanilla `discord.js` builders or other libraries? Here's how InteractiveFlow compares.

## From Vanilla Discord.js

### The "Old" Way (Imperative)

Creating a container with a title, description, and button often requires managing multiple builder instances and manual array construction.

```ts
// ❌ Vanilla JS/TS
const container = new ContainerBuilder()
    .setAccentColor(0x5865F2)
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("# Title"),
        new TextDisplayBuilder().setContent("Description here")
    )
    .addActionRowComponents(
        new ActionRowBuilder().addComponents(
             new ButtonBuilder().setLabel("Click").setStyle(ButtonStyle.Primary)
        )
    );

await interaction.reply({ components: [container] });
```

### The "InteractiveFlow" Way (Declarative)

`FlowContainer` wraps this complexity into a unified, linear chain.

```ts
// ✅ InteractiveFlow
const container = new FlowContainer({ accentColor: 0x5865F2 })
    .addTitle("# Title")
    .addDescription("Description here")
    .addActionRow(
        new ButtonBuilder().setLabel("Click").setStyle(ButtonStyle.Primary)
    );

await interaction.reply({ components: [container.toBuilder()] });
```

**Key Benefits:**
1. **Less Boilerplate**: No need to instantiate `TextDisplayBuilder` for every line of text.
2. **Readability**: The code structure matches the visual layout (Title -> Description -> Buttons).
3. **Safety**: InteractiveFlow throws an error *immediately* if you exceed component limits, rather than waiting for the Discord API to reject the request.

## From Other Pagination Libs

Most pagination libraries rely on Embeds. InteractiveFlow allows you to use **Components V2 Containers** for pagination, which offer a more native, app-like feel on mobile and desktop.

Refactoring is simple: instead of returning an `EmbedBuilder` in your render function, return a `FlowContainer`.
