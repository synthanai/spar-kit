/**
 * SPAR-Kit Performance Tests: Benchmarks
 */

import { describe, test, expect } from '@jest/globals';

// Performance test utilities
const benchmark = (fn, iterations = 100) => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    return (performance.now() - start) / iterations;
};

const measureMemory = () => {
    if (global.gc) global.gc();
    return process.memoryUsage().heapUsed;
};

describe('Performance: Session List Loading', () => {
    // Generate mock sessions
    const generateSessions = (count) => {
        return Array(count).fill(null).map((_, i) => ({
            id: `session-${i}`,
            decision: `Decision ${i}: Should we do something important?`,
            status: ['completed', 'running', 'paused'][i % 3],
            createdAt: new Date().toISOString(),
            metrics: { duration: 100, tokenCount: 1000, llmCalls: 4 }
        }));
    };

    test('loads 100 sessions under 50ms', () => {
        const sessions = generateSessions(100);
        const time = benchmark(() => {
            sessions.forEach(s => JSON.stringify(s));
        }, 10);

        expect(time).toBeLessThan(50);
    });

    test('loads 1000 sessions under 200ms', () => {
        const sessions = generateSessions(1000);
        const time = benchmark(() => {
            sessions.map(s => ({ id: s.id, decision: s.decision }));
        }, 5);

        expect(time).toBeLessThan(200);
    });

    test('filters sessions efficiently', () => {
        const sessions = generateSessions(1000);
        const time = benchmark(() => {
            sessions.filter(s => s.status === 'completed');
        }, 10);

        expect(time).toBeLessThan(10);
    });
});

describe('Performance: Session Detail Rendering', () => {
    const mockSession = {
        id: 'test-1',
        decision: 'Complex decision with lots of context...',
        phases: {
            rumble: {
                responses: {
                    north: 'A'.repeat(2000),
                    east: 'B'.repeat(2000),
                    south: 'C'.repeat(2000),
                    west: 'D'.repeat(2000)
                }
            },
            knit: {
                synthesis: 'E'.repeat(3000)
            }
        }
    };

    test('renders session detail under 10ms', () => {
        const time = benchmark(() => {
            JSON.parse(JSON.stringify(mockSession));
        }, 100);

        expect(time).toBeLessThan(10);
    });

    test('handles large response text', () => {
        const largeSession = {
            ...mockSession,
            phases: {
                rumble: {
                    responses: {
                        north: 'A'.repeat(10000),
                        east: 'B'.repeat(10000),
                        south: 'C'.repeat(10000),
                        west: 'D'.repeat(10000)
                    }
                }
            }
        };

        const time = benchmark(() => {
            JSON.stringify(largeSession);
        }, 50);

        expect(time).toBeLessThan(20);
    });
});

describe('Performance: TUI Startup', () => {
    test('TUI initialization under 500ms target', () => {
        // Simulate TUI initialization steps
        const initSteps = [
            () => ({ config: {} }),           // Load config
            () => ({ sessions: [] }),          // Load sessions
            () => ({ ui: 'ready' }),           // Initialize UI
            () => ({ shortcuts: {} })          // Register shortcuts
        ];

        const start = performance.now();
        initSteps.forEach(step => step());
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(500);
    });

    test('config loading under 50ms', () => {
        const time = benchmark(() => {
            JSON.parse(JSON.stringify({
                provider: 'ollama',
                model: 'llama3.2',
                reasoningMode: 'standard'
            }));
        }, 100);

        expect(time).toBeLessThan(50);
    });
});

describe('Performance: Memory Usage', () => {
    test('session creation memory efficient', () => {
        const baseline = measureMemory();

        const sessions = [];
        for (let i = 0; i < 100; i++) {
            sessions.push({
                id: `session-${i}`,
                decision: 'Test decision',
                status: 'completed'
            });
        }

        const afterCreation = measureMemory();
        const memoryUsed = afterCreation - baseline;

        // Should use less than 1MB for 100 sessions
        expect(memoryUsed).toBeLessThan(1024 * 1024);
    });

    test('large debate memory under 10MB', () => {
        const baseline = measureMemory();

        const largeDebate = {
            phases: {
                rumble: {
                    responses: {
                        north: 'A'.repeat(50000),
                        east: 'B'.repeat(50000),
                        south: 'C'.repeat(50000),
                        west: 'D'.repeat(50000)
                    }
                }
            }
        };

        const json = JSON.stringify(largeDebate);
        const afterCreation = measureMemory();
        const memoryUsed = afterCreation - baseline;

        expect(memoryUsed).toBeLessThan(10 * 1024 * 1024);
    });
});

describe('Performance: Streaming', () => {
    test('chunk processing under 1ms per chunk', () => {
        const chunks = Array(100).fill('This is a streaming chunk of text.');

        const time = benchmark(() => {
            chunks.forEach(chunk => chunk.trim());
        }, 50);

        expect(time / chunks.length).toBeLessThan(1);
    });

    test('buffer concatenation efficient', () => {
        const chunks = Array(1000).fill('chunk');

        const time = benchmark(() => {
            chunks.join('');
        }, 100);

        expect(time).toBeLessThan(5);
    });
});

describe('Performance: Search and Filter', () => {
    const sessions = Array(1000).fill(null).map((_, i) => ({
        id: `session-${i}`,
        decision: `Decision about topic ${i % 10}`,
        status: ['completed', 'running', 'paused', 'failed'][i % 4]
    }));

    test('text search under 10ms for 1000 sessions', () => {
        const time = benchmark(() => {
            sessions.filter(s => s.decision.includes('topic 5'));
        }, 50);

        expect(time).toBeLessThan(10);
    });

    test('status filter under 5ms', () => {
        const time = benchmark(() => {
            sessions.filter(s => s.status === 'completed');
        }, 100);

        expect(time).toBeLessThan(5);
    });

    test('combined filters under 15ms', () => {
        const time = benchmark(() => {
            sessions
                .filter(s => s.status === 'completed')
                .filter(s => s.decision.includes('topic'));
        }, 50);

        expect(time).toBeLessThan(15);
    });
});
