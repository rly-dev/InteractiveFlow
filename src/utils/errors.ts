/**
 * Custom error class for InteractiveFlow library errors.
 *
 * Provides structured error handling with an error code
 * to help identify the source and category of the error.
 *
 * @example
 * ```ts
 * throw new FlowError("Container component limit exceeded", "COMPONENT_LIMIT");
 * ```
 */
export class FlowError extends Error {
    /**
     * A machine-readable error code identifying the type of error.
     */
    public readonly code: string;

    /**
     * Creates a new FlowError instance.
     * @param message - Human-readable description of the error.
     * @param code - Machine-readable error code.
     */
    constructor(message: string, code: string) {
        super(message);
        this.name = "FlowError";
        this.code = code;

        /* Maintain proper prototype chain for instanceof checks */
        Object.setPrototypeOf(this, FlowError.prototype);
    }
}
