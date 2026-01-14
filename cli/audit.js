/**
 * SPAR-Kit Audit Trail Module
 * 
 * Records all significant actions and decisions for transparency and accountability.
 * Provides tamper-resistant logging with optional hashing.
 */

import { createHash } from 'crypto';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

/**
 * Audit Event Types
 */
export const AuditEventType = {
    // Session lifecycle
    SESSION_CREATED: 'session_created',
    SESSION_STARTED: 'session_started',
    SESSION_PAUSED: 'session_paused',
    SESSION_RESUMED: 'session_resumed',
    SESSION_COMPLETED: 'session_completed',
    SESSION_ABORTED: 'session_aborted',
    SESSION_DELETED: 'session_deleted',
    SESSION_EXPORTED: 'session_exported',

    // Phase events
    PHASE_STARTED: 'phase_started',
    PHASE_COMPLETED: 'phase_completed',
    PHASE_SKIPPED: 'phase_skipped',

    // AI interactions
    LLM_REQUEST: 'llm_request',
    LLM_RESPONSE: 'llm_response',
    LLM_ERROR: 'llm_error',

    // Human actions
    HUMAN_OVERRIDE: 'human_override',
    HUMAN_MODIFICATION: 'human_modification',
    HUMAN_REJECTION: 'human_rejection',
    HUMAN_APPROVAL: 'human_approval',

    // Configuration
    CONFIG_CHANGED: 'config_changed',
    PERSONA_ADDED: 'persona_added',
    PERSONA_REMOVED: 'persona_removed',

    // Security
    AUTH_ATTEMPT: 'auth_attempt',
    VALIDATION_FAILURE: 'validation_failure',

    // Bias & Ethics
    BIAS_DETECTED: 'bias_detected',
    ETHICAL_WARNING: 'ethical_warning'
};

/**
 * Audit Trail Configuration
 */
const AUDIT_DIR = join(homedir(), '.spar', 'audit');
const AUDIT_INDEX = join(AUDIT_DIR, 'index.json');

/**
 * Ensure audit directory exists
 */
function ensureAuditDir() {
    if (!existsSync(AUDIT_DIR)) {
        mkdirSync(AUDIT_DIR, { recursive: true });
    }
}

/**
 * Generate hash for event integrity
 */
function generateHash(event, previousHash = null) {
    const hashContent = JSON.stringify({
        ...event,
        previousHash
    });
    return createHash('sha256').update(hashContent).digest('hex').substring(0, 16);
}

/**
 * Create an audit event
 */
export function createAuditEvent(type, data, metadata = {}) {
    const event = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        type,
        timestamp: new Date().toISOString(),
        data: {
            ...data,
            // Remove sensitive fields
            apiKey: undefined,
            password: undefined,
            token: undefined
        },
        metadata: {
            version: '1.0.0',
            source: 'spar-kit',
            ...metadata
        }
    };

    return event;
}

/**
 * Write audit event to file
 */
export function writeAuditEvent(event, sessionId = 'global') {
    ensureAuditDir();

    // Get previous hash for chain integrity
    const previousHash = getLastEventHash(sessionId);

    // Add hash to event
    event.hash = generateHash(event, previousHash);
    event.previousHash = previousHash;

    // Write to session-specific log
    const sessionLogPath = join(AUDIT_DIR, `${sessionId}.jsonl`);
    const logLine = JSON.stringify(event) + '\n';

    try {
        const fd = require('fs').openSync(sessionLogPath, 'a');
        require('fs').writeSync(fd, logLine);
        require('fs').closeSync(fd);
    } catch (error) {
        console.error('Failed to write audit event:', error.message);
    }

    // Update index
    updateAuditIndex(sessionId, event);

    return event;
}

/**
 * Get last event hash for chain integrity
 */
function getLastEventHash(sessionId) {
    const indexPath = join(AUDIT_DIR, `${sessionId}.jsonl`);

    if (!existsSync(indexPath)) {
        return null;
    }

    try {
        const content = readFileSync(indexPath, 'utf8');
        const lines = content.trim().split('\n').filter(l => l);
        if (lines.length === 0) return null;

        const lastEvent = JSON.parse(lines[lines.length - 1]);
        return lastEvent.hash;
    } catch {
        return null;
    }
}

