/**
 * SPAR-Kit TUI: SessionList Component
 * 
 * Interactive list of SPAR sessions with keyboard navigation.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { useSessionStore, SessionStatus } from '../store/sessions.js';
import { useNavigationStore, Views } from '../store/navigation.js';

/**
 * Format date for display
 */
function formatDate(isoString) {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

/**
 * Status indicator
 */
function StatusIndicator({ status }) {
    const indicators = {
        [SessionStatus.COMPLETED]: { symbol: '✓', color: 'green' },
        [SessionStatus.RUNNING]: { symbol: '●', color: 'yellow' },
        [SessionStatus.PAUSED]: { symbol: '◐', color: 'blue' },
        [SessionStatus.ABORTED]: { symbol: '✗', color: 'red' },
        [SessionStatus.FAILED]: { symbol: '✗', color: 'red' }
    };

    const { symbol, color } = indicators[status] || { symbol: '?', color: 'gray' };

    return <Text color={color}>{symbol}</Text>;
}

/**
 * Truncate text with ellipsis
 */
function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
}

/**
 * Session Row Component
 */
function SessionRow({ session, isSelected, index }) {
    const decision = truncate(session.decision, 50);
    const date = formatDate(session.metrics?.started_at);
    const preset = session.preset || 'custom';

    return (
        <Box>
            <Box width={3}>
                <Text color={isSelected ? 'cyan' : 'gray'}>
                    {isSelected ? '▶' : ' '}
                </Text>
            </Box>
            <Box width={3}>
                <StatusIndicator status={session.status} />
            </Box>
            <Box width={12}>
                <Text color="gray">{date}</Text>
            </Box>
            <Box width={52}>
                <Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
                    {decision}
                </Text>
            </Box>
            <Box>
                <Text color="magenta">{preset}</Text>
            </Box>
        </Box>
    );
}

/**
 * Section Header
 */
function SectionHeader({ title, count }) {
    return (
        <Box marginY={1}>
            <Text color="cyan" bold>─ {title} </Text>
            {count !== undefined && (
                <Text color="gray">({count})</Text>
            )}
            <Text color="cyan"> ─────────────────────────────────────────────</Text>
        </Box>
    );
}

/**
 * Empty State
 */
function EmptyState() {
    return (
        <Box flexDirection="column" alignItems="center" paddingY={2}>
            <Text color="gray">No debates yet.</Text>
            <Text color="gray" dimColor>Press N to start your first SPAR debate!</Text>
        </Box>
    );
}

/**
 * Main SessionList Component
 */
export function SessionList({ maxItems = 10 }) {
    const sessions = useSessionStore(state => state.sessions);
    const loadSessions = useSessionStore(state => state.loadSessions);
    const stats = useSessionStore(state => state.stats);
    const activeSessions = useSessionStore(state => state.getActiveSessions());
    const recentSessions = useSessionStore(state => state.getRecentSessions(7));

    const navigate = useNavigationStore(state => state.navigate);
    const viewSession = useNavigationStore(state => state.viewSession);
    const viewLive = useNavigationStore(state => state.viewLive);

    const [selectedIndex, setSelectedIndex] = useState(0);

    // Load sessions on mount
    useEffect(() => {
        loadSessions();
    }, []);

    // Build display list (active first, then recent)
    const displayList = [
        ...activeSessions,
        ...recentSessions.filter(s =>
            s.status !== SessionStatus.RUNNING && s.status !== SessionStatus.PAUSED
        )
    ].slice(0, maxItems);

    // Handle keyboard input
    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setSelectedIndex(i => Math.min(displayList.length - 1, i + 1));
        } else if (key.return) {
            const session = displayList[selectedIndex];
            if (session) {
                if (session.status === SessionStatus.RUNNING) {
                    viewLive(session.id);
                } else {
                    viewSession(session.id);
                }
            }
        } else if (input === 'n' || input === 'N') {
            navigate(Views.NEW_DEBATE);
        } else if (input === 'a' || input === 'A') {
            navigate(Views.SESSION_LIST);
        } else if (input === 'r' || input === 'R') {
            loadSessions();
        }
    });

    if (displayList.length === 0) {
        return <EmptyState />;
    }

    const hasActive = activeSessions.length > 0;

    return (
        <Box flexDirection="column">
            {/* Active Sessions */}
            {hasActive && (
                <>
                    <SectionHeader title="ACTIVE SESSIONS" count={activeSessions.length} />
                    {activeSessions.map((session, i) => (
                        <SessionRow
                            key={session.id}
                            session={session}
                            isSelected={selectedIndex === i}
                            index={i}
                        />
                    ))}
                </>
            )}

            {/* Recent Sessions */}
            <SectionHeader
                title="RECENT SESSIONS"
                count={recentSessions.length}
            />
            {recentSessions
                .filter(s => s.status !== SessionStatus.RUNNING && s.status !== SessionStatus.PAUSED)
                .slice(0, maxItems - activeSessions.length)
                .map((session, i) => {
                    const actualIndex = hasActive ? activeSessions.length + i : i;
                    return (
                        <SessionRow
                            key={session.id}
                            session={session}
                            isSelected={selectedIndex === actualIndex}
                            index={actualIndex}
                        />
                    );
                })
            }

            {/* View All link */}
            {sessions.length > maxItems && (
                <Box marginTop={1}>
                    <Text color="gray" dimColor>
                        Showing {displayList.length} of {sessions.length} •
                    </Text>
                    <Text color="cyan"> [A] View All</Text>
                </Box>
            )}
        </Box>
    );
}

export default SessionList;
