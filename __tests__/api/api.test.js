/**
 * SPAR-Kit API Tests
 * 
 * Tests for the programmatic API.
 */

import { describe, test, expect, beforeAll, beforeEach, jest } from '@jest/globals';

// Mock fs module before importing API
jest.mock('fs', () => ({
    existsSync: jest.fn(() => true),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(() => '{}'),
    writeFileSync: jest.fn(),
    readdirSync: jest.fn(() => []),
    unlinkSync: jest.fn(),
    statSync: jest.fn(() => ({ mode: 0o600 }))
}));

import {
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
} from '../../cli/api/index.js';

// ============================================
// INITIALIZATION TESTS
// ============================================

describe('API Initialization', () => {
    test('initialize returns API info', () => {
        const result = initialize();

        expect(result.version).toBe(API_VERSION);
        expect(result.provider).toBeDefined();
        expect(result.model).toBeDefined();
        expect(typeof result.sessionCount).toBe('number');
    });

    test('API_VERSION follows semver', () => {
        expect(API_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
});

// ============================================
// SESSION CREATION TESTS
// ============================================

describe('createSession API', () => {
    beforeAll(() => {
        initialize();
    });

    test('creates session with valid decision', () => {
        const session = createSession({
            decision: 'Should we adopt a microservices architecture?'
        });

        expect(session.id).toBeDefined();
        expect(session.id).toMatch(/^[0-9a-f-]{36}$/i);
        expect(session.status).toBe(SessionStatus.RUNNING);
        expect(session.decision).toBe('Should we adopt a microservices architecture?');
        expect(session.createdAt).toBeDefined();
    });

    test('creates session with custom preset', () => {
        const session = createSession({
            decision: 'How should we respond to the crisis?',
            preset: 'crisis'
        });

        expect(session.preset).toBe('crisis');
    });

    test('creates session with custom provider', () => {
        const session = createSession({
            decision: 'What is the best strategy?',
            provider: 'openai',
            model: 'gpt-4'
        });

        expect(session.provider).toBe('openai');
        expect(session.model).toBe('gpt-4');
    });

    test('throws error for invalid decision (too short)', () => {
        expect(() => createSession({ decision: 'Hi' }))
            .toThrow('Invalid decision');
    });

    test('throws error for XSS in decision', () => {
        expect(() => createSession({
            decision: '<script>alert("xss")</script> what should we do?'
        })).toThrow('Invalid decision');
    });

    test('throws error for invalid preset', () => {
        expect(() => createSession({
            decision: 'Valid decision text here',
            preset: 'invalid-preset'
        })).toThrow('Invalid preset');
    });
});

// ============================================
// SESSION RETRIEVAL TESTS
// ============================================

describe('getSession API', () => {
    let testSessionId;

    beforeAll(() => {
        initialize();
        const session = createSession({
            decision: 'Test session for retrieval'
        });
        testSessionId = session.id;
    });

    test('retrieves session by valid ID', () => {
        const session = getSession(testSessionId);

        expect(session).toBeDefined();
        expect(session.id).toBe(testSessionId);
        expect(session.decision).toBe('Test session for retrieval');
    });

    test('returns null for non-existent ID', () => {
        const session = getSession('550e8400-e29b-41d4-a716-446655440000');

        expect(session).toBeNull();
    });

    test('throws error for invalid UUID format', () => {
        expect(() => getSession('not-a-uuid'))
            .toThrow('Invalid session ID');
    });

    test('sanitizes session data on retrieval', () => {
        const session = getSession(testSessionId);

        // Should not contain internal fields
        expect(session._filename).toBeUndefined();
        expect(session._internal).toBeUndefined();
    });
});

// ============================================
// SESSION LISTING TESTS
// ============================================

describe('listSessions API', () => {
    beforeAll(() => {
        initialize();
        // Create some test sessions
        for (let i = 0; i < 5; i++) {
            createSession({ decision: `Test session ${i} for listing` });
        }
    });

    test('lists all sessions', () => {
        const sessions = listSessions();

        expect(Array.isArray(sessions)).toBe(true);
        expect(sessions.length).toBeGreaterThan(0);
    });

    test('limits results', () => {
        const sessions = listSessions({ limit: 2 });

        expect(sessions.length).toBeLessThanOrEqual(2);
    });

    test('filters by status', () => {
        const sessions = listSessions({ status: SessionStatus.RUNNING });

        expect(sessions.every(s => s.status === SessionStatus.RUNNING)).toBe(true);
    });

    test('returns session summaries with expected fields', () => {
        const sessions = listSessions({ limit: 1 });

        if (sessions.length > 0) {
            expect(sessions[0].id).toBeDefined();
            expect(sessions[0].status).toBeDefined();
            expect(sessions[0].decision).toBeDefined();
            expect(sessions[0].createdAt).toBeDefined();
        }
    });

    test('truncates long decisions in summary', () => {
        const longDecision = 'x'.repeat(200);
        createSession({ decision: longDecision });

        const sessions = listSessions();
        const session = sessions.find(s => s.decision.startsWith('xxx'));

        if (session) {
            expect(session.decision.length).toBeLessThanOrEqual(100);
        }
    });
});

// ============================================
// SESSION EXPORT TESTS
// ============================================

describe('exportSession API', () => {
    let testSessionId;

    beforeAll(() => {
        initialize();
        const session = createSession({
            decision: 'Test session for export'
        });
        testSessionId = session.id;
    });

    test('exports session as markdown', () => {
        const result = exportSession(testSessionId, { format: 'md' });

        expect(result.content).toContain('# SPAR Session');
        expect(result.content).toContain('Test session for export');
        expect(result.format).toBe('md');
    });

    test('exports session as JSON', () => {
        const result = exportSession(testSessionId, { format: 'json' });

        expect(() => JSON.parse(result.content)).not.toThrow();
        expect(result.format).toBe('json');
    });

    test('exports session as text', () => {
        const result = exportSession(testSessionId, { format: 'txt' });

        expect(result.content).toContain('SPAR SESSION');
        expect(result.format).toBe('txt');
    });

    test('defaults to markdown format', () => {
        const result = exportSession(testSessionId);

        expect(result.format).toBe('md');
    });

    test('throws error for non-existent session', () => {
        expect(() => exportSession('550e8400-e29b-41d4-a716-446655440000'))
            .toThrow('Session not found');
    });

    test('throws error for invalid session ID', () => {
        expect(() => exportSession('invalid'))
            .toThrow('Invalid session ID');
    });
});

// ============================================
// SESSION DELETION TESTS
// ============================================

describe('deleteSession API', () => {
    test('deletes existing session', () => {
        initialize();
        const session = createSession({
            decision: 'Session to be deleted'
        });

        const result = deleteSession(session.id);

        expect(result).toBe(true);
        expect(getSession(session.id)).toBeNull();
    });

    test('returns false for non-existent session', () => {
        const result = deleteSession('550e8400-e29b-41d4-a716-446655440000');

        expect(result).toBe(false);
    });

    test('throws error for invalid ID', () => {
        expect(() => deleteSession('invalid'))
            .toThrow('Invalid session ID');
    });
});

// ============================================
// SESSION CLONING TESTS
// ============================================

describe('cloneSession API', () => {
    let originalSessionId;

    beforeAll(() => {
        initialize();
        const session = createSession({
            decision: 'Original session to clone',
            preset: 'ethics'
        });
        originalSessionId = session.id;
    });

    test('clones existing session', () => {
        const cloned = cloneSession(originalSessionId);

        expect(cloned.id).toBeDefined();
        expect(cloned.id).not.toBe(originalSessionId);
        expect(cloned.clonedFrom).toBe(originalSessionId);
        expect(cloned.status).toBe(SessionStatus.RUNNING);
    });

    test('throws error for non-existent session', () => {
        expect(() => cloneSession('550e8400-e29b-41d4-a716-446655440000'))
            .toThrow('Session not found');
    });
});

// ============================================
// STATISTICS TESTS
// ============================================

describe('getStats API', () => {
    test('returns session statistics', () => {
        initialize();
        const stats = getStats();

        expect(typeof stats.total).toBe('number');
        expect(typeof stats.completed).toBe('number');
        expect(typeof stats.running).toBe('number');
        expect(typeof stats.paused).toBe('number');
        expect(typeof stats.failed).toBe('number');
        expect(typeof stats.completionRate).toBe('number');
    });

    test('completion rate is percentage', () => {
        const stats = getStats();

        expect(stats.completionRate).toBeGreaterThanOrEqual(0);
        expect(stats.completionRate).toBeLessThanOrEqual(100);
    });
});

// ============================================
// CONFIGURATION TESTS
// ============================================

describe('getConfig API', () => {
    test('returns configuration without exposing API key', () => {
        initialize();
        const config = getConfig();

        expect(config.provider).toBeDefined();
        expect(config.model).toBeDefined();
        expect(typeof config.apiKeySet).toBe('boolean');
        // API key itself should NOT be exposed
        expect(config.apiKey).toBeUndefined();
    });

    test('includes TUI and debate settings', () => {
        const config = getConfig();

        expect(config.tui).toBeDefined();
        expect(config.debate).toBeDefined();
    });
});

// ============================================
// ERROR HANDLING TESTS
// ============================================

describe('API Error Handling', () => {
    test('all validation errors are descriptive', () => {
        try {
            createSession({ decision: 'x' });
        } catch (error) {
            expect(error.message).toContain('Invalid');
            expect(error.message.length).toBeGreaterThan(10);
        }
    });

    test('errors are thrown, not returned', () => {
        expect(() => getSession('invalid')).toThrow();
        expect(() => createSession({ decision: '' })).toThrow();
    });
});
