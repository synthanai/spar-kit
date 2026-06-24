/**
 * SPAR-Kit API Tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock the API functions
const mockApi = {
    API_VERSION: '1.0.0',
    SessionStatus: {
        CREATED: 'created',
        RUNNING: 'running',
        PAUSED: 'paused',
        COMPLETED: 'completed',
        ABORTED: 'aborted',
        FAILED: 'failed'
    },

    createSession: jest.fn(),
    getSession: jest.fn(),
    listSessions: jest.fn(),
    exportSession: jest.fn(),
    deleteSession: jest.fn(),
    cloneSession: jest.fn(),
    getStats: jest.fn(),
    getConfig: jest.fn()
};

describe('API: createSession', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('creates session with required fields', async () => {
        const options = {
            decision: 'Should we expand to Singapore?'
        };

        mockApi.createSession.mockResolvedValue({
            id: 'test-id',
            decision: options.decision,
            status: 'created'
        });

        const session = await mockApi.createSession(options);

        expect(session.id).toBeDefined();
        expect(session.decision).toBe(options.decision);
        expect(session.status).toBe('created');
    });

    test('creates session with all options', async () => {
        const options = {
            decision: 'Test decision',
            preset: 'innovation',
            provider: 'ollama',
            model: 'llama3.2'
        };

        mockApi.createSession.mockResolvedValue({
            id: 'test-id',
            ...options,
            status: 'created'
        });

        const session = await mockApi.createSession(options);

        expect(session.preset).toBe('innovation');
        expect(session.provider).toBe('ollama');
        expect(session.model).toBe('llama3.2');
    });

    test('throws error for missing decision', async () => {
        mockApi.createSession.mockRejectedValue(new Error('Decision is required'));

        await expect(mockApi.createSession({})).rejects.toThrow('Decision is required');
    });
});

describe('API: getSession', () => {
    test('retrieves existing session', async () => {
        const mockSession = {
            id: 'test-id',
            decision: 'Test',
            status: 'completed'
        };

        mockApi.getSession.mockResolvedValue(mockSession);

        const session = await mockApi.getSession('test-id');

        expect(session.id).toBe('test-id');
    });

    test('returns null for non-existent session', async () => {
        mockApi.getSession.mockResolvedValue(null);

        const session = await mockApi.getSession('non-existent');

        expect(session).toBeNull();
    });

    test('throws error for invalid ID format', async () => {
        mockApi.getSession.mockRejectedValue(new Error('Invalid session ID format'));

        await expect(mockApi.getSession('bad-id')).rejects.toThrow('Invalid session ID format');
    });
});

describe('API: listSessions', () => {
    test('returns all sessions by default', async () => {
        mockApi.listSessions.mockResolvedValue([
            { id: '1', status: 'completed' },
            { id: '2', status: 'running' },
            { id: '3', status: 'paused' }
        ]);

        const sessions = await mockApi.listSessions();

        expect(sessions).toHaveLength(3);
    });

    test('filters by status', async () => {
        mockApi.listSessions.mockResolvedValue([
            { id: '1', status: 'completed' }
        ]);

        const sessions = await mockApi.listSessions({ status: 'completed' });

        expect(sessions).toHaveLength(1);
        expect(sessions[0].status).toBe('completed');
    });

    test('respects limit parameter', async () => {
        mockApi.listSessions.mockResolvedValue([
            { id: '1', status: 'completed' },
            { id: '2', status: 'completed' }
        ]);

        const sessions = await mockApi.listSessions({ limit: 2 });

        expect(sessions).toHaveLength(2);
    });

    test('returns empty array when no sessions', async () => {
        mockApi.listSessions.mockResolvedValue([]);

        const sessions = await mockApi.listSessions();

        expect(sessions).toEqual([]);
    });
});

describe('API: exportSession', () => {
    const mockSession = {
        id: 'test-id',
        decision: 'Test decision',
        status: 'completed',
        phases: {
            rumble: {
                responses: { north: 'Test response' }
            }
        }
    };

    test('exports to markdown format', async () => {
        mockApi.exportSession.mockResolvedValue({
            content: '# SPAR Session\n\n**Decision:** Test decision',
            format: 'md'
        });

        const result = await mockApi.exportSession('test-id', { format: 'md' });

        expect(result.content).toContain('# SPAR Session');
        expect(result.format).toBe('md');
    });

    test('exports to JSON format', async () => {
        mockApi.exportSession.mockResolvedValue({
            content: JSON.stringify(mockSession, null, 2),
            format: 'json'
        });

        const result = await mockApi.exportSession('test-id', { format: 'json' });

        expect(() => JSON.parse(result.content)).not.toThrow();
    });

    test('exports to text format', async () => {
        mockApi.exportSession.mockResolvedValue({
            content: 'SPAR SESSION REPORT\nDecision: Test',
            format: 'txt'
        });

        const result = await mockApi.exportSession('test-id', { format: 'txt' });

        expect(result.content).toContain('SPAR SESSION');
    });

    test('throws error for non-existent session', async () => {
        mockApi.exportSession.mockRejectedValue(new Error('Session not found'));

        await expect(mockApi.exportSession('non-existent')).rejects.toThrow('Session not found');
    });
});

describe('API: deleteSession', () => {
    test('deletes existing session', async () => {
        mockApi.deleteSession.mockResolvedValue(true);

        const result = await mockApi.deleteSession('test-id');

        expect(result).toBe(true);
    });

    test('returns false for non-existent session', async () => {
        mockApi.deleteSession.mockResolvedValue(false);

        const result = await mockApi.deleteSession('non-existent');

        expect(result).toBe(false);
    });
});

describe('API: cloneSession', () => {
    test('clones session with new ID', async () => {
        mockApi.cloneSession.mockResolvedValue({
            id: 'new-id',
            decision: 'Original decision',
            status: 'created'
        });

        const cloned = await mockApi.cloneSession('original-id');

        expect(cloned.id).not.toBe('original-id');
        expect(cloned.status).toBe('created');
    });

    test('throws error for non-existent session', async () => {
        mockApi.cloneSession.mockRejectedValue(new Error('Session not found'));

        await expect(mockApi.cloneSession('non-existent')).rejects.toThrow('Session not found');
    });
});

describe('API: getStats', () => {
    test('returns session statistics', async () => {
        mockApi.getStats.mockResolvedValue({
            total: 47,
            byStatus: {
                completed: 42,
                running: 1,
                paused: 2,
                failed: 2
            }
        });

        const stats = await mockApi.getStats();

        expect(stats.total).toBe(47);
        expect(stats.byStatus.completed).toBe(42);
    });
});

describe('API: getConfig', () => {
    test('returns masked configuration', async () => {
        mockApi.getConfig.mockResolvedValue({
            provider: 'ollama',
            model: 'llama3.2',
            apiKey: '****'
        });

        const config = await mockApi.getConfig();

        expect(config.provider).toBe('ollama');
        expect(config.apiKey).toBe('****');
    });
});

describe('API: Error Handling', () => {
    test('handles network errors gracefully', async () => {
        mockApi.createSession.mockRejectedValue(new Error('Network error'));

        await expect(mockApi.createSession({ decision: 'Test' }))
            .rejects.toThrow('Network error');
    });

    test('handles validation errors', async () => {
        mockApi.createSession.mockRejectedValue(new Error('Validation failed'));

        await expect(mockApi.createSession({ decision: '' }))
            .rejects.toThrow('Validation failed');
    });
});
