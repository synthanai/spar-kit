/**
 * PhaseView Component
 * Drill-down view for individual SPARKIT protocol phases
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useNavigationStore } from '../store/navigation.js';
import { useSessionsStore } from '../store/sessions.js';

/**
 * Phase metadata with descriptions and prompts
 */
const PHASE_INFO = {
    scope: {
        name: 'SCOPE',
        letter: 'S',
        description: 'Define the decision context and boundaries',
        color: 'cyan',
        icon: '🎯'
    },
    populate: {
        name: 'POPULATE',
        letter: 'P',
        description: 'Select and configure debate personas',
        color: 'blue',
        icon: '👥'
    },
    announce: {
        name: 'ANNOUNCE',
        letter: 'A',
        description: 'Present the challenge to all personas',
        color: 'magenta',
        icon: '📢'
    },
    rumble: {
        name: 'RUMBLE',
        letter: 'R',
        description: 'Personas debate and challenge each other',
        color: 'red',
        icon: '⚔️'
    },
    knit: {
        name: 'KNIT',
        letter: 'K',
        description: 'Synthesize tensions into coherent position',
        color: 'yellow',
        icon: '🧵'
    },
    interrogate: {
        name: 'INTERROGATE',
        letter: 'I',
        description: 'Stress-test the synthesis',
        color: 'gray',
        icon: '🔍'
    },
    transmit: {
        name: 'TRANSMIT',
        letter: 'T',
        description: 'Generate actionable recommendations',
        color: 'green',
        icon: '📤'
    }
};

/**
 * Phase status badge
 */
function PhaseStatusBadge({ status }) {
    const statusColors = {
        pending: 'gray',
        running: 'yellow',
        completed: 'green',
        skipped: 'gray',
        error: 'red'
    };

    const statusIcons = {
        pending: '○',
        running: '◐',
        completed: '●',
        skipped: '◌',
        error: '✗'
    };

    return (
        <Text color={statusColors[status] || 'gray'}>
            {statusIcons[status] || '○'} {status.toUpperCase()}
        </Text>
    );
}

/**
 * Response viewer with scrolling
 */
