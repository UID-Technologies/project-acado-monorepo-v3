import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css'
import ErrorBoundary from '@errors/ErrorBoundary/ErrorBoundary'
import { initializeGlobalErrorHandler } from "@/utils/errorLogger";
import appConfig from "@app/config/app.config";

if (appConfig.debug) {
    initializeGlobalErrorHandler();
}
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)