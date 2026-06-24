/**
 * SPAR-Kit TUI: StatusBar Component
 * 
 * Bottom status bar with keyboard shortcuts and context info.
 */

import React from 'react';
import { Box, Text } from 'ink';

/**
 * Keyboard shortcut display
 */
function Shortcut({ key: keyName, label }) {
    return (
        <Box marginRight={2}>
            <Text backgroundColor="gray" color="black"> {keyName} </Text>
            <Text color="gray"> {label}</Text>
        </Box>
    );
}

/**
 * Main StatusBar Component
 */
export function StatusBar({
    shortcuts = [],
    context = null,
    provider = null,
    model = null
}) {
    const defaultShortcuts = [
        { key: 'Q', label: 'Quit' },
        { key: '?', label: 'Help' }
    ];

    const allShortcuts = [...shortcuts, ...defaultShortcuts];

    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor="gray"
            paddingX={1}
            marginTop={1}
        >
            {/* Shortcuts Row */}
            <Box>
                {allShortcuts.map((s, i) => (
                    <Shortcut key={i} keyName={s.key} label={s.label} />
                ))}
            </Box>

            {/* Context Row */}
            {(context || provider) && (
                <Box justifyContent="space-between" marginTop={0}>
                    {context && (
                        <Text color="gray" dimColor>{context}</Text>
                    )}
                    {provider && (
                        <Text color="gray" dimColor>
                            {provider} • {model}
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    );
}

/**
 * Dashboard-specific shortcuts
 */
export const DASHBOARD_SHORTCUTS = [
    { key: 'N', label: 'New Debate' },
    { key: '↑↓', label: 'Navigate' },
    { key: 'Enter', label: 'View' },
    { key: 'R', label: 'Refresh' }
];

/**
 * Session detail shortcuts
 */
export const SESSION_SHORTCUTS = [
    { key: '←', label: 'Back' },
    { key: 'E', label: 'Export' },
    { key: 'C', label: 'Clone' },
    { key: 'D', label: 'Delete' }
];

/**
 * Live session shortcuts
 */
export const LIVE_SHORTCUTS = [
    { key: 'P', label: 'Pause' },
    { key: 'X', label: 'Cancel' },
    { key: 'S', label: 'Skip to Synthesis' },
    { key: '←', label: 'Background' }
];

export default StatusBar;
