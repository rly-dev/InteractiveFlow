import {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MessageFlags,
    type MessageActionRowComponentBuilder,
    type CommandInteraction,
    type ButtonInteraction,
    type Message,
    type InteractionCollector,
} from "discord.js";
import type { FlowPaginatorOptions, PaginatorState } from "../types/index.js";
import { FlowContainer } from "./FlowContainer.js";
import { FlowError } from "../utils/errors.js";
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_IDLE_TIMEOUT,
    PAGINATION_LABELS,
} from "../utils/constants.js";

/**
 * Represents a target that can receive paginated messages.
 * Includes text-based channels with a `send` method and command interactions.
 */
type SendableChannel = {
    send(options: object): Promise<Message>;
};

/**
 * Union type for paginator send targets.
 */
type PaginatorTarget = SendableChannel | CommandInteraction;

/**
 * A generic, stateful pagination engine for Discord.js Components V2.
 *
 * Abstracts away `InteractionCollector` management, page state tracking,
 * navigation button rendering, and automatic disposal on timeout.
 *
 * @typeParam T - The type of data items being paginated.
 *
 * @example
 * ```ts
 * const paginator = new FlowPaginator({
 *   data: ["Alice", "Bob", "Charlie", "Dave", "Eve"],
 *   pageSize: 2,
 *   render: (items, pageIndex, totalPages) => {
 *     return new FlowContainer()
 *       .addTitle(`# Users (Page ${pageIndex + 1}/${totalPages})`)
 *       .addDescription(items.map((name, i) => `**${i + 1}.** ${name}`).join("\n"));
 *   },
 * });
 *
 * await paginator.send(interaction);
 * ```
 */
export class FlowPaginator<T> {
    /** The full dataset to paginate. */
    private readonly data: readonly T[];

    /** Number of items displayed per page. */
    private readonly pageSize: number;

    /** User-provided render function that transforms page items into a FlowContainer. */
    private readonly render: FlowPaginatorOptions<T>["render"];

    /** Idle timeout in milliseconds before the collector stops. */
    private readonly idleTimeout: number;

    /** Current page index (zero-based). */
    private currentPage: number = 0;

    /** Unique nonce to scope button custom IDs to this paginator instance. */
    private readonly nonce: string;

    /** Reference to the active collector, if any. */
    private collector: InteractionCollector<ButtonInteraction> | null = null;

    /**
     * Creates a new FlowPaginator instance.
     *
     * @param options - Configuration for the paginator.
     * @param options.data - Array of data items to paginate.
     * @param options.pageSize - Items per page (default: 5).
     * @param options.render - Function receiving the current page's items, page index, and total pages.
     * @param options.idleTimeout - Collector idle timeout in ms (default: 60000).
     * @throws {FlowError} If `data` is empty or `pageSize` is less than 1.
     */
    constructor(options: FlowPaginatorOptions<T>) {
        if (!options.data.length) {
            throw new FlowError(
                "FlowPaginator requires a non-empty data array.",
                "EMPTY_DATA"
            );
        }

        if (options.pageSize !== undefined && options.pageSize < 1) {
            throw new FlowError(
                "Page size must be at least 1.",
                "INVALID_PAGE_SIZE"
            );
        }

        this.data = options.data;
        this.pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
        this.render = options.render;
        this.idleTimeout = options.idleTimeout ?? DEFAULT_IDLE_TIMEOUT;
        this.nonce = this.generateNonce();
    }

    /**
     * Returns the total number of pages based on data length and page size.
     */
    public get totalPages(): number {
        return Math.ceil(this.data.length / this.pageSize);
    }

