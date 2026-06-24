/**
 * SPAR-Kit Unit Tests: Checkpoint Serialization
 */

import { describe, test, expect } from '@jest/globals';

// Checkpoint structure
const createCheckpoint = (session, override = {}) => ({
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    sessionId: session.id,
    currentPhase: session.currentPhase || 'scope',
    lastPersona: session.lastPersona || null,
    partialResponses: session.partialResponses || {},
    metrics: session.metrics || { duration: 0, tokenCount: 0, llmCalls: 0 },
    hash: null, // Will be computed
    ...override
});

// Hash computation (simplified for testing)
const computeCheckpointHash = (checkpoint) => {
    const content = JSON.stringify({
        sessionId: checkpoint.sessionId,
        currentPhase: checkpoint.currentPhase,
        partialResponses: checkpoint.partialResponses
    });
    // Simple hash for testing (in production, use crypto)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `ckpt_${Math.abs(hash).toString(16)}`;
};

describe('Checkpoint: Serialization', () => {
    const mockSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        decision: 'Test decision',
        currentPhase: 'rumble',
        lastPersona: 'east',
        partialResponses: {
            north: 'Vision response complete',
            east: 'Challenger response in progress...'
        },
        metrics: { duration: 45, tokenCount: 1200, llmCalls: 2 }
    };

    test('creates checkpoint with required fields', () => {
        const checkpoint = createCheckpoint(mockSession);

        expect(checkpoint.version).toBe('1.0.0');
        expect(checkpoint.sessionId).toBe(mockSession.id);
        expect(checkpoint.currentPhase).toBe('rumble');
        expect(checkpoint.timestamp).toBeDefined();
    });

    test('preserves partial responses', () => {
        const checkpoint = createCheckpoint(mockSession);

        expect(checkpoint.partialResponses.north).toBe('Vision response complete');
        expect(checkpoint.partialResponses.east).toContain('in progress');
    });

    test('tracks last persona', () => {
        const checkpoint = createCheckpoint(mockSession);

        expect(checkpoint.lastPersona).toBe('east');
    });

    test('includes metrics', () => {
        const checkpoint = createCheckpoint(mockSession);

        expect(checkpoint.metrics.duration).toBe(45);
        expect(checkpoint.metrics.tokenCount).toBe(1200);
        expect(checkpoint.metrics.llmCalls).toBe(2);
    });

    test('serializes to valid JSON', () => {
        const checkpoint = createCheckpoint(mockSession);
        const json = JSON.stringify(checkpoint);

        expect(() => JSON.parse(json)).not.toThrow();
    });

    test('deserializes correctly', () => {
        const checkpoint = createCheckpoint(mockSession);
        const json = JSON.stringify(checkpoint);
        const restored = JSON.parse(json);

        expect(restored.sessionId).toBe(mockSession.id);
        expect(restored.currentPhase).toBe('rumble');
        expect(restored.partialResponses.north).toBe('Vision response complete');
    });
});

describe('Checkpoint: Hash Integrity', () => {
    test('computes deterministic hash', () => {
        const checkpoint = createCheckpoint({
            id: 'test-id',
            currentPhase: 'rumble',
            partialResponses: { north: 'test' }
        });

        const hash1 = computeCheckpointHash(checkpoint);
        const hash2 = computeCheckpointHash(checkpoint);

        expect(hash1).toBe(hash2);
    });

    test('different content produces different hash', () => {
        const checkpoint1 = createCheckpoint({
            id: 'test-id',
            partialResponses: { north: 'response A' }
        });

        const checkpoint2 = createCheckpoint({
            id: 'test-id',
            partialResponses: { north: 'response B' }
        });

        const hash1 = computeCheckpointHash(checkpoint1);
        const hash2 = computeCheckpointHash(checkpoint2);

        expect(hash1).not.toBe(hash2);
    });

    test('hash format is valid', () => {
        const checkpoint = createCheckpoint({ id: 'test' });
        const hash = computeCheckpointHash(checkpoint);

        expect(hash).toMatch(/^ckpt_[0-9a-f]+$/);
    });
});

describe('Checkpoint: Phase Tracking', () => {
    const phases = ['scope', 'populate', 'announce', 'rumble', 'knit', 'interrogate', 'transmit'];

    test('tracks all SPARKIT phases', () => {
        phases.forEach(phase => {
            const checkpoint = createCheckpoint({ id: 'test', currentPhase: phase });
            expect(checkpoint.currentPhase).toBe(phase);
        });
    });

    test('defaults to scope phase', () => {
        const checkpoint = createCheckpoint({ id: 'test' });
        expect(checkpoint.currentPhase).toBe('scope');
    });
});

describe('Checkpoint: Resume Logic', () => {
    test('can resume from checkpoint', () => {
        const checkpoint = {
            sessionId: 'test-id',
            currentPhase: 'rumble',
            lastPersona: 'east',
            partialResponses: {
                north: 'Complete response',
                east: 'Partial...'
            }
        };

        // Simulate resume logic
        const shouldSkip = (persona) => {
            return checkpoint.partialResponses[persona] &&
                !checkpoint.partialResponses[persona].endsWith('...');
        };

        expect(shouldSkip('north')).toBe(true);
        expect(shouldSkip('east')).toBe(false);
        expect(shouldSkip('south')).toBe(false);
    });

    test('resumes from correct phase', () => {
        const checkpoint = { currentPhase: 'knit' };
        const phases = ['scope', 'populate', 'announce', 'rumble', 'knit', 'interrogate', 'transmit'];

        const resumeIndex = phases.indexOf(checkpoint.currentPhase);

        expect(resumeIndex).toBe(4);
        expect(phases.slice(0, resumeIndex)).toEqual(['scope', 'populate', 'announce', 'rumble']);
    });
});

describe('Checkpoint: Edge Cases', () => {
    test('handles empty partial responses', () => {
        const checkpoint = createCheckpoint({
            id: 'test',
            partialResponses: {}
        });

        expect(Object.keys(checkpoint.partialResponses)).toHaveLength(0);
    });

    test('handles large responses', () => {
        const largeResponse = 'A'.repeat(50000);
        const checkpoint = createCheckpoint({
            id: 'test',
            partialResponses: { north: largeResponse }
        });

        expect(checkpoint.partialResponses.north.length).toBe(50000);
    });

    test('handles special characters in responses', () => {
        const checkpoint = createCheckpoint({
            id: 'test',
            partialResponses: {
                north: 'Response with "quotes" and \'apostrophes\' and <tags>'
            }
        });

        const json = JSON.stringify(checkpoint);
        const restored = JSON.parse(json);

        expect(restored.partialResponses.north).toContain('"quotes"');
    });

    test('handles unicode in responses', () => {
        const checkpoint = createCheckpoint({
            id: 'test',
            partialResponses: {
                north: 'தமிழ் response with émojis 🥊'
            }
        });

        const json = JSON.stringify(checkpoint);
        const restored = JSON.parse(json);

        expect(restored.partialResponses.north).toContain('தமிழ்');
        expect(restored.partialResponses.north).toContain('🥊');
    });
});
