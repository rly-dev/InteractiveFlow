import type {
    ButtonBuilder,
    ThumbnailBuilder,
    MessageFlags,
} from "discord.js";
import type { FlowContainer } from "../core/FlowContainer.js";

/**
 * Configuration options for the FlowContainer.
 */
export interface FlowContainerOptions {
    /** Accent color for the container (integer color value). */
    accentColor?: number;
    /** Whether the container should be rendered as a spoiler. */
    spoiler?: boolean;
}

/**
 * Options for adding a section to a FlowContainer.
 */
export interface FlowSectionOptions {
    /** Text content displayed inside the section (supports markdown). */
    content: string;
    /** An optional button accessory displayed alongside the section. */
    buttonAccessory?: ButtonBuilder;
    /** An optional thumbnail accessory displayed alongside the section. */
    thumbnailAccessory?: ThumbnailBuilder;
}

/**
 * Options for adding a separator to a FlowContainer.
 */
export interface FlowSeparatorOptions {
    /** Whether the separator should include visible divider spacing. */
    divider?: boolean;
    /** Spacing size for the separator. */
    spacing?: "small" | "large";
}

/**
 * Render function that transforms a data item into a FlowContainer.
 * @typeParam T - The type of data being paginated.
 */
export type FlowPageRenderer<T> = (
    items: T[],
    pageIndex: number,
    totalPages: number
) => FlowContainer;

/**
 * Configuration options for the FlowPaginator.
 * @typeParam T - The type of data being paginated.
 */
export interface FlowPaginatorOptions<T> {
    /** The full array of data items to paginate. */
    data: T[];
    /** Number of items to display per page. */
    pageSize?: number;
    /** Render function that receives the current page's items and returns a FlowContainer. */
    render: FlowPageRenderer<T>;
    /** Time in milliseconds before the collector automatically stops. Defaults to 60000. */
    idleTimeout?: number;
    /** Optional message flags (e.g., `MessageFlags.IsComponentsV2`). Applied automatically. */
    flags?: MessageFlags;
}

/**
 * Represents the current state of a paginator instance.
 */
export interface PaginatorState {
    /** The current page index (zero-based). */
    currentPage: number;
    /** The total number of pages. */
    totalPages: number;
    /** Whether the paginator collector is still active. */
    active: boolean;
}
