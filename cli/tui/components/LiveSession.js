/**
 * LiveSession Component
 * Real-time monitoring of active SPAR debates with streaming output
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import Spinner from 'ink-spinner';

import { useSessionsStore, SessionStatus } from '../store/sessions.js';
import { useNavigationStore } from '../store/navigation.js';

/**
 * Progress bar component for debate phases
 */
function ProgressBar({ current, total, width = 30, label }) {
    const filled = Math.round((current / total) * width);
    const empty = width - filled;

    return (
        <Box flexDirection="column">
            {label && (
                <Box marginBottom={0}>
                    <Text color="gray">{label}</Text>
                </Box>
            )}
            <Box>
                <Text color="green">{'█'.repeat(filled)}</Text>
                <Text color="gray">{'░'.repeat(empty)}</Text>
                <Text color="white"> {current}/{total}</Text>
            </Box>
        </Box>
    );
}

/**
 * Phase status indicator
 */
function PhaseIndicator({ phase, status, isCurrent }) {
    const phaseIcons = {
        scope: 'S',
        populate: 'P',
        announce: 'A',
        rumble: 'R',
        knit: 'K',
        interrogate: 'I',
        transmit: 'T'
    };

    const statusColors = {
        pending: 'gray',
        running: 'yellow',
        completed: 'green',
        skipped: 'gray',
        error: 'red'
    };

    return (
        <Box marginRight={1}>
            <Text
                color={statusColors[status] || 'gray'}
                bold={isCurrent}
                inverse={isCurrent}
            >
                {' '}{phaseIcons[phase] || '?'}{' '}
            </Text>
        </Box>
    );
}

/**
 * SPARKIT Protocol Progress
 */