    /**
     * Returns a snapshot of the current paginator state.
     */
    public getState(): PaginatorState {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            active: this.collector !== null && !this.collector.ended,
        };
    }

    /**
     * Returns the data slice for the current page.
     */
    public getPageData(): T[] {
        const start = this.currentPage * this.pageSize;
        return this.data.slice(start, start + this.pageSize) as T[];
    }

    /**
     * Renders the current page by invoking the user's render function
     * and appending navigation buttons.
     *
     * @param disabled - Whether the navigation buttons should be disabled (used on timeout).
     * @returns An object with `components` and `flags` ready for Discord message options.
     */
    public renderPage(disabled: boolean = false): {
        components: ReturnType<FlowContainer["toBuilder"]>[];
        flags: number;
    } {
        const items = this.getPageData();
        const container = this.render(items, this.currentPage, this.totalPages);

        /* Only add nav buttons if there's more than one page */
        if (this.totalPages > 1) {
            const navRow = this.buildNavigationRow(disabled);
            container.addActionRow(...navRow);
        }

        return {
            components: [container.toBuilder()],
            flags: MessageFlags.IsComponentsV2 as number,
        };
    }

    /**
     * Sends the paginated message to a channel or replies to an interaction,
     * and starts the interaction collector for navigation.
     *
     * @param target - A text-based channel with a `send` method, or a `CommandInteraction` to reply to.
     * @returns The sent message.
     * @throws {FlowError} If the target type is unsupported.
     */
    public async send(target: PaginatorTarget): Promise<Message> {
        const pagePayload = this.renderPage();
        let message: Message;

        if (this.isInteraction(target)) {
            if (target.deferred || target.replied) {
                message = await target.editReply(pagePayload);
            } else {
                message = await target.reply({
                    ...pagePayload,
                    fetchReply: true,
                });
            }
        } else if (this.isSendableChannel(target)) {
            message = await target.send(pagePayload);
        } else {
            throw new FlowError(
                "Unsupported target type. Must be a channel with send() or a CommandInteraction.",
                "INVALID_TARGET"
            );
        }

        this.startCollector(message, target);
        return message;
    }

    /**
     * Manually stops the active collector and disables navigation buttons.
     */
    public stop(): void {
        if (this.collector && !this.collector.ended) {
            this.collector.stop("manual");
        }
    }

    /**
     * Generates a short random nonce for scoping button custom IDs.
     */
    private generateNonce(): string {
        return Math.random().toString(36).substring(2, 10);
    }

    /**
     * Builds the Previous / Page Indicator / Next button row.
     *
     * @param disabled - Whether all buttons should be disabled.
     * @returns Array of button builders for the navigation row.
     */
    private buildNavigationRow(
        disabled: boolean
    ): MessageActionRowComponentBuilder[] {
        const prevButton = new ButtonBuilder()
            .setCustomId(`flow_prev_${this.nonce}`)
            .setLabel(PAGINATION_LABELS.PREVIOUS)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled || this.currentPage === 0);

        const pageIndicator = new ButtonBuilder()
            .setCustomId(`flow_page_${this.nonce}`)
            .setLabel(`${this.currentPage + 1} / ${this.totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const nextButton = new ButtonBuilder()
            .setCustomId(`flow_next_${this.nonce}`)
            .setLabel(PAGINATION_LABELS.NEXT)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled || this.currentPage >= this.totalPages - 1);

        return [prevButton, pageIndicator, nextButton];
    }

    /**
     * Starts the interaction collector on the sent message and handles
     * page navigation, error handling, and automatic disposal on timeout.
     *
     * @param message - The Discord message hosting the paginator.
     * @param target - The original target (used to determine the user ID for filtering).
     */
    private startCollector(
        message: Message,
        target: PaginatorTarget
    ): void {
        const userId = this.isInteraction(target) ? target.user.id : null;

        this.collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            idle: this.idleTimeout,
            filter: (interaction: ButtonInteraction) => {
                /* Scope to this paginator's buttons */
                const isOwnButton = interaction.customId.endsWith(this.nonce);

                /* If we know the user, restrict to them only */
                if (userId) {
                    return isOwnButton && interaction.user.id === userId;
                }

                return isOwnButton;
            },
        });

        this.collector.on("collect", async (interaction: ButtonInteraction) => {
            await this.handleInteraction(interaction);
        });

        this.collector.on("end", async (_collected, reason) => {
            /* On idle timeout or manual stop, disable buttons */
            if (reason === "idle" || reason === "manual") {
                try {
                    const disabledPayload = this.renderPage(true);
                    await message.edit(disabledPayload);
                } catch {
                    /* Message may have been deleted — silently ignore */
                }
            }
        });
    }

    /**
     * Handles a navigation button press by updating the page index
     * and editing the message with the new page content.
     *
     * @param interaction - The button interaction that triggered navigation.
     */
    private async handleInteraction(
        interaction: ButtonInteraction
    ): Promise<void> {
        const customId = interaction.customId;

        if (customId === `flow_prev_${this.nonce}`) {
            this.currentPage = Math.max(0, this.currentPage - 1);
        } else if (customId === `flow_next_${this.nonce}`) {
            this.currentPage = Math.min(
                this.totalPages - 1,
                this.currentPage + 1
            );
        }

        try {
            const updatedPayload = this.renderPage();
            await interaction.update(updatedPayload);
        } catch {
            /* Interaction may have expired — silently ignore */
        }
    }

    /**
     * Type guard to check if a target is a CommandInteraction.
     */
    private isInteraction(
        target: PaginatorTarget
    ): target is CommandInteraction {
        return "reply" in target && "user" in target;
    }

    /**
     * Type guard to check if a target is a sendable channel.
     */
    private isSendableChannel(
        target: PaginatorTarget
    ): target is SendableChannel {
        return "send" in target && !("user" in target);
    }
}
