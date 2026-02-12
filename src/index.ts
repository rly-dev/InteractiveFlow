/**
 * InteractiveFlow — Declarative Discord.js Containers & Stateful Pagination.
 *
 * @packageDocumentation
 * @module interactiveflow
 * @see {@link https://github.com/rly-dev/InteractiveFlow}
 */

/* ── Core ─────────────────────────────────────────────────────────── */
export { FlowContainer } from "./core/FlowContainer.js";
export { FlowPaginator } from "./core/FlowPaginator.js";

/* ── Types ────────────────────────────────────────────────────────── */
export type {
    FlowContainerOptions,
    FlowSectionOptions,
    FlowSeparatorOptions,
    FlowPaginatorOptions,
    FlowPageRenderer,
    PaginatorState,
} from "./types/index.js";

/* ── Utilities ────────────────────────────────────────────────────── */
export { FlowError } from "./utils/errors.js";
export {
    MAX_CONTAINER_COMPONENTS,
    MAX_SECTION_TEXT_COMPONENTS,
    MAX_ACTION_ROW_COMPONENTS,
    DEFAULT_PAGE_SIZE,
    DEFAULT_IDLE_TIMEOUT,
    PAGINATION_LABELS,
} from "./utils/constants.js";
