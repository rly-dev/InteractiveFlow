# FlowPaginator

`FlowPaginator<T>` is a generic engine that handles stateful pagination for you. It manages the `InteractionCollector`, tracks the current page, and renders navigation buttons automatically.

## Basic Usage

1. Define your data.
2. Create a `FlowPaginator` instance with a `render` function.
3. Call `send()`.

```ts
import { FlowPaginator, FlowContainer } from "interactiveflow";

const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

const paginator = new FlowPaginator<string>({
    data: items,
    pageSize: 2,
    idleTimeout: 30_000,
    render: (pageItems, pageIndex, totalPages) => {
        const list = pageItems
            .map((item, i) => `${i + 1}. ${item}`)
            .join("\n");
        
        return new FlowContainer()
            .addTitle(`# Fruits (Page ${pageIndex + 1}/${totalPages})`)
            .addDescription(list);
    }
});

await paginator.send(interaction);
```

## How It Works

- **Navigation**: Automatically adds `◀ Previous`, `Page X/Y`, and `Next ▶` buttons.
- **Filtering**: Only the user who triggered the paginator can navigate it.
- **Timeout**: After `idleTimeout` (default 60s), the buttons are disabled automatically.
- **Concurrency**: Examples use unique nonces for custom IDs, so multiple paginators won't conflict.