/**
 * Update global audit index
 */
function updateAuditIndex(sessionId, event) {
    let index = { sessions: {}, lastUpdated: null };

    if (existsSync(AUDIT_INDEX)) {
        try {
            index = JSON.parse(readFileSync(AUDIT_INDEX, 'utf8'));
        } catch {
            // Start fresh if corrupted
        }
    }

    if (!index.sessions[sessionId]) {
        index.sessions[sessionId] = {
            firstEvent: event.timestamp,
            eventCount: 0
        };
    }

    index.sessions[sessionId].lastEvent = event.timestamp;
    index.sessions[sessionId].lastEventType = event.type;
    index.sessions[sessionId].eventCount++;
    index.lastUpdated = new Date().toISOString();

    writeFileSync(AUDIT_INDEX, JSON.stringify(index, null, 2));
}

/**
 * Read audit trail for a session
 */
export function readAuditTrail(sessionId) {
    const logPath = join(AUDIT_DIR, `${sessionId}.jsonl`);

    if (!existsSync(logPath)) {
        return { events: [], verified: true };
    }

    try {
        const content = readFileSync(logPath, 'utf8');
        const lines = content.trim().split('\n').filter(l => l);
        const events = lines.map(line => JSON.parse(line));

        // Verify chain integrity
        const verified = verifyChainIntegrity(events);

        return { events, verified };
    } catch (error) {
        return { events: [], verified: false, error: error.message };
    }
}

/**
 * Verify hash chain integrity
 */
export function verifyChainIntegrity(events) {
    if (events.length === 0) return true;

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const previousHash = i === 0 ? null : events[i - 1].hash;

        if (event.previousHash !== previousHash) {
            return false;
        }

        // Verify event's own hash
        const expectedHash = generateHash(
            { ...event, hash: undefined, previousHash: undefined },
            previousHash
        );

        if (event.hash !== expectedHash) {
            return false;
        }
    }

    return true;
}

/**
 * Generate audit report for a session
 */
export function generateAuditReport(sessionId) {
    const { events, verified } = readAuditTrail(sessionId);

    if (events.length === 0) {
        return {
            sessionId,
            generated: new Date().toISOString(),
            status: 'no_events',
            events: []
        };
    }

    // Categorize events
    const categorized = {
        session: [],
        phase: [],
        llm: [],
        human: [],
        config: [],
        security: [],
        ethics: []
    };

    for (const event of events) {
        if (event.type.startsWith('session_')) categorized.session.push(event);
        else if (event.type.startsWith('phase_')) categorized.phase.push(event);
        else if (event.type.startsWith('llm_')) categorized.llm.push(event);
        else if (event.type.startsWith('human_')) categorized.human.push(event);
        else if (event.type.startsWith('config_') || event.type.startsWith('persona_')) categorized.config.push(event);
        else if (event.type.startsWith('auth_') || event.type.startsWith('validation_')) categorized.security.push(event);
        else if (event.type.startsWith('bias_') || event.type.startsWith('ethical_')) categorized.ethics.push(event);
    }

    // Calculate metrics
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const duration = new Date(lastEvent.timestamp) - new Date(firstEvent.timestamp);

    return {
        sessionId,
        generated: new Date().toISOString(),
        verified,
        integrity: verified ? 'VALID' : 'CHAIN_BROKEN',
        summary: {
            totalEvents: events.length,
            startTime: firstEvent.timestamp,
            endTime: lastEvent.timestamp,
            durationMs: duration,
            eventsByCategory: {
                session: categorized.session.length,
                phase: categorized.phase.length,
                llm: categorized.llm.length,
                human: categorized.human.length,
                config: categorized.config.length,
                security: categorized.security.length,
                ethics: categorized.ethics.length
            }
        },
        humanActions: categorized.human.map(e => ({
            type: e.type,
            timestamp: e.timestamp,
            action: e.data?.action,
            reason: e.data?.reason
        })),
        ethicsEvents: categorized.ethics,
        events: events
    };
}