function ProtocolProgress({ session }) {
    const phases = ['scope', 'populate', 'announce', 'rumble', 'knit', 'interrogate', 'transmit'];
    const currentPhase = session?.checkpoint?.phase || 'scope';

    return (
        <Box flexDirection="column" marginBottom={1}>
            <Box marginBottom={1}>
                <Text bold color="cyan">SPARKIT Protocol Progress</Text>
            </Box>
            <Box>
                {phases.map((phase, i) => {
                    const phaseData = session?.phases?.[phase] || {};
                    const isCurrent = phase === currentPhase;
                    return (
                        <PhaseIndicator
                            key={phase}
                            phase={phase}
                            status={phaseData.status || 'pending'}
                            isCurrent={isCurrent}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}

/**
 * Streaming output display
 */
function StreamingOutput({ lines = [], maxLines = 10 }) {
    const displayLines = lines.slice(-maxLines);

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
            {displayLines.length === 0 ? (
                <Text color="gray" italic>Waiting for output...</Text>
            ) : (
                displayLines.map((line, i) => (
                    <Text key={i} wrap="truncate">
                        {line}
                    </Text>
                ))
            )}
        </Box>
    );
}

/**
 * Metrics display
 */
function MetricsDisplay({ metrics }) {
    if (!metrics) return null;

    const duration = metrics.duration_ms
        ? `${(metrics.duration_ms / 1000).toFixed(1)}s`
        : '0s';

    return (
        <Box marginTop={1}>
            <Box marginRight={3}>
                <Text color="gray">⏱ Duration: </Text>
                <Text>{duration}</Text>
            </Box>
            <Box marginRight={3}>
                <Text color="gray">🔢 Tokens: </Text>
                <Text>{metrics.total_tokens || 0}</Text>
            </Box>
            <Box>
                <Text color="gray">📞 LLM Calls: </Text>
                <Text>{metrics.llm_calls || 0}</Text>
            </Box>
        </Box>
    );
}

/**
 * Action buttons / shortcuts
 */
function ActionBar({ onPause, onSkip, onCancel, isPaused }) {
    return (
        <Box marginTop={1} flexDirection="column">
            <Box>
                <Text color="gray">
                    [{isPaused ? 'R' : 'P'}] {isPaused ? 'Resume' : 'Pause'}
                    [S] Skip to Synthesis
                    [C] Cancel
                    [ESC] Background
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Main LiveSession component
 */
export function LiveSession() {
    const { exit } = useApp();
    const { goBack } = useNavigationStore();
    const { currentSession, pauseSession, resumeSession, cancelSession, updateSession } = useSessionsStore();

    const [outputLines, setOutputLines] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer for elapsed time
    useEffect(() => {
        if (currentSession?.status === SessionStatus.RUNNING) {
            const timer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentSession?.status]);

    // Keyboard shortcuts
    useInput((input, key) => {
        if (key.escape) {
            // Go to background
            goBack();
        }

        if (input === 'p' && currentSession?.status === SessionStatus.RUNNING) {
            pauseSession(currentSession.id);
            addOutputLine('⏸️ Session paused');
        }

        if (input === 'r' && currentSession?.status === SessionStatus.PAUSED) {
            resumeSession(currentSession.id);
            addOutputLine('▶️ Session resumed');
        }

        if (input === 's') {
            // Skip to synthesis
            addOutputLine('⏭️ Skipping to KNIT (Synthesis)...');
            updateSession(currentSession.id, {
                checkpoint: { ...currentSession.checkpoint, phase: 'knit' }
            });
        }

        if (input === 'c') {
            cancelSession(currentSession.id);
            addOutputLine('❌ Session cancelled');
        }

        if (input === 'q') {
            goBack();
        }
    });

    const addOutputLine = useCallback((line) => {
        const timestamp = new Date().toLocaleTimeString();
        setOutputLines(prev => [...prev, `[${timestamp}] ${line}`]);
    }, []);

    if (!currentSession) {
        return (
            <Box padding={1}>
                <Text color="yellow">No active session selected</Text>
            </Box>
        );
    }

    const isPaused = currentSession.status === SessionStatus.PAUSED;
    const isRunning = currentSession.status === SessionStatus.RUNNING;
    const isCompleted = currentSession.status === SessionStatus.COMPLETED;

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box
                borderStyle="double"
                borderColor={isCompleted ? 'green' : isPaused ? 'yellow' : 'cyan'}
                paddingX={2}
                paddingY={1}
                flexDirection="column"
            >
                <Box justifyContent="space-between">
                    <Box>
                        {isRunning && (
                            <Text color="cyan">
                                <Spinner type="dots" />
                            </Text>
                        )}
                        <Text bold color="white"> LIVE SESSION</Text>
                        {isPaused && <Text color="yellow"> [PAUSED]</Text>}
                        {isCompleted && <Text color="green"> [COMPLETED]</Text>}
                    </Box>
                    <Text color="gray">
                        ⏱ {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                    </Text>
                </Box>

                <Box marginTop={1}>
                    <Text wrap="truncate-end">
                        📋 {currentSession.decision?.substring(0, 60)}...
                    </Text>
                </Box>
            </Box>

            {/* Protocol Progress */}
            <Box marginTop={1}>
                <ProtocolProgress session={currentSession} />
            </Box>

            {/* Rumble Progress (if in rumble phase) */}
            {currentSession.checkpoint?.phase === 'rumble' && (
                <Box marginTop={1}>
                    <ProgressBar
                        current={currentSession.phases?.rumble?.current_round || 0}
                        total={currentSession.phases?.rumble?.total_rounds || 3}
                        label="Round Progress"
                    />
                </Box>
            )}

            {/* Streaming Output */}
            <Box marginTop={1} flexDirection="column">
                <Text bold color="white">Output:</Text>
                <Box marginTop={1}>
                    <StreamingOutput lines={outputLines} />
                </Box>
            </Box>

            {/* Metrics */}
            <MetricsDisplay metrics={currentSession.metrics} />

            {/* Action Bar */}
            {(isRunning || isPaused) && (
                <ActionBar
                    isPaused={isPaused}
                    onPause={() => pauseSession(currentSession.id)}
                    onSkip={() => updateSession(currentSession.id, { checkpoint: { phase: 'knit' } })}
                    onCancel={() => cancelSession(currentSession.id)}
                />
            )}

            {/* Completed message */}
            {isCompleted && (
                <Box marginTop={1}>
                    <Text color="green">
                        ✅ Session completed! Press ESC or Q to go back.
                    </Text>
                </Box>
            )}
        </Box>
    );
}

export default LiveSession;
