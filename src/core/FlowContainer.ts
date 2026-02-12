import {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SectionBuilder,
    ActionRowBuilder,
    type MessageActionRowComponentBuilder,
    type ContainerComponentBuilder,
    SeparatorSpacingSize,
} from "discord.js";
import type {
    FlowContainerOptions,
    FlowSectionOptions,
    FlowSeparatorOptions,
} from "../types/index.js";
import { FlowError } from "../utils/errors.js";
import { MAX_CONTAINER_COMPONENTS } from "../utils/constants.js";

/**
 * A declarative, fluent wrapper around Discord.js `ContainerBuilder`.
 *
 * Simplifies creating Components V2 Container layouts with chainable methods,
 * built-in validation against Discord's component limits, and a clean API
 * for common patterns like titles, descriptions, sections, and action rows.
 *
 * @example
 * ```ts
 * const container = new FlowContainer()
 *   .setAccentColor(0x5865F2)
 *   .addTitle("# Welcome!")
 *   .addSeparator()
 *   .addDescription("This is a **declarative** container.")
 *   .addActionRow(someButton, anotherButton)
 *   .build();
 * ```
 */
export class FlowContainer {
    /** The underlying discord.js ContainerBuilder instance. */
    private readonly container: ContainerBuilder;

    /** Tracks the current number of top-level components added. */
    private componentCount: number = 0;

    /**
     * Creates a new FlowContainer instance.
     * @param options - Optional configuration for accent color and spoiler flag.
     */
    constructor(options?: FlowContainerOptions) {
        this.container = new ContainerBuilder();

        if (options?.accentColor !== undefined) {
            this.container.setAccentColor(options.accentColor);
        }

        if (options?.spoiler !== undefined) {
            this.container.setSpoiler(options.spoiler);
        }
    }

    /**
     * Validates that adding a component won't exceed Discord's container limit.
     * @param count - Number of components about to be added (default: 1).
     * @throws {FlowError} If the component limit would be exceeded.
     */
    private validateCapacity(count: number = 1): void {
        if (this.componentCount + count > MAX_CONTAINER_COMPONENTS) {
            throw new FlowError(
                `Cannot add ${count} component(s): container already has ${this.componentCount}/${MAX_CONTAINER_COMPONENTS} components.`,
                "COMPONENT_LIMIT"
            );
        }
    }

    /**
     * Sets the accent color of the container.
     * @param color - Integer color value (e.g., `0x5865F2`).
     * @returns This FlowContainer for chaining.
     */
    public setAccentColor(color: number): this {
        this.container.setAccentColor(color);
        return this;
    }

    /**
     * Sets whether the container should be rendered as a spoiler.
     * @param spoiler - Whether to enable the spoiler flag.
     * @returns This FlowContainer for chaining.
     */
    public setSpoiler(spoiler: boolean): this {
        this.container.setSpoiler(spoiler);
        return this;
    }

    /**
     * Adds a title text display to the container.
     *
     * The content supports Discord's markdown formatting —
     * use heading syntax (e.g., `# Title`) for large text.
     *
     * @param text - The title text content (supports markdown).
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addTitle(text: string): this {
        this.validateCapacity();
        const display = new TextDisplayBuilder().setContent(text);
        this.container.addTextDisplayComponents(display);
        this.componentCount++;
        return this;
    }

    /**
     * Adds a description text display to the container.
     *
     * Functionally identical to `addTitle`, but semantically represents
     * body or description text for readability.
     *
     * @param text - The description text content (supports markdown).
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addDescription(text: string): this {
        this.validateCapacity();
        const display = new TextDisplayBuilder().setContent(text);
        this.container.addTextDisplayComponents(display);
        this.componentCount++;
        return this;
    }

    /**
     * Adds a separator line to the container.
     *
     * @param options - Optional separator configuration.
     * @param options.divider - Whether to show a visible divider line. Defaults to `true`.
     * @param options.spacing - Spacing size: `"small"` or `"large"`.
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addSeparator(options?: FlowSeparatorOptions): this {
        this.validateCapacity();
        const separator = new SeparatorBuilder();

        if (options?.divider !== undefined) {
            separator.setDivider(options.divider);
        }

        if (options?.spacing !== undefined) {
            const spacingValue =
                options.spacing === "small"
                    ? SeparatorSpacingSize.Small
                    : SeparatorSpacingSize.Large;
            separator.setSpacing(spacingValue);
        }

        this.container.addSeparatorComponents(separator);
        this.componentCount++;
        return this;
    }

    /**
     * Adds a section component to the container.
     *
     * Sections display text alongside an optional accessory
     * (button or thumbnail) on the right side.
     *
     * @param options - Section configuration.
     * @param options.content - The text content for the section (supports markdown).
     * @param options.buttonAccessory - An optional button displayed alongside the section.
     * @param options.thumbnailAccessory - An optional thumbnail displayed alongside the section.
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If both a button and thumbnail accessory are provided.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addSection(options: FlowSectionOptions): this {
        this.validateCapacity();

        if (options.buttonAccessory && options.thumbnailAccessory) {
            throw new FlowError(
                "A section cannot have both a button and a thumbnail accessory. Choose one.",
                "INVALID_SECTION"
            );
        }

        const section = new SectionBuilder();
        const textDisplay = new TextDisplayBuilder().setContent(options.content);
        section.addTextDisplayComponents(textDisplay);

        if (options.buttonAccessory) {
            section.setButtonAccessory(options.buttonAccessory);
        }

        if (options.thumbnailAccessory) {
            section.setThumbnailAccessory(options.thumbnailAccessory);
        }

        this.container.addSectionComponents(section);
        this.componentCount++;
        return this;
    }

    /**
     * Adds an action row containing interactive components (buttons, selects, etc.).
     *
     * @param components - One or more message component builders to place in the row.
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addActionRow(
        ...components: MessageActionRowComponentBuilder[]
    ): this {
        this.validateCapacity();
        const row =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                ...components
            );
        this.container.addActionRowComponents(row);
        this.componentCount++;
        return this;
    }

    /**
     * Adds a raw discord.js component directly to the container.
     *
     * Use this escape hatch for component types not covered by the
     * higher-level methods (e.g., MediaGallery, File).
     *
     * @param component - A discord.js container component builder to add.
     * @returns This FlowContainer for chaining.
     * @throws {FlowError} If the container component limit is exceeded.
     */
    public addComponent(
        component: ContainerComponentBuilder
    ): this {
        this.validateCapacity();
        this.container.spliceComponents(this.componentCount, 0, component);
        this.componentCount++;
        return this;
    }

    /**
     * Returns the current number of top-level components in the container.
     */
    public getComponentCount(): number {
        return this.componentCount;
    }

    /**
     * Returns the remaining component capacity before hitting Discord's limit.
     */
    public getRemainingCapacity(): number {
        return MAX_CONTAINER_COMPONENTS - this.componentCount;
    }

    /**
     * Returns the underlying `ContainerBuilder` instance.
     *
     * Use this when you need direct access to the discord.js builder,
     * for example when passing to message options alongside other components.
     *
     * @returns The underlying ContainerBuilder.
     */
    public toBuilder(): ContainerBuilder {
        return this.container;
    }

    /**
     * Builds and returns the API-ready JSON payload for this container.
     *
     * @returns The serialized component data, ready to be sent in a Discord message.
     */
    public build(): ReturnType<ContainerBuilder["toJSON"]> {
        return this.container.toJSON();
    }
}
