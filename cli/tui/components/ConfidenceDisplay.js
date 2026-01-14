/**
 * SPAR-Kit TUI: ConfidenceDisplay Component
 * 
 * Visual confidence indicator for AI recommendations.
 */

import React from 'react';
import { Box, Text } from 'ink';

/**
 * Confidence Bar Component
 */
export function ConfidenceBar({ score, width = 20 }) {
    const percentage = Math.round(score * 100);
    const filled = Math.round(score * width);
    const empty = width - filled;

    let color = 'green';
    if (score < 0.5) color = 'yellow';
    if (score < 0.3) color = 'red';

    return (
        <Box>
            <Text color={color}>{'█'.repeat(filled)}</Text>
            <Text color="gray">{'░'.repeat(empty)}</Text>
            <Text color="gray"> {percentage}%</Text>
        </Box>
    );
}

/**
 * Confidence Level Badge
 */
export function ConfidenceBadge({ level }) {
    return (
        <Box>
            <Text>{level.icon}</Text>
            <Text color={level.color} bold> {level.label}</Text>
        </Box>
    );
}

/**
 * Confidence Breakdown Component
 */
export function ConfidenceBreakdown({ breakdown }) {
    const items = [
        { label: 'Convergence', value: breakdown.convergence, desc: 'Persona agreement' },
        { label: 'Reasoning', value: breakdown.reasoningDepth, desc: 'Thinking depth' },
        { label: 'Evidence', value: breakdown.evidenceQuality, desc: 'Data quality' }
    ];

    return (
        <Box flexDirection="column">
            {items.map(item => (
                <Box key={item.label}>
                    <Box width={14}>
                        <Text color="gray">{item.label}:</Text>
                    </Box>
                    <Box width={6}>
                        <Text color={item.value >= 60 ? 'green' : item.value >= 40 ? 'yellow' : 'red'}>
                            {item.value}%
                        </Text>
                    </Box>
                    <MiniBar value={item.value} />
                </Box>
            ))}
        </Box>
    );
}

/**
 * Mini progress bar for breakdown items
 */
function MiniBar({ value, width = 10 }) {
    const filled = Math.round((value / 100) * width);
    const empty = width - filled;

    let color = 'green';
    if (value < 60) color = 'yellow';
    if (value < 40) color = 'red';

    return (
        <Text color={color}>
            {'▓'.repeat(filled)}<Text color="gray">{'░'.repeat(empty)}</Text>
        </Text>
    );
}

/**
 * Confidence Warnings Component
 */
export function ConfidenceWarnings({ warnings }) {
    if (!warnings || warnings.length === 0) return null;

    const severityColors = {
        high: 'red',
        medium: 'yellow',
        low: 'gray'
    };

    const severityIcons = {
        high: '⚠️',
        medium: '⚡',
        low: 'ℹ️'
    };

    return (
        <Box flexDirection="column" marginTop={1}>
            <Text color="yellow" bold>Warnings:</Text>
            {warnings.map((warning, i) => (
                <Box key={i}>
                    <Text>{severityIcons[warning.severity]} </Text>
                    <Text color={severityColors[warning.severity]}>
                        {warning.message}
                    </Text>
                </Box>
            ))}
        </Box>
    );
}

/**
 * Main Confidence Display Component
 */
export function ConfidenceDisplay({ confidence, showBreakdown = true, showWarnings = true }) {
    if (!confidence) return null;

    const { score, level, breakdown } = confidence;

    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor={level.color}
            paddingX={2}
            paddingY={0}
            marginY={1}
        >
            {/* Header */}
            <Box>
                <Text bold>🎯 Recommendation Confidence</Text>
            </Box>

            {/* Main Score */}
            <Box marginTop={1}>
                <ConfidenceBadge level={level} />
                <Box marginLeft={2}>
                    <ConfidenceBar score={score} />
                </Box>
            </Box>

            {/* Description */}
            <Box marginTop={1}>
                <Text color="gray" dimColor>{level.description}</Text>
            </Box>

            {/* Breakdown */}
            {showBreakdown && (
                <Box marginTop={1} flexDirection="column">
                    <Text color="cyan" dimColor>─ Breakdown ─</Text>
                    <ConfidenceBreakdown breakdown={breakdown} />
                </Box>
            )}
        </Box>
    );
}

/**
 * Compact confidence indicator for list views
 */
export function ConfidenceIndicator({ score }) {
    const percentage = Math.round(score * 100);

    let icon = '🟢';
    let color = 'green';

    if (score < 0.7) { icon = '🟡'; color = 'yellow'; }
    if (score < 0.5) { icon = '🟠'; color = 'yellow'; }
    if (score < 0.3) { icon = '🔴'; color = 'red'; }

    return (
        <Box>
            <Text>{icon}</Text>
            <Text color={color}> {percentage}%</Text>
        </Box>
    );
}

export default ConfidenceDisplay;
