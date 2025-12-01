import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import { logError } from "@/utils/errorLogger";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                logError(error, "ErrorBoundary");
                console.error("ErrorBoundary caught an error:", error, info);
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;