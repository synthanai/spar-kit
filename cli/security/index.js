/**
 * SPAR-Kit Security Module Index
 * 
 * Central export for security utilities.
 */

export * from './validation.js';
export * from './sanitization.js';

// Default export with all functions
import validation from './validation.js';
import sanitization from './sanitization.js';

export default {
    ...validation,
    ...sanitization
};
