// src/app.ts
// Legacy app.ts - now re-exports from loaders
// This file is kept for backward compatibility
// New code should use loadApp() from loaders/index.js directly
import { loadApp } from './loaders/index.js';

// For backward compatibility, export a function that returns the app
// Note: This is async, so any code using this needs to await it
export default loadApp;