/**
 * Export audit trail to file
 */
export function exportAuditTrail(sessionId, format = 'json') {
    const report = generateAuditReport(sessionId);
    const exportDir = join(AUDIT_DIR, 'exports');

    if (!existsSync(exportDir)) {
        mkdirSync(exportDir, { recursive: true });
    }

    const filename = `audit-${sessionId}-${Date.now()}`;

    if (format === 'json') {
        const path = join(exportDir, `${filename}.json`);
        writeFileSync(path, JSON.stringify(report, null, 2));
        return path;
    }

    if (format === 'md') {
        const path = join(exportDir, `${filename}.md`);
        const md = formatAuditReportMarkdown(report);
        writeFileSync(path, md);
        return path;
    }

    return null;
}

/**
 * Format audit report as Markdown
 */
function formatAuditReportMarkdown(report) {
    const lines = [
        `# Audit Trail Report`,
        ``,
        `**Session**: ${report.sessionId}`,
        `**Generated**: ${report.generated}`,
        `**Integrity**: ${report.integrity}`,
        ``,
        `## Summary`,
        ``,
        `- Total Events: ${report.summary.totalEvents}`,
        `- Duration: ${(report.summary.durationMs / 1000).toFixed(1)}s`,
        `- Start: ${report.summary.startTime}`,
        `- End: ${report.summary.endTime}`,
        ``,
        `## Events by Category`,
        ``,
        `| Category | Count |`,
        `|----------|-------|`,
    ];

    for (const [cat, count] of Object.entries(report.summary.eventsByCategory)) {
        lines.push(`| ${cat} | ${count} |`);
    }

    lines.push('');
    lines.push('## Human Actions');
    lines.push('');

    if (report.humanActions.length === 0) {
        lines.push('No human override actions recorded.');
    } else {
        for (const action of report.humanActions) {
            lines.push(`- **${action.type}** at ${action.timestamp}`);
            if (action.reason) lines.push(`  - Reason: ${action.reason}`);
        }
    }

    lines.push('');
    lines.push('## Ethics & Bias Events');
    lines.push('');

    if (report.ethicsEvents.length === 0) {
        lines.push('No ethical warnings or bias detections recorded.');
    } else {
        for (const event of report.ethicsEvents) {
            lines.push(`- **${event.type}** at ${event.timestamp}`);
            lines.push(`  - ${JSON.stringify(event.data)}`);
        }
    }

    lines.push('');
    lines.push('---');
    lines.push('*SPAR-Kit Audit Trail v1.0.0*');

    return lines.join('\n');
}

/**
 * Convenience loggers for common events
 */
export const AuditLog = {
    sessionCreated: (sessionId, decision, config) =>
        writeAuditEvent(
            createAuditEvent(AuditEventType.SESSION_CREATED, { decision, config }),
            sessionId
        ),

    phaseCompleted: (sessionId, phase, result) =>
        writeAuditEvent(
            createAuditEvent(AuditEventType.PHASE_COMPLETED, { phase, summary: result?.summary }),
            sessionId
        ),

    humanOverride: (sessionId, action, reason, original, modified) =>
        writeAuditEvent(
            createAuditEvent(AuditEventType.HUMAN_OVERRIDE, { action, reason, original, modified }),
            sessionId
        ),

    biasDetected: (sessionId, biases, score) =>
        writeAuditEvent(
            createAuditEvent(AuditEventType.BIAS_DETECTED, { biases, score }),
            sessionId
        ),

    llmCall: (sessionId, provider, model, tokens) =>
        writeAuditEvent(
            createAuditEvent(AuditEventType.LLM_REQUEST, { provider, model, tokens }),
            sessionId
        )
};

export default {
    AuditEventType,
    createAuditEvent,
    writeAuditEvent,
    readAuditTrail,
    verifyChainIntegrity,
    generateAuditReport,
    exportAuditTrail,
    AuditLog
};