function ResponseViewer({ responses, personas }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const personaIds = Object.keys(responses || {});

    useInput((input, key) => {
        if (key.leftArrow && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
        if (key.rightArrow && selectedIndex < personaIds.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    });

    if (personaIds.length === 0) {
        return (
            <Box padding={1}>
                <Text color="gray" italic>No responses yet</Text>
            </Box>
        );
    }

    const currentId = personaIds[selectedIndex];
    const response = responses[currentId];
    const persona = personas?.[currentId] || { name: currentId, icon: '•' };

    return (
        <Box flexDirection="column">
            {/* Persona tabs */}
            <Box marginBottom={1}>
                {personaIds.map((id, i) => {
                    const p = personas?.[id] || { name: id, icon: '•' };
                    const isSelected = i === selectedIndex;
                    return (
                        <Box key={id} marginRight={2}>
                            <Text
                                color={isSelected ? 'cyan' : 'gray'}
                                bold={isSelected}
                            >
                                {p.icon} {p.name}
                            </Text>
                        </Box>
                    );
                })}
            </Box>

            {/* Navigation hint */}
            <Box marginBottom={1}>
                <Text color="gray" dimColor>
                    ← → to switch personas ({selectedIndex + 1}/{personaIds.length})
                </Text>
            </Box>

            {/* Response content */}
            <Box
                borderStyle="round"
                borderColor="cyan"
                paddingX={2}
                paddingY={1}
                flexDirection="column"
            >
                <Text color="cyan" bold>
                    {persona.icon} {persona.name}
                </Text>
                <Box marginTop={1}>
                    <Text wrap="wrap">
                        {response || 'No response'}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}

/**
 * Thinking block viewer (for ultrathink mode)
 */
function ThinkingViewer({ thinking }) {
    const [expanded, setExpanded] = useState(false);

    if (!thinking) return null;

    return (
        <Box flexDirection="column" marginTop={1}>
            <Box>
                <Text
                    color="yellow"
                    bold
                    onClick={() => setExpanded(!expanded)}
                >
                    🧠 Chain of Thought {expanded ? '▼' : '▶'}
                </Text>
            </Box>
            {expanded && (
                <Box
                    borderStyle="single"
                    borderColor="yellow"
                    paddingX={2}
                    paddingY={1}
                    marginTop={1}
                >
                    <Text color="gray" wrap="wrap">
                        {thinking}
                    </Text>
                </Box>
            )}
        </Box>
    );
}

/**
 * Main PhaseView component
 */
export function PhaseView() {
    const { currentPhase, goBack } = useNavigationStore();
    const { currentSession } = useSessionsStore();

    useInput((input, key) => {
        if (key.escape || input === 'q') {
            goBack();
        }
    });

    if (!currentPhase || !currentSession) {
        return (
            <Box padding={1}>
                <Text color="red">No phase selected</Text>
            </Box>
        );
    }

    const phaseInfo = PHASE_INFO[currentPhase] || {
        name: currentPhase.toUpperCase(),
        description: '',
        color: 'white',
        icon: '•'
    };

    const phaseData = currentSession.phases?.[currentPhase] || {};
    const status = phaseData.status || 'pending';

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box
                borderStyle="double"
                borderColor={phaseInfo.color}
                paddingX={2}
                paddingY={1}
                flexDirection="column"
            >
                <Box justifyContent="space-between">
                    <Text color={phaseInfo.color} bold>
                        {phaseInfo.icon} STEP: {phaseInfo.name}
                    </Text>
                    <PhaseStatusBadge status={status} />
                </Box>
                <Box marginTop={1}>
                    <Text color="gray">{phaseInfo.description}</Text>
                </Box>
            </Box>

            {/* Phase content based on type */}
            <Box flexDirection="column" marginTop={1}>
                {currentPhase === 'scope' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Decision:</Text>
                        <Box marginTop={1} paddingLeft={2}>
                            <Text wrap="wrap">
                                {currentSession.decision || 'No decision defined'}
                            </Text>
                        </Box>
                    </Box>
                )}

                {currentPhase === 'populate' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Selected Personas:</Text>
                        <Box marginTop={1} flexDirection="column">
                            {(currentSession.personas || []).map((id, i) => (
                                <Box key={id} paddingLeft={2}>
                                    <Text>• {id}</Text>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {currentPhase === 'announce' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Challenge Presented:</Text>
                        <Box marginTop={1} paddingLeft={2}>
                            <Text wrap="wrap">
                                {currentSession.decision || 'See SCOPE phase'}
                            </Text>
                        </Box>
                    </Box>
                )}

                {currentPhase === 'rumble' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Round 1 Responses:</Text>
                        <ResponseViewer
                            responses={currentSession.responses?.round1}
                            personas={currentSession.personaDetails}
                        />
                        {currentSession.responses?.round2 && (
                            <>
                                <Box marginTop={2}>
                                    <Text bold color="white">Round 2 (The Clash):</Text>
                                </Box>
                                <ResponseViewer
                                    responses={currentSession.responses.round2}
                                    personas={currentSession.personaDetails}
                                />
                            </>
                        )}
                    </Box>
                )}

                {currentPhase === 'knit' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Synthesis:</Text>
                        <Box
                            marginTop={1}
                            borderStyle="round"
                            borderColor="yellow"
                            paddingX={2}
                            paddingY={1}
                        >
                            <Text wrap="wrap">
                                {currentSession.synthesis || 'No synthesis generated'}
                            </Text>
                        </Box>
                        <ThinkingViewer thinking={phaseData.thinking} />
                    </Box>
                )}

                {currentPhase === 'interrogate' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Stress Test Results:</Text>
                        <ResponseViewer
                            responses={currentSession.interrogation}
                            personas={currentSession.personaDetails}
                        />
                    </Box>
                )}

                {currentPhase === 'transmit' && (
                    <Box flexDirection="column">
                        <Text bold color="white">Final Recommendations:</Text>
                        <Box
                            marginTop={1}
                            borderStyle="round"
                            borderColor="green"
                            paddingX={2}
                            paddingY={1}
                        >
                            <Text wrap="wrap">
                                {currentSession.finalRecommendation || 'No recommendations generated'}
                            </Text>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Metadata */}
            {phaseData.startedAt && (
                <Box marginTop={2} flexDirection="column">
                    <Text color="gray" dimColor>
                        Started: {new Date(phaseData.startedAt).toLocaleString()}
                    </Text>
                    {phaseData.completedAt && (
                        <Text color="gray" dimColor>
                            Completed: {new Date(phaseData.completedAt).toLocaleString()}
                        </Text>
                    )}
                    {phaseData.duration && (
                        <Text color="gray" dimColor>
                            Duration: {(phaseData.duration / 1000).toFixed(1)}s
                        </Text>
                    )}
                </Box>
            )}

            {/* Footer */}
            <Box marginTop={2}>
                <Text color="gray">Press ESC or Q to go back</Text>
            </Box>
        </Box>
    );
}

export default PhaseView;
