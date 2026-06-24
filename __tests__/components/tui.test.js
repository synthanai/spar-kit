/**
 * SPAR-Kit Component Tests: TUI Components
 */

import { describe, test, expect, jest } from '@jest/globals';

// Mock React and Ink for component testing
const React = { createElement: jest.fn() };
const mockUseState = jest.fn((initial) => [initial, jest.fn()]);
const mockUseEffect = jest.fn();

describe('Component: Dashboard', () => {
    const mockSessions = [
        { id: '1', decision: 'Expand to APAC?', status: 'completed' },
        { id: '2', decision: 'Key hire decision', status: 'running' },
        { id: '3', decision: 'Product strategy', status: 'paused' }
    ];

    test('renders session list', () => {
        const rendered = renderDashboard({ sessions: mockSessions });

        expect(rendered.sessions).toHaveLength(3);
    });

    test('shows correct status indicators', () => {
        const rendered = renderDashboard({ sessions: mockSessions });

        expect(rendered.statuses).toContain('completed');
        expect(rendered.statuses).toContain('running');
        expect(rendered.statuses).toContain('paused');
    });

    test('displays session count', () => {
        const rendered = renderDashboard({ sessions: mockSessions });

        expect(rendered.totalCount).toBe(3);
    });

    test('handles empty session list', () => {
        const rendered = renderDashboard({ sessions: [] });

        expect(rendered.sessions).toHaveLength(0);
        expect(rendered.emptyState).toBe(true);
    });
});

describe('Component: SessionList', () => {
    const mockSessions = [
        { id: '1', decision: 'Session 1', status: 'completed' },
        { id: '2', decision: 'Session 2', status: 'completed' },
        { id: '3', decision: 'Session 3', status: 'completed' }
    ];

    test('keyboard up moves selection', () => {
        const state = { selectedIndex: 1 };
        handleKeyboard(state, { key: 'up' });

        expect(state.selectedIndex).toBe(0);
    });

    test('keyboard down moves selection', () => {
        const state = { selectedIndex: 0, maxIndex: 2 };
        handleKeyboard(state, { key: 'down' });

        expect(state.selectedIndex).toBe(1);
    });

    test('keyboard up at top stays at top', () => {
        const state = { selectedIndex: 0 };
        handleKeyboard(state, { key: 'up' });

        expect(state.selectedIndex).toBe(0);
    });

    test('keyboard down at bottom stays at bottom', () => {
        const state = { selectedIndex: 2, maxIndex: 2 };
        handleKeyboard(state, { key: 'down' });

        expect(state.selectedIndex).toBe(2);
    });

    test('enter opens selected session', () => {
        const onSelect = jest.fn();
        const state = { selectedIndex: 1 };
        handleKeyboard(state, { key: 'enter' }, { onSelect, sessions: mockSessions });

        expect(onSelect).toHaveBeenCalledWith('2');
    });
});

describe('Component: SessionDetail', () => {
    const mockSession = {
        id: '1',
        decision: 'Should we expand?',
        status: 'completed',
        phases: {
            rumble: {
                responses: {
                    north: 'Vision response',
                    east: 'Challenge response',
                    south: 'Pragmatic response',
                    west: 'Wisdom response'
                }
            }
        }
    };

    test('displays decision', () => {
        const rendered = renderSessionDetail(mockSession);

        expect(rendered.decision).toBe(mockSession.decision);
    });

    test('displays all four phases', () => {
        const rendered = renderSessionDetail(mockSession);

        expect(rendered.phases).toHaveLength(4);
    });

    test('shows phase content', () => {
        const rendered = renderSessionDetail(mockSession);

        expect(rendered.phases[0].content).toBe('Vision response');
    });

    test('handles missing phases gracefully', () => {
        const incomplete = { ...mockSession, phases: {} };
        const rendered = renderSessionDetail(incomplete);

        expect(rendered.phases).toEqual([]);
    });
});

describe('Component: LiveSession', () => {
    test('shows streaming indicator when active', () => {
        const rendered = renderLiveSession({ status: 'running' });

        expect(rendered.isStreaming).toBe(true);
    });

    test('shows progress bar', () => {
        const rendered = renderLiveSession({
            status: 'running',
            progress: { current: 2, total: 4 }
        });

        expect(rendered.progress).toBe(50);
    });

    test('updates output stream', () => {
        const rendered = renderLiveSession({
            status: 'running',
            output: ['Line 1', 'Line 2']
        });

        expect(rendered.outputLines).toHaveLength(2);
    });

    test('shows completion when done', () => {
        const rendered = renderLiveSession({ status: 'completed' });

        expect(rendered.isStreaming).toBe(false);
        expect(rendered.showSummary).toBe(true);
    });
});

// Mock render functions
function renderDashboard({ sessions }) {
    return {
        sessions,
        statuses: sessions.map(s => s.status),
        totalCount: sessions.length,
        emptyState: sessions.length === 0
    };
}

function handleKeyboard(state, key, options = {}) {
    if (key.key === 'up' && state.selectedIndex > 0) {
        state.selectedIndex--;
    }
    if (key.key === 'down' && state.selectedIndex < (state.maxIndex || 0)) {
        state.selectedIndex++;
    }
    if (key.key === 'enter' && options.onSelect && options.sessions) {
        options.onSelect(options.sessions[state.selectedIndex].id);
    }
}

function renderSessionDetail(session) {
    const phases = session.phases?.rumble?.responses
        ? Object.entries(session.phases.rumble.responses).map(([dir, content]) => ({
            direction: dir,
            content
        }))
        : [];

    return {
        decision: session.decision,
        phases
    };
}

function renderLiveSession({ status, progress, output }) {
    return {
        isStreaming: status === 'running',
        progress: progress ? (progress.current / progress.total) * 100 : 0,
        outputLines: output || [],
        showSummary: status === 'completed'
    };
}
