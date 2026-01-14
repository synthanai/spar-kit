/**
 * SPAR-Kit TUI: SessionDetail Component
 * 
 * Detailed view of a single SPAR session showing all phases and actions.
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { MinimalHeader } from './Header.js';
import { StatusBar, SESSION_SHORTCUTS } from './StatusBar.js';
import { useSessionStore, SessionStatus } from '../store/sessions.js';
import { useNavigationStore, Views } from '../store/navigation.js';

/**
 * Format duration
 */
function formatDuration(ms) {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Phase status indicator
 */
function PhaseStatus({ status }) {
    const indicators = {
        'completed': { symbol: '✓', color: 'green' },
        'in_progress': { symbol: '●', color: 'yellow' },
        'pending': { symbol: '○', color: 'gray' },
        'skipped': { symbol: '–', color: 'gray' }
    };

    const { symbol, color } = indicators[status] || indicators.pending;
    return <Text color={color}>{symbol}</Text>;
}

/**
 * Phase Row Component
 */
function PhaseRow({ name, label, phase, isSelected, onSelect }) {
    const phaseLabels = {
        scope: 'Define strategic question',
        populate: 'Instantiate personas',
        announce: 'Present the decision',
        rumble: 'Run the dialectic',
        knit: 'Generate synthesis',
        interrogate: 'Stress-test synthesis',
        transmit: 'Deliver recommendations'
    };

    const status = phase?.status || 'pending';
    const description = phaseLabels[name] || '';
    const hasThinking = phase?.hasThinking || phase?.thinking;

    return (
        <Box>
            <Box width={3}>
                <Text color={isSelected ? 'cyan' : 'gray'}>
                    {isSelected ? '▶' : ' '}
                </Text>
            </Box>
            <Box width={3}>
                <PhaseStatus status={status} />
            </Box>
            <Box width={14}>
                <Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
                    {label}
                </Text>
            </Box>
            <Box>
                <Text color="gray" dimColor>{description}</Text>
            </Box>
            {hasThinking && (
                <Box marginLeft={1}>
                    <Text color="yellow">🧠</Text>
                </Box>
            )}
            {status === 'completed' && (
                <Box marginLeft={2}>
                    <Text color="gray">[→]</Text>
                </Box>
            )}
        </Box>
    );
}

/**
 * Thinking Block Component - Displays AI reasoning chain
 * Used to show transparency for ultrathink mode
 */
function ThinkingBlock({ thinking, isExpanded, onToggle }) {
    if (!thinking) return null;

    const maxPreviewLength = 200;
    const preview = thinking.length > maxPreviewLength
        ? thinking.substring(0, maxPreviewLength) + '...'
        : thinking;

    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor="yellow"
            paddingX={2}
            paddingY={0}
            marginY={1}
        >
            <Box>
                <Text color="yellow" bold>🧠 AI Reasoning Chain</Text>
                <Text color="gray"> (Chain-of-Thought)</Text>
            </Box>
            <Box marginTop={1}>
                <Text color="gray" wrap="wrap">
                    {isExpanded ? thinking : preview}
                </Text>
            </Box>
            {thinking.length > maxPreviewLength && (
                <Box marginTop={1}>
                    <Text color="cyan" dimColor>
                        Press [T] to {isExpanded ? 'collapse' : 'expand'} thinking
                    </Text>
                </Box>
            )}
        </Box>
    );
}

// Export ThinkingBlock for use in phase detail views
export { ThinkingBlock };

/**
 * Session Metadata Component
 */
