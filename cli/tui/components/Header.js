/**
 * SPAR-Kit TUI: Header Component
 * 
 * Displays the SPAR-Kit banner and current context.
 */

import React from 'react';
import { Box, Text } from 'ink';

const VERSION = '3.1.0';

/**
 * Main Header Banner
 */
export function Header({ title, subtitle }) {
    return (
        <Box flexDirection="column" marginBottom={1}>
            <Box borderStyle="double" borderColor="cyan" paddingX={2}>
                <Box flexDirection="column">
                    <Text bold color="cyan">
                        🥊 SPAR-Kit Mission Control
                    </Text>
                    <Text color="gray">
                        v{VERSION} • Structured Persona-Argumentation for Reasoning
                    </Text>
                </Box>
                {title && (
                    <Box marginLeft={2}>
                        <Text color="yellow">{title}</Text>
                    </Box>
                )}
            </Box>
            {subtitle && (
                <Box marginTop={0}>
                    <Text color="gray" dimColor>
                        {subtitle}
                    </Text>
                </Box>
            )}
        </Box>
    );
}

/**
 * Minimal Header (for detail views)
 */
export function MinimalHeader({ title, breadcrumb }) {
    return (
        <Box marginBottom={1}>
            <Text color="cyan" bold>🥊 </Text>
            {breadcrumb && (
                <>
                    <Text color="gray">{breadcrumb}</Text>
                    <Text color="gray"> › </Text>
                </>
            )}
            <Text bold>{title}</Text>
        </Box>
    );
}

/**
 * Tamil Tagline
 */
export function Tagline() {
    return (
        <Box justifyContent="center" marginY={1}>
            <Text color="yellow" italic>
                நாலு பேரு, நாலு திசை, ஒரு முடிவு!
            </Text>
        </Box>
    );
}

export default Header;
