# FlowContainer

`FlowContainer` is a declarative wrapper around Discord.js `ContainerBuilder`. It simplifies creating Components V2 layouts by providing a fluent, chainable interface.

## Basic Usage

```ts
import { FlowContainer } from "interactiveflow";
import { ButtonBuilder, ButtonStyle, MessageFlags } from "discord.js";

const card = new FlowContainer({ accentColor: 0x5865f2 })
  .addTitle("# Welcome!")
  .addSeparator()
  .addDescription("This is a container built with InteractiveFlow.")
  .addActionRow(
    new ButtonBuilder()
        .setCustomId("click_me")
        .setLabel("Click Me")
        .setStyle(ButtonStyle.Primary)
  );

await interaction.reply({
    components: [card.toBuilder()],
    flags: MessageFlags.IsComponentsV2
});
```

## Methods

### `addTitle(text)`
Adds a title component. Supports markdown headings (e.g., `# Title`).

### `addDescription(text)`
Adds a description text component.

### `addSeparator(options?)`
Adds a separator line.
- `divider`: Boolean (default `true`)
- `spacing`: `"small"` or `"large"`

### `addSection(options)`
Adds a section with text and an optional accessory.

```ts
container.addSection({
    content: "### Section Title\nSome content here.",
    thumbnailAccessory: new ThumbnailBuilder().setURL("...")
});
```
