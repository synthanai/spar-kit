/**
 * SPAR-Kit Security: Input Validation
 * 
 * Validates and sanitizes all user input to prevent security vulnerabilities.
 */

/**
 * UUID v4 regex pattern
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Allowed characters for model names
 */
const MODEL_NAME_PATTERN = /^[a-zA-Z0-9._:-]+$/;

/**
 * Allowed URL patterns (whitelist)
 */
const ALLOWED_URL_PATTERNS = [
    /^https?:\/\/localhost(:\d+)?/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?/,
    /^https?:\/\/api\.openai\.com/,
    /^https?:\/\/api\.anthropic\.com/,
    /^https?:\/\/generativelanguage\.googleapis\.com/,
    /^https?:\/\/.*\.ollama\.ai/
];

/**
 * XSS patterns to detect
 */
const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
];

/**
 * Path traversal patterns
 */
const PATH_TRAVERSAL_PATTERNS = [
    /\.\./,
    /\/\.\//,
    /\\/,
    /%2e%2e/i,
    /%252e/i
];

/**
 * Validate UUID format
 */
export function validateUUID(value, fieldName = 'ID') {
    if (!value || typeof value !== 'string') {
        return { valid: false, error: `${fieldName} is required` };
    }

    if (!UUID_PATTERN.test(value)) {
        return { valid: false, error: `${fieldName} must be a valid UUID` };
    }

    return { valid: true };
}

/**
 * Validate decision text (prevents XSS)
 */
export function validateDecision(text) {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Decision text is required' };
    }

    if (text.length < 10) {
        return { valid: false, error: 'Decision text must be at least 10 characters' };
    }

    if (text.length > 2000) {
        return { valid: false, error: 'Decision text must be less than 2000 characters' };
    }

    // Check for XSS patterns
    for (const pattern of XSS_PATTERNS) {
        if (pattern.test(text)) {
            return { valid: false, error: 'Decision text contains invalid content' };
        }
    }

    return { valid: true };
}

/**
 * Validate persona ID
 */
export function validatePersonaId(id) {
    if (!id || typeof id !== 'string') {
        return { valid: false, error: 'Persona ID is required' };
    }

    // Must be alphanumeric with underscores, max 50 chars
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || id.length > 50) {
        return { valid: false, error: 'Invalid persona ID format' };
    }

    return { valid: true };
}

/**
 * Validate file path (prevents path traversal)
 */
export function validateFilePath(path, fieldName = 'Path') {
    if (!path || typeof path !== 'string') {
        return { valid: false, error: `${fieldName} is required` };
    }

    // Check for path traversal
    for (const pattern of PATH_TRAVERSAL_PATTERNS) {
        if (pattern.test(path)) {
            return { valid: false, error: `${fieldName} contains invalid characters` };
        }
    }

    // Check for null bytes
    if (path.includes('\0')) {
        return { valid: false, error: `${fieldName} contains invalid characters` };
    }

    return { valid: true };
}

/**
 * Validate model name
 */
export function validateModelName(model) {
    if (!model || typeof model !== 'string') {
        return { valid: false, error: 'Model name is required' };
    }

    if (!MODEL_NAME_PATTERN.test(model)) {
        return { valid: false, error: 'Model name contains invalid characters' };
    }

    if (model.length > 100) {
        return { valid: false, error: 'Model name is too long' };
    }

    return { valid: true };
}

/**
 * Validate base URL
 */
export function validateBaseUrl(url) {
    if (!url || typeof url !== 'string') {
        return { valid: false, error: 'Base URL is required' };
    }

    // Check against whitelist
    const isAllowed = ALLOWED_URL_PATTERNS.some(pattern => pattern.test(url));

    if (!isAllowed) {
        return { valid: false, error: 'Base URL is not in the allowed list' };
    }

    // Additional URL validation
    try {
        new URL(url);
    } catch {
        return { valid: false, error: 'Base URL is not a valid URL' };
    }

    return { valid: true };
}

/**
 * Validate API key format (basic check, never log the actual key)
 */
export function validateApiKey(key, provider) {
    if (!key) {
        // API key is optional for some providers
        if (provider === 'ollama') {
            return { valid: true };
        }
        return { valid: false, error: 'API key is required for this provider' };
    }

    if (typeof key !== 'string') {
        return { valid: false, error: 'API key must be a string' };
    }

    // Basic format checks per provider
    const patterns = {
        openai: /^sk-[a-zA-Z0-9-_]{32,}$/,
        anthropic: /^sk-ant-[a-zA-Z0-9-_]{32,}$/,
        gemini: /^[a-zA-Z0-9-_]{39}$/
    };

    const pattern = patterns[provider];
    if (pattern && !pattern.test(key)) {
        return { valid: false, error: `API key format doesn't match expected ${provider} format` };
    }

    return { valid: true };
}

/**
 * Validate session JSON structure
 */
export function validateSessionJson(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid session data' };
    }

    // Required fields
    const requiredFields = ['id', 'version', 'status', 'decision'];
    for (const field of requiredFields) {
        if (!(field in data)) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }

    // Validate ID
    const idResult = validateUUID(data.id, 'Session ID');
    if (!idResult.valid) return idResult;

    // Validate status
    const validStatuses = ['running', 'paused', 'completed', 'aborted', 'failed'];
    if (!validStatuses.includes(data.status)) {
        return { valid: false, error: 'Invalid session status' };
    }

    // Validate decision text
    const decisionResult = validateDecision(data.decision);
    if (!decisionResult.valid) return decisionResult;

    return { valid: true };
}

/**
 * Validate preset name
 */
export function validatePreset(preset) {
    const validPresets = ['news', 'startup', 'corporate', 'crisis', 'innovation', 'ethics'];

    if (!preset) {
        return { valid: true }; // Optional
    }

    if (!validPresets.includes(preset.toLowerCase())) {
        return { valid: false, error: `Invalid preset. Valid options: ${validPresets.join(', ')}` };
    }

    return { valid: true };
}

/**
 * Batch validation helper
 */
export function validateAll(validations) {
    for (const [name, result] of Object.entries(validations)) {
        if (!result.valid) {
            return { valid: false, field: name, error: result.error };
        }
    }
    return { valid: true };
}

export default {
    validateUUID,
    validateDecision,
    validatePersonaId,
    validateFilePath,
    validateModelName,
    validateBaseUrl,
    validateApiKey,
    validateSessionJson,
    validatePreset,
    validateAll
};