function SessionMeta({ session }) {
    const statusColors = {
        [SessionStatus.COMPLETED]: 'green',
        [SessionStatus.RUNNING]: 'yellow',
        [SessionStatus.PAUSED]: 'blue',
        [SessionStatus.ABORTED]: 'red',
        [SessionStatus.FAILED]: 'red'
    };

    const tierIcons = {
        standard: '🟢',
        ultrathink: '🟡',
        maximum: '🔴'
    };

    const tier = session.config?.tier || 'standard';
    const tierIcon = tierIcons[tier] || '🟢';
    const hasThinking = session.hasThinking || tier === 'ultrathink' || tier === 'maximum';

    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor="gray"
            paddingX={2}
            paddingY={0}
            marginBottom={1}
        >
            <Box>
                <Text color="gray">Status: </Text>
                <Text color={statusColors[session.status] || 'gray'} bold>
                    {session.status.toUpperCase()}
                </Text>
                <Text color="gray"> • Date: </Text>
                <Text>{new Date(session.metrics?.started_at).toLocaleString()}</Text>
            </Box>
            <Box>
                <Text color="gray">Preset: </Text>
                <Text color="magenta">{session.preset}</Text>
                <Text color="gray"> • Duration: </Text>
                <Text>{formatDuration(session.metrics?.duration_ms)}</Text>
            </Box>
            <Box>
                <Text color="gray">Model: </Text>
                <Text color="cyan">{session.model}</Text>
                <Text color="gray"> • Provider: </Text>
                <Text color="cyan">{session.provider}</Text>
            </Box>
            <Box>
                <Text color="gray">Reasoning: </Text>
                <Text>{tierIcon} {tier.charAt(0).toUpperCase() + tier.slice(1)}</Text>
                {hasThinking && (
                    <Text color="yellow"> (Chain-of-Thought enabled)</Text>
                )}
            </Box>
        </Box>
    );
}

/**
 * Main SessionDetail Component
 */
export function SessionDetail() {
    const selectedSessionId = useNavigationStore(state => state.viewState.selectedSessionId);
    const session = useSessionStore(state => state.getSession(selectedSessionId));
    const deleteSession = useSessionStore(state => state.deleteSession);
    const cloneSession = useSessionStore(state => state.cloneSession);

    const goBack = useNavigationStore(state => state.goBack);
    const viewPhase = useNavigationStore(state => state.viewPhase);
    const confirmDelete = useNavigationStore(state => state.confirmDelete);
    const showSuccess = useNavigationStore(state => state.showSuccess);

    const [selectedPhase, setSelectedPhase] = useState(0);

    const phases = [
        { name: 'scope', label: 'SCOPE' },
        { name: 'populate', label: 'POPULATE' },
        { name: 'announce', label: 'ANNOUNCE' },
        { name: 'rumble', label: 'RUMBLE' },
        { name: 'knit', label: 'KNIT' },
        { name: 'interrogate', label: 'INTERROGATE' },
        { name: 'transmit', label: 'TRANSMIT' }
    ];

    // Handle keyboard input
    useInput((input, key) => {
        if (key.leftArrow || key.escape) {
            goBack();
        } else if (key.upArrow) {
            setSelectedPhase(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setSelectedPhase(i => Math.min(phases.length - 1, i + 1));
        } else if (key.return) {
            const phase = phases[selectedPhase];
            if (session.phases?.[phase.name]?.status === 'completed') {
                viewPhase(phase.name);
            }
        } else if (input === 'e' || input === 'E') {
            // Export - TODO: implement export
            showSuccess('Exported to spar-session.md');
        } else if (input === 'c' || input === 'C') {
            const cloned = cloneSession(session.id);
            if (cloned) {
                showSuccess(`Cloned session: ${cloned.id.substring(0, 8)}...`);
            }
        } else if (input === 'd' || input === 'D') {
            confirmDelete(
                `Delete session "${session.decision.substring(0, 30)}..."?`,
                () => {
                    deleteSession(session.id);
                    goBack();
                }
            );
        }
    });

    if (!session) {
        return (
            <Box flexDirection="column">
                <MinimalHeader title="Session Not Found" />
                <Text color="red">Session with ID {selectedSessionId} not found.</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <MinimalHeader
                title={session.decision.substring(0, 60)}
                breadcrumb="Sessions"
            />

            {/* Metadata */}
            <SessionMeta session={session} />

            {/* Decision */}
            <Box marginBottom={1}>
                <Text color="gray">📋 </Text>
                <Text wrap="wrap">{session.decision}</Text>
            </Box>

            {/* Phases List */}
            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="cyan"
                paddingX={2}
                paddingY={0}
            >
                <Text color="cyan" bold>─ PROTOCOL PHASES ─</Text>
                {phases.map((phase, i) => (
                    <PhaseRow
                        key={phase.name}
                        name={phase.name}
                        label={phase.label}
                        phase={session.phases?.[phase.name]}
                        isSelected={selectedPhase === i}
                    />
                ))}
            </Box>

            {/* Status Bar */}
            <StatusBar shortcuts={SESSION_SHORTCUTS} />
        </Box>
    );
}

export default SessionDetail;
