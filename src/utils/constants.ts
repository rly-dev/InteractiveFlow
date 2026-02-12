/**
 * Discord API limits and library defaults for InteractiveFlow.
 * These constants ensure validation stays in sync with Discord's constraints.
 */

/** Maximum number of top-level components allowed in a single Container. */
export const MAX_CONTAINER_COMPONENTS = 10;

/** Maximum number of text components allowed inside a single Section. */
export const MAX_SECTION_TEXT_COMPONENTS = 3;

/** Maximum number of components allowed inside a single Action Row. */
export const MAX_ACTION_ROW_COMPONENTS = 5;

/** Default number of items displayed per page in a paginator. */
export const DEFAULT_PAGE_SIZE = 5;

/** Default idle timeout in milliseconds before a paginator collector stops. */
export const DEFAULT_IDLE_TIMEOUT = 60_000;

/** Unicode characters used for pagination button labels. */
export const PAGINATION_LABELS = {
    PREVIOUS: "◀",
    NEXT: "▶",
    FIRST: "⏮",
    LAST: "⏭",
} as const;
