/**
 * CompletionSummary Component
 * Shows session completion summary with key metrics and actions
 */

import React from 'react';
import { Box, Text, useInput } from 'ink';

import { useSessionsStore } from '../store/sessions.js';
import { useNavigationStore } from '../store/navigation.js';

/**
 * Metric card component
 */
function MetricCard({ label, value, color = 'white', icon }) {
    return (
        <Box
            borderStyle="round"
            borderColor={color}
            paddingX={2}
            paddingY={1}
            flexDirection="column"
            marginRight={1}
            minWidth={20}
        >
            <Text color="gray">{icon} {label}</Text>
            <Text color={color} bold>
                {value}
            </Text>
        </Box>
    );
}

/**
 * Phase summary row
 */
function PhaseSummary({ phase, data }) {
    const phaseNames = {
        scope: 'Scope',
        populate: 'Populate',
        announce: 'Announce',
        rumble: 'Rumble',
        knit: 'Knit',
        interrogate: 'Interrogate',
        transmit: 'Transmit'
    };

    const statusIcons = {
        completed: '✅',
        skipped: '⏭️',
        error: '❌',
        pending: '○'
    };

    const status = data?.status || 'pending';
    const duration = data?.duration_ms
        ? `${(data.duration_ms / 1000).toFixed(1)}s`
        : '-';

    return (
        <Box>
            <Box width={3}>
                <Text>{statusIcons[status] || '○'}</Text>
            </Box>
            <Box width={15}>
                <Text>{phaseNames[phase] || phase}</Text>
            </Box>
            <Box width={10}>
                <Text color="gray">{duration}</Text>
            </Box>
        </Box>
    );
}

/**
 * Action button
 */
function ActionButton({ label, shortcut, color = 'cyan' }) {
    return (
        <Box marginRight={2}>
            <Text color={color}>[{shortcut}]</Text>
            <Text color="gray"> {label}</Text>
        </Box>
    );
}

/**
 * Main CompletionSummary component
 */
export function CompletionSummary() {
    const { goBack, navigate } = useNavigationStore();
    const { currentSession } = useSessionsStore();

    useInput((input, key) => {
        if (key.escape || input === 'q') {
            goBack();
        }
        if (input === 'e') {
            // Export session (would trigger export flow)
            console.log('Export session...');
        }
        if (input === 'r') {
            // Clone and re-run
            navigate('builder');
        }
        if (input === 'd') {
            // View detail
            navigate('detail');
        }
    });

    if (!currentSession) {
        return (
            <Box padding={1}>
                <Text color="yellow">No session to summarize</Text>
            </Box>
        );
    }

    const metrics = currentSession.metrics || {};
    const duration = metrics.duration_ms
        ? `${(metrics.duration_ms / 1000).toFixed(1)}s`
        : '-';
    const completedAt = metrics.completed_at
        ? new Date(metrics.completed_at).toLocaleString()
        : '-';

    const phases = ['scope', 'populate', 'announce', 'rumble', 'knit', 'interrogate', 'transmit'];
    const completedPhases = phases.filter(p =>
        currentSession.phases?.[p]?.status === 'completed'
    ).length;

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box
                borderStyle="double"
                borderColor="green"
                paddingX={2}
                paddingY={1}
                flexDirection="column"
            >
                <Text bold color="green">
                    🎉 SESSION COMPLETE
                </Text>
                <Box marginTop={1}>
                    <Text wrap="wrap">
                        {currentSession.decision}
                    </Text>
                </Box>
            </Box>

            {/* Key Metrics */}
            <Box marginTop={1}>
                <MetricCard
                    label="Duration"
                    value={duration}
                    color="cyan"
                    icon="⏱"
                />
                <MetricCard
                    label="LLM Calls"
                    value={metrics.llm_calls || 0}
                    color="yellow"
                    icon="📞"
                />
                <MetricCard
                    label="Tokens"
                    value={metrics.total_tokens || 0}
                    color="magenta"
                    icon="🔢"
                />
                <MetricCard
                    label="Phases"
                    value={`${completedPhases}/7`}
                    color="green"
                    icon="✓"
                />
            </Box>

            {/* Phase Breakdown */}
            <Box marginTop={1} flexDirection="column">
                <Text bold color="white">Phase Summary:</Text>
                <Box marginTop={1} flexDirection="column">
                    {phases.map(phase => (
                        <PhaseSummary
                            key={phase}
                            phase={phase}
                            data={currentSession.phases?.[phase]}
                        />
                    ))}
                </Box>
            </Box>

            {/* Recommendations Preview */}
            {currentSession.finalRecommendation && (
                <Box marginTop={1} flexDirection="column">
                    <Text bold color="white">📋 Top Recommendation:</Text>
                    <Box
                        marginTop={1}
                        borderStyle="round"
                        borderColor="green"
                        paddingX={2}
                        paddingY={1}
                    >
                        <Text wrap="wrap">
                            {currentSession.finalRecommendation.substring(0, 300)}
                            {currentSession.finalRecommendation.length > 300 ? '...' : ''}
                        </Text>
                    </Box>
                </Box>
            )}

            {/* Completion timestamp */}
            <Box marginTop={1}>
                <Text color="gray">
                    Completed: {completedAt}
                </Text>
            </Box>

            {/* Actions */}
            <Box marginTop={2}>
                <ActionButton label="Export" shortcut="E" color="cyan" />
                <ActionButton label="View Details" shortcut="D" color="white" />
                <ActionButton label="Re-run" shortcut="R" color="yellow" />
                <ActionButton label="Back" shortcut="Q" color="gray" />
            </Box>
        </Box>
    );
}

export default CompletionSummary;
