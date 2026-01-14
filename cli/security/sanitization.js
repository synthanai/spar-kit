/**
 * SPAR-Kit Security: Sanitization
 * 
 * Sanitizes output data before display or storage.
 */

/**
 * HTML entities to escape
 */
const HTML_ENTITIES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;'
};

/**
 * Escape HTML entities
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"'`\/]/g, char => HTML_ENTITIES[char]);
}

/**
 * Sanitize for terminal output (remove control characters)
 */
export function sanitizeForTerminal(str) {
    if (typeof str !== 'string') return str;

    // Remove ANSI escape codes except colors we allow
    // Remove other control characters
    return str
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control chars
        .replace(/\x1B(?!\[[\d;]*m)/g, ''); // ANSI except color codes
}

/**
 * Sanitize for Markdown export
 */
export function sanitizeForMarkdown(str) {
    if (typeof str !== 'string') return str;

    // Escape Markdown special characters that could cause issues
    return str
        .replace(/([\\`*_{}[\]()#+\-.!])/g, '\\$1')
        .replace(/\n\n+/g, '\n\n'); // Normalize line breaks
}

/**
 * Sanitize for JSON export
 */
export function sanitizeForJson(obj) {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        // Remove null bytes and control characters
        return obj.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeForJson);
    }

    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            // Skip internal fields
            if (key.startsWith('_')) continue;
            sanitized[key] = sanitizeForJson(value);
        }
        return sanitized;
    }

    return obj;
}

/**
 * Sanitize LLM response before display
 */
export function sanitizeLLMResponse(response) {
    if (typeof response !== 'string') return response;

    // Remove potential prompt injection patterns
    const sanitized = response
        // Remove system/user/assistant role markers that could confuse display
        .replace(/^(system|user|assistant):\s*/gim, '')
        // Remove markdown code block markers used for injection
        .replace(/```(?:system|prompt|injection)[^`]*```/gi, '')
        // Normalize whitespace
        .trim();

    return sanitizeForTerminal(sanitized);
}

/**
 * Mask sensitive data in logs
 */
export function maskSensitiveData(str) {
    if (typeof str !== 'string') return str;

    return str
        // API keys (order matters: more specific patterns first!)
        .replace(/sk-ant-[a-zA-Z0-9-_]{8,}/g, 'sk-ant-****')
        .replace(/sk-[a-zA-Z0-9-_]{8,}/g, 'sk-****')
        // Bearer tokens
        .replace(/Bearer\s+[a-zA-Z0-9-_.]+/gi, 'Bearer ****')
        // Email addresses
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '****@****.***');
}

/**
 * Sanitize session for export (remove internal fields)
 */
export function sanitizeSessionForExport(session) {
    if (!session || typeof session !== 'object') return session;

    const sanitized = { ...session };

    // Remove internal fields
    delete sanitized._filename;
    delete sanitized._internal;

    // Sanitize all string content
    if (sanitized.decision) {
        sanitized.decision = sanitizeForTerminal(sanitized.decision);
    }

    // Sanitize phases
    if (sanitized.phases) {
        for (const phase of Object.values(sanitized.phases)) {
            if (phase.responses) {
                phase.responses = phase.responses.map(r => ({
                    ...r,
                    content: r.content ? sanitizeLLMResponse(r.content) : r.content
                }));
            }
            if (phase.synthesis) {
                phase.synthesis = sanitizeLLMResponse(phase.synthesis);
            }
        }
    }

    return sanitized;
}

/**
 * Create safe filename from user input
 */
export function createSafeFilename(input, maxLength = 50) {
    if (typeof input !== 'string') return 'untitled';

    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, maxLength) || 'untitled';
}

/**
 * Truncate string safely (no mid-character cuts for unicode)
 */
export function truncateSafely(str, maxLength, suffix = '...') {
    if (typeof str !== 'string') return str;
    if (str.length <= maxLength) return str;

    // Use Array.from to handle unicode correctly
    const chars = Array.from(str);
    if (chars.length <= maxLength) return str;

    return chars.slice(0, maxLength - suffix.length).join('') + suffix;
}

export default {
    escapeHtml,
    sanitizeForTerminal,
    sanitizeForMarkdown,
    sanitizeForJson,
    sanitizeLLMResponse,
    maskSensitiveData,
    sanitizeSessionForExport,
    createSafeFilename,
    truncateSafely
};
