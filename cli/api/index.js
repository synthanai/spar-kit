/**
 * SPAR-Kit Programmatic API
 * 
 * Public API for programmatic access to SPAR-Kit functionality.
 * Enables integration with other tools, CI/CD pipelines, and automation.
 */

import {
    useSessionStore,
    createSession as createSessionInternal,
    SessionStatus
} from '../tui/store/sessions.js';
import { useConfigStore } from '../tui/store/config.js';
import {
    validateDecision,
    validatePreset,
    validateUUID,
    validateFilePath
} from '../security/validation.js';
import {
    sanitizeSessionForExport,
    createSafeFilename
} from '../security/sanitization.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * API Version
 */
export const API_VERSION = '1.0.0';

/**
 * Re-export SessionStatus for convenience
 */
export { SessionStatus };

/**
 * Initialize SPAR-Kit API
 * Must be called before using other API methods.
 */
export function initialize() {
    useConfigStore.getState().load();
    useSessionStore.getState().loadSessions();

    return {
        version: API_VERSION,
        provider: useConfigStore.getState().config.provider,
        model: useConfigStore.getState().config.model,
        sessionCount: useSessionStore.getState().sessions.length
    };
}

/**
 * Create a new SPAR session
 * 
 * @param {Object} options Session options
 * @param {string} options.decision The decision question to debate
 * @param {string} [options.preset='innovation'] Persona preset
 * @param {string} [options.provider] LLM provider (defaults to config)
 * @param {string} [options.model] Model name (defaults to config)
 * @returns {Object} Created session object
 * @throws {Error} If validation fails
 */
export function createSession(options) {
    const { decision, preset, provider, model } = options;

    // Validate decision
    const decisionResult = validateDecision(decision);
    if (!decisionResult.valid) {
        throw new Error(`Invalid decision: ${decisionResult.error}`);
    }

    // Validate preset if provided
    if (preset) {
        const presetResult = validatePreset(preset);
        if (!presetResult.valid) {
            throw new Error(`Invalid preset: ${presetResult.error}`);
        }
    }

    // Get defaults from config
    const config = useConfigStore.getState().config;

    // Create session
    const session = useSessionStore.getState().createSession(
        decision,
        preset || config.tui?.defaultPreset || 'innovation',
        provider || config.provider,
        model || config.model
    );

    return {
        id: session.id,
        status: session.status,
        decision: session.decision,
        preset: session.preset,
        provider: session.provider,
        model: session.model,
        createdAt: session.metrics.started_at
    };
}

/**
 * Get a session by ID
 * 
 * @param {string} id Session UUID
 * @returns {Object|null} Session object or null if not found
 * @throws {Error} If ID format is invalid
 */
export function getSession(id) {
    const idResult = validateUUID(id, 'Session ID');
    if (!idResult.valid) {
        throw new Error(`Invalid session ID: ${idResult.error}`);
    }

    const session = useSessionStore.getState().getSession(id);

    if (!session) {
        return null;
    }

    return sanitizeSessionForExport(session);
}

/**
 * List sessions with optional filtering
 * 
 * @param {Object} [filters] Filter options
 * @param {string} [filters.status] Filter by status
 * @param {number} [filters.limit=50] Maximum number of sessions
 * @param {number} [filters.days] Filter by days ago
 * @returns {Array} Array of session summaries
 */
export function listSessions(filters = {}) {
    const { status, limit = 50, days } = filters;

    let sessions = useSessionStore.getState().sessions;

    // Filter by status
    if (status) {
        sessions = sessions.filter(s => s.status === status);
    }

    // Filter by date
    if (days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        sessions = sessions.filter(s =>
            new Date(s.metrics?.started_at) >= cutoff
        );
    }

    // Apply limit and map to summaries
    return sessions.slice(0, limit).map(s => ({
        id: s.id,
        status: s.status,
        decision: s.decision.substring(0, 100),
        preset: s.preset,
        createdAt: s.metrics?.started_at,
        completedAt: s.metrics?.completed_at
    }));
}

/**
 * Export a session to file
 * 
 * @param {string} id Session UUID
 * @param {Object} options Export options
 * @param {string} [options.format='md'] Export format (md, json, txt)
 * @param {string} [options.output] Output file path (optional)
 * @returns {Object} Export result with content and path
 * @throws {Error} If session not found or export fails
 */
