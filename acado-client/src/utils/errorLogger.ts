import { addError } from "@app/store/errorStore";
import appConfig from "@app/config/app.config";

export const logError = (error: unknown, context?: string) => {
    if (error instanceof Error) {
        addError(error); // Add the error to the store
    }

    if (appConfig.debug) {
        console.error(`[Debug Mode] Error (${context || "General"}):`, error);
    } else {
        console.error(`[Production Mode] Error:`, { error, context });
    }
};

export const initializeGlobalErrorHandler = () => {
    window.onerror = (message, source, lineno, colno, error) => {
        const errorObject = {
            message,
            source,
            lineno,
            colno,
            error
        } as any;
        logError(errorObject, "Global Error");
    };

    window.onunhandledrejection = (event) => {
        logError(event.reason, "Unhandled Promise Rejection");
    };
};
