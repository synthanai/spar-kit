/**
 * SPAR-Kit Performance Tests
 * 
 * Tests for performance benchmarks and memory usage.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { performance } from 'perf_hooks';
import { createSession, SessionStatus } from '../../cli/tui/store/sessions.js';

// ============================================
// PERFORMANCE TARGETS
// ============================================

const TARGETS = {
    SESSION_CREATE_MS: 5,         // < 5ms to create a session
    SESSION_LIST_1000_MS: 200,    // < 200ms to render 1000 sessions
    TUI_STARTUP_MS: 500,          // < 500ms TUI startup
    MEMORY_IDLE_MB: 100           // < 100MB idle memory (includes Jest overhead)
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateMockSessions(count) {
    const sessions = [];
    for (let i = 0; i < count; i++) {
        sessions.push({
            id: `session-${i}-${Math.random().toString(36).substring(7)}`,
            version: '3.1.0',
            status: ['completed', 'running', 'paused', 'failed'][i % 4],
            decision: `Test decision ${i}: Should we implement feature ${i} in our system?`,
            preset: ['innovation', 'crisis', 'ethics', 'startup'][i % 4],
            provider: 'ollama',
            model: 'mistral:latest',
            phases: {
                scope: { status: 'completed' },
                populate: { status: 'completed', personas: ['visionary', 'challenger', 'pragmatist', 'sage'] },
                announce: { status: 'completed' },
                rumble: { status: 'completed', rounds: [] },
                knit: { status: 'completed', synthesis: 'Test synthesis content...' },
                interrogate: { status: 'completed', critiques: [] },
                transmit: { status: 'completed', recommendations: 'Test recommendations...' }
            },
            metrics: {
                started_at: new Date(Date.now() - i * 3600000).toISOString(),
                updated_at: new Date(Date.now() - i * 1800000).toISOString(),
                completed_at: new Date().toISOString(),
                total_tokens: Math.floor(Math.random() * 10000) + 1000,
                llm_calls: Math.floor(Math.random() * 20) + 5,
                duration_ms: Math.floor(Math.random() * 600000) + 60000
            }
        });
    }
    return sessions;
}

function measureTime(fn) {
    const start = performance.now();
    fn();
    return performance.now() - start;
}

async function measureTimeAsync(fn) {
    const start = performance.now();
    await fn();
    return performance.now() - start;
}

function getMemoryUsageMB() {
    const usage = process.memoryUsage();
    return usage.heapUsed / 1024 / 1024;
}

// ============================================
// SESSION CREATION PERFORMANCE
// ============================================

describe('Session Creation Performance', () => {
    test(`creates session in < ${TARGETS.SESSION_CREATE_MS}ms`, () => {
        const times = [];

        for (let i = 0; i < 100; i++) {
            const time = measureTime(() => {
                createSession(`Test decision ${i}`, 'innovation', 'ollama', 'mistral:latest');
            });
            times.push(time);
        }

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const maxTime = Math.max(...times);

        console.log(`Session Creation: avg=${avgTime.toFixed(2)}ms, max=${maxTime.toFixed(2)}ms`);

        expect(avgTime).toBeLessThan(TARGETS.SESSION_CREATE_MS);
    });

    test('batch creation of 100 sessions < 100ms', () => {
        const time = measureTime(() => {
            for (let i = 0; i < 100; i++) {
                createSession(`Batch test ${i}`);
            }
        });

        console.log(`Batch 100 sessions: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(100);
    });
});

// ============================================
// SESSION LIST PERFORMANCE
// ============================================

describe('Session List Performance', () => {
    let mockSessions;

    beforeAll(() => {
        mockSessions = generateMockSessions(1000);
    });

    test(`renders 1000 sessions in < ${TARGETS.SESSION_LIST_1000_MS}ms`, () => {
        const time = measureTime(() => {
            // Simulate list rendering operations
            const sorted = [...mockSessions].sort((a, b) =>
                new Date(b.metrics.started_at) - new Date(a.metrics.started_at)
            );

            const filtered = sorted.filter(s => s.status === SessionStatus.COMPLETED);

            // Simulate display string generation
            const displays = filtered.map(s => ({
                id: s.id,
                decision: s.decision.substring(0, 50),
                date: new Date(s.metrics.started_at).toLocaleDateString(),
                status: s.status
            }));
        });

        console.log(`Render 1000 sessions: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(TARGETS.SESSION_LIST_1000_MS);
    });

    test('filters 1000 sessions by status < 50ms', () => {
        const time = measureTime(() => {
            const running = mockSessions.filter(s => s.status === 'running');
            const completed = mockSessions.filter(s => s.status === 'completed');
            const failed = mockSessions.filter(s => s.status === 'failed');
        });

        console.log(`Filter 1000 sessions: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(50);
    });

    test('searches 1000 sessions by text < 100ms', () => {
        const searchTerm = 'feature';

        const time = measureTime(() => {
            const results = mockSessions.filter(s =>
                s.decision.toLowerCase().includes(searchTerm)
            );
        });

        console.log(`Search 1000 sessions: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(100);
    });
});

// ============================================
// MEMORY USAGE TESTS
// ============================================

describe('Memory Usage', () => {
    test(`idle memory usage < ${TARGETS.MEMORY_IDLE_MB}MB`, () => {
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
        }

        const usage = getMemoryUsageMB();
        console.log(`Idle memory: ${usage.toFixed(2)}MB`);

        expect(usage).toBeLessThan(TARGETS.MEMORY_IDLE_MB);
    });

    test('memory usage with 1000 sessions < 100MB', () => {
        const sessions = generateMockSessions(1000);

        // Force GC if available
        if (global.gc) {
            global.gc();
        }

        const usage = getMemoryUsageMB();
        console.log(`Memory with 1000 sessions: ${usage.toFixed(2)}MB`);

        expect(usage).toBeLessThan(100);

        // Cleanup
        sessions.length = 0;
    });

    test('no significant memory leak after session operations', () => {
        const initialMemory = getMemoryUsageMB();

        // Perform many operations
        for (let i = 0; i < 100; i++) {
            const session = createSession(`Leak test ${i}`);
            // Simulate modifications
            session.phases.scope.status = 'completed';
            session.metrics.total_tokens = 1000;
        }

        // Force GC if available
        if (global.gc) {
            global.gc();
        }

        const finalMemory = getMemoryUsageMB();
        const increase = finalMemory - initialMemory;

        console.log(`Memory increase after 100 operations: ${increase.toFixed(2)}MB`);

        // Allow up to 10MB increase (reasonable for 100 sessions)
        expect(increase).toBeLessThan(10);
    });
});

// ============================================
// JSON SERIALIZATION PERFORMANCE
// ============================================

describe('JSON Serialization Performance', () => {
    test('serialize session to JSON < 1ms', () => {
        const session = createSession('Test decision', 'innovation', 'ollama', 'mistral');

        const time = measureTime(() => {
            JSON.stringify(session);
        });

        console.log(`Serialize session: ${time.toFixed(4)}ms`);
        expect(time).toBeLessThan(1);
    });

    test('serialize 100 sessions < 10ms', () => {
        const sessions = [];
        for (let i = 0; i < 100; i++) {
            sessions.push(createSession(`Test ${i}`));
        }

        const time = measureTime(() => {
            JSON.stringify(sessions);
        });

        console.log(`Serialize 100 sessions: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(10);
    });

    test('parse session JSON < 1ms', () => {
        const session = createSession('Test');
        const json = JSON.stringify(session);

        const time = measureTime(() => {
            JSON.parse(json);
        });

        console.log(`Parse session JSON: ${time.toFixed(4)}ms`);
        expect(time).toBeLessThan(1);
    });
});

// ============================================
// SORTING PERFORMANCE
// ============================================

describe('Sorting Performance', () => {
    test('sort 1000 sessions by date < 50ms', () => {
        const sessions = generateMockSessions(1000);

        const time = measureTime(() => {
            sessions.sort((a, b) =>
                new Date(b.metrics.started_at) - new Date(a.metrics.started_at)
            );
        });

        console.log(`Sort 1000 by date: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(50);
    });

    test('sort 1000 sessions by status < 50ms', () => {
        const sessions = generateMockSessions(1000);

        const time = measureTime(() => {
            sessions.sort((a, b) => a.status.localeCompare(b.status));
        });

        console.log(`Sort 1000 by status: ${time.toFixed(2)}ms`);
        expect(time).toBeLessThan(50);
    });
});

// ============================================
// STRESS TESTS
// ============================================

describe('Stress Tests', () => {
    test('handles 10000 sessions without crash', () => {
        const sessions = generateMockSessions(10000);

        expect(sessions.length).toBe(10000);

        // Basic operations should still work
        const completed = sessions.filter(s => s.status === 'completed');
        expect(completed.length).toBeGreaterThan(0);

        // Cleanup
        sessions.length = 0;
    });

    test('rapid session creation (1000 in 1 second)', () => {
        const start = performance.now();
        const sessions = [];

        for (let i = 0; i < 1000; i++) {
            sessions.push(createSession(`Rapid test ${i}`));
        }

        const duration = performance.now() - start;

        console.log(`1000 sessions created in: ${duration.toFixed(2)}ms`);
        expect(duration).toBeLessThan(1000);
        expect(sessions.length).toBe(1000);
    });
});
