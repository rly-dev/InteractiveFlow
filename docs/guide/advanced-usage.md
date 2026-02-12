# Advanced Usage

Unlock the full potential of `FlowPaginator` with these advanced patterns.

## Custom Page Rendering

For complex data or layouts, your `render` function can contain any logic you need. You can calculate totals, format dates, or switch layouts based on the page index.

```ts
const paginator = new FlowPaginator({
  data: complexOrders,
  pageSize: 1,
  render: (items, pageIndex, total) => {
    const order = items[0]; // Single item per page view
    const isHighValue = order.total > 1000;

    const container = new FlowContainer({ 
      accentColor: isHighValue ? 0xFEE75C : 0x5865F2 
    })
      .addTitle(`# Order #${order.id}`)
      .addSection({
        content: `**Items:** ${order.items.length}\n**Total:** $${order.total}`,
        thumbnailAccessory: new ThumbnailBuilder().setURL(order.image)
      });

    // Add extra action rows specific to this item
    container.addActionRow(
        new ButtonBuilder()
          .setCustomId(`track_${order.id}`)
          .setLabel("Track Order")
          .setStyle(ButtonStyle.Primary)
    );

    return container;
  }
});
```

## Ephemeral Pagination

To make the pagination visible only to the user who commanded it, pass `flags` to the `FlowPaginator` options.

```ts
const paginator = new FlowPaginator({
  data: users,
  render: myRenderFunction,
  // This flag will be applied to the initial reply AND all page updates
  flags: MessageFlags.Ephemeral
});

await paginator.send(interaction);
```

## Handling Custom Interactions

If you add your own buttons (like "Track Order" above) to the `FlowContainer`, the `FlowPaginator`'s internal collector will ignore them by default because it filters by its unique nonce.

To handle these external interactions, you should set up a separate collector or interaction handler in your command logic, or listen to the `interactionCreate` event globally.

> **Note**: `FlowPaginator` only manages its own Previous/Next buttons. It does not auto-handle other components you add to the page.

## Manual Stop

You can manually stop the paginator (disabling buttons) before the timeout expires:

```ts
// ... later in your code
paginator.stop();
```
