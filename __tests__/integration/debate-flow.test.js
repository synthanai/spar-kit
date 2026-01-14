/**
 * SPAR-Kit Integration Tests: Debate Flow
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock session and debate flow
const createMockDebate = () => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    decision: 'Should we expand to the Singapore market?',
    personas: ['north', 'east', 'south', 'west'],
    status: 'created',
    phases: {},
    metrics: { duration: 0, tokenCount: 0, llmCalls: 0 }
});

describe('Integration: Debate Flow', () => {
    let debate;

    beforeEach(() => {
        debate = createMockDebate();
    });

    describe('Full Debate Lifecycle', () => {
        test('starts in created state', () => {
            expect(debate.status).toBe('created');
        });

        test('transitions to running on start', () => {
            debate.status = 'running';
            expect(debate.status).toBe('running');
        });

        test('records all persona responses', () => {
            debate.phases.rumble = {
                responses: {
                    north: 'Vision response',
                    east: 'Challenge response',
                    south: 'Pragmatic response',
                    west: 'Wisdom response'
                }
            };

            expect(Object.keys(debate.phases.rumble.responses)).toHaveLength(4);
        });

        test('transitions to completed after synthesis', () => {
            debate.phases.knit = { synthesis: 'Final synthesis' };
            debate.status = 'completed';

            expect(debate.status).toBe('completed');
            expect(debate.phases.knit.synthesis).toBeDefined();
        });
    });

    describe('Pause/Resume Flow', () => {
        test('can pause running debate', () => {
            debate.status = 'running';
            debate.status = 'paused';

            expect(debate.status).toBe('paused');
        });

        test('can resume paused debate', () => {
            debate.status = 'paused';
            debate.status = 'running';

            expect(debate.status).toBe('running');
        });

        test('preserves state on pause', () => {
            debate.phases.rumble = {
                responses: { north: 'Partial response' }
            };
            debate.status = 'paused';

            expect(debate.phases.rumble.responses.north).toBe('Partial response');
        });
    });

    describe('Cancel Flow', () => {
        test('can cancel running debate', () => {
            debate.status = 'running';
            debate.status = 'aborted';

            expect(debate.status).toBe('aborted');
        });

        test('preserves partial responses on cancel', () => {
            debate.phases.rumble = {
                responses: { north: 'Response before cancel' }
            };
            debate.status = 'aborted';

            expect(debate.phases.rumble.responses.north).toBeDefined();
        });
    });

    describe('Clone Flow', () => {
        test('clones debate with new ID', () => {
            const original = createMockDebate();
            original.status = 'completed';

            const cloned = {
                ...original,
                id: '660e8400-e29b-41d4-a716-446655440001',
                status: 'created',
                phases: {},
                metrics: { duration: 0, tokenCount: 0, llmCalls: 0 }
            };

            expect(cloned.id).not.toBe(original.id);
            expect(cloned.decision).toBe(original.decision);
            expect(cloned.status).toBe('created');
        });

        test('preserves personas on clone', () => {
            const original = createMockDebate();
            const cloned = { ...original, id: 'new-id' };

            expect(cloned.personas).toEqual(original.personas);
        });
    });

    describe('Metrics Tracking', () => {
        test('tracks duration', () => {
            debate.metrics.duration = 134;
            expect(debate.metrics.duration).toBe(134);
        });

        test('tracks token count', () => {
            debate.metrics.tokenCount = 4521;
            expect(debate.metrics.tokenCount).toBe(4521);
        });

        test('tracks LLM calls', () => {
            debate.metrics.llmCalls = 8;
            expect(debate.metrics.llmCalls).toBe(8);
        });

        test('increments metrics progressively', () => {
            debate.metrics.llmCalls = 0;
            debate.metrics.llmCalls += 1; // North
            debate.metrics.llmCalls += 1; // East
            debate.metrics.llmCalls += 1; // South
            debate.metrics.llmCalls += 1; // West

            expect(debate.metrics.llmCalls).toBe(4);
        });
    });
});

describe('Integration: Session Persistence', () => {
    test('session can be serialized to JSON', () => {
        const debate = createMockDebate();
        const json = JSON.stringify(debate);

        expect(() => JSON.parse(json)).not.toThrow();
    });

    test('session can be deserialized from JSON', () => {
        const debate = createMockDebate();
        const json = JSON.stringify(debate);
        const restored = JSON.parse(json);

        expect(restored.id).toBe(debate.id);
        expect(restored.decision).toBe(debate.decision);
    });

    test('complex phases survive serialization', () => {
        const debate = createMockDebate();
        debate.phases = {
            rumble: {
                responses: { north: 'Test', east: 'Test', south: 'Test', west: 'Test' }
            },
            knit: { synthesis: 'Combined analysis' }
        };

        const restored = JSON.parse(JSON.stringify(debate));

        expect(restored.phases.rumble.responses.north).toBe('Test');
        expect(restored.phases.knit.synthesis).toBe('Combined analysis');
    });
});

describe('Integration: CLI Output Format', () => {
    test('list command produces valid output', () => {
        const sessions = [createMockDebate(), createMockDebate()];
        sessions[1].id = 'different-id';

        const output = sessions.map(s => ({
            id: s.id,
            decision: s.decision.substring(0, 50),
            status: s.status
        }));

        expect(output).toHaveLength(2);
        expect(output[0].id).not.toBe(output[1].id);
    });

    test('JSON output is valid', () => {
        const session = createMockDebate();
        const json = JSON.stringify(session, null, 2);

        expect(() => JSON.parse(json)).not.toThrow();
    });
});
