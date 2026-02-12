# Frequently Asked Questions

## Troubleshooting

### Why aren't my pagination buttons working?
1. **Check the user**: By default, `FlowPaginator` only allows the user who called `send()` to interact.
2. **Check the timeout**: The default idle timeout is 60 seconds. After this, buttons are disabled. You can increase this via the `idleTimeout` option.
3. **Check for errors**: Ensure your bot has the correct permissions to send messages and embeds/components.

### Can I use FlowContainer with Embeds?
No. `FlowContainer` builds **Components V2** (Containers), which are a replacement for/alternative to Embeds. You generally cannot mix top-level Containers and Embeds in the same message payload in a way that blends them inside the container.

### Does this work with Modals?
`FlowPaginator` is designed for message components (Buttons). It does not natively support pagination via Modals, as Modals are transient user inputs.

## Technical Details

### Is this library production ready?
Yes. It is built with strict TypeScript and wraps the stable Discord.js v14+ API.

### How does `send()` work?
`paginator.send(target)` detects if `target` is a text channel or an interaction.
- If it's an **Interaction**, it calls `reply()` (or `editReply()` if deferred).
- If it's a **Channel**, it calls `send()`.
This abstraction allows you to use the same pagination code in both slash commands and message events.