export function exportSession(id, options = {}) {
    const { format = 'md', output } = options;

    // Validate ID
    const idResult = validateUUID(id, 'Session ID');
    if (!idResult.valid) {
        throw new Error(`Invalid session ID: ${idResult.error}`);
    }

    // Get session
    const session = useSessionStore.getState().getSession(id);
    if (!session) {
        throw new Error(`Session not found: ${id}`);
    }

    // Sanitize for export
    const sanitized = sanitizeSessionForExport(session);

    // Generate content based on format
    let content;
    let extension;

    switch (format.toLowerCase()) {
        case 'json':
            content = JSON.stringify(sanitized, null, 2);
            extension = 'json';
            break;

        case 'txt':
            content = generateTextExport(sanitized);
            extension = 'txt';
            break;

        case 'md':
        default:
            content = generateMarkdownExport(sanitized);
            extension = 'md';
            break;
    }

    // Write to file if output specified
    let filePath = null;
    if (output) {
        const pathResult = validateFilePath(output);
        if (!pathResult.valid) {
            throw new Error(`Invalid output path: ${pathResult.error}`);
        }

        filePath = output.endsWith(`.${extension}`)
            ? output
            : `${output}.${extension}`;

        writeFileSync(filePath, content, 'utf-8');
    }

    return {
        content,
        format: extension,
        path: filePath,
        sessionId: id
    };
}

/**
 * Delete a session
 * 
 * @param {string} id Session UUID
 * @returns {boolean} True if deleted successfully
 * @throws {Error} If ID is invalid
 */
export function deleteSession(id) {
    const idResult = validateUUID(id, 'Session ID');
    if (!idResult.valid) {
        throw new Error(`Invalid session ID: ${idResult.error}`);
    }

    const session = useSessionStore.getState().getSession(id);
    if (!session) {
        return false;
    }

    useSessionStore.getState().deleteSession(id);
    return true;
}

/**
 * Clone a session
 * 
 * @param {string} id Session UUID to clone
 * @returns {Object} New cloned session
 * @throws {Error} If session not found
 */
export function cloneSession(id) {
    const idResult = validateUUID(id, 'Session ID');
    if (!idResult.valid) {
        throw new Error(`Invalid session ID: ${idResult.error}`);
    }

    const cloned = useSessionStore.getState().cloneSession(id);
    if (!cloned) {
        throw new Error(`Session not found: ${id}`);
    }

    return {
        id: cloned.id,
        status: cloned.status,
        decision: cloned.decision,
        clonedFrom: id
    };
}

/**
 * Get session statistics
 * 
 * @returns {Object} Session statistics
 */
export function getStats() {
    useSessionStore.getState().loadSessions();
    const stats = useSessionStore.getState().stats;

    return {
        total: stats.total,
        completed: stats.completed,
        running: stats.running,
        paused: stats.paused,
        failed: stats.failed,
        completionRate: stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0
    };
}

/**
 * Get current configuration
 * 
 * @returns {Object} Current configuration (API keys masked)
 */
export function getConfig() {
    const config = useConfigStore.getState().config;

    return {
        provider: config.provider,
        model: config.model,
        baseUrl: config.baseUrl,
        apiKeySet: !!config.apiKey,
        tui: config.tui,
        debate: config.debate
    };
}

// ============================================
// INTERNAL HELPERS
// ============================================

function generateMarkdownExport(session) {
    let md = `# SPAR Session\n\n`;
    md += `**Date**: ${session.metrics?.started_at}\n`;
    md += `**Status**: ${session.status}\n`;
    md += `**Preset**: ${session.preset}\n\n`;
    md += `## Decision\n\n${session.decision}\n\n`;

    // Add phases if available
    if (session.phases?.transmit?.recommendations) {
        md += `## Recommendations\n\n${session.phases.transmit.recommendations}\n\n`;
    }

    if (session.phases?.knit?.synthesis) {
        md += `## Synthesis\n\n${session.phases.knit.synthesis}\n\n`;
    }

    md += `---\n\n🥊 Generated by SPAR Kit API v${API_VERSION}\n`;

    return md;
}

function generateTextExport(session) {
    let txt = `SPAR SESSION\n`;
    txt += `${'='.repeat(60)}\n\n`;
    txt += `Date: ${session.metrics?.started_at}\n`;
    txt += `Status: ${session.status}\n`;
    txt += `Preset: ${session.preset}\n\n`;
    txt += `DECISION:\n${session.decision}\n\n`;

    if (session.phases?.transmit?.recommendations) {
        txt += `RECOMMENDATIONS:\n${session.phases.transmit.recommendations}\n\n`;
    }

    txt += `${'='.repeat(60)}\n`;
    txt += `Generated by SPAR Kit API v${API_VERSION}\n`;

    return txt;
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    API_VERSION,
    SessionStatus,
    initialize,
    createSession,
    getSession,
    listSessions,
    exportSession,
    deleteSession,
    cloneSession,
    getStats,
    getConfig
};
