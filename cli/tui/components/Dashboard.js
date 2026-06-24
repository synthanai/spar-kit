/**
 * SPAR-Kit TUI: Dashboard Component
 * 
 * Main dashboard view showing active sessions, recent history, and quick stats.
 */

import React, { useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Header, Tagline } from './Header.js';
import { StatusBar, DASHBOARD_SHORTCUTS } from './StatusBar.js';
import { SessionList } from './SessionList.js';
import { useSessionStore } from '../store/sessions.js';
import { useConfigStore } from '../store/config.js';
import { useNavigationStore, Views } from '../store/navigation.js';

/**
 * Stats Card Component
 */
function StatsCard({ stats }) {
    return (
        <Box
            borderStyle="round"
            borderColor="gray"
            paddingX={2}
            paddingY={0}
            marginTop={1}
        >
            <Box marginRight={4}>
                <Text color="gray">Total: </Text>
                <Text bold>{stats.total}</Text>
            </Box>
            <Box marginRight={4}>
                <Text color="green">Completed: </Text>
                <Text color="green">{stats.completed}</Text>
            </Box>
            <Box marginRight={4}>
                <Text color="yellow">Active: </Text>
                <Text color="yellow">{stats.running + stats.paused}</Text>
            </Box>
            <Box>
                <Text color="red">Failed: </Text>
                <Text color="red">{stats.failed}</Text>
            </Box>
        </Box>
    );
}

/**
 * Provider Status Component
 */
function ProviderStatus() {
    const providerInfo = useConfigStore(state => state.getProviderInfo());
    const permissionWarning = useConfigStore(state => state.permissionWarning);

    return (
        <Box flexDirection="column" marginTop={1}>
            <Box>
                <Text color="gray">Provider: </Text>
                <Text color="cyan">{providerInfo.provider}</Text>
                <Text color="gray"> • Model: </Text>
                <Text color="cyan">{providerInfo.model}</Text>
            </Box>
            {permissionWarning && (
                <Box>
                    <Text color="yellow">⚠️ {permissionWarning}</Text>
                </Box>
            )}
        </Box>
    );
}

/**
 * Quick Tips Component
 */
function QuickTips() {
    const tips = [
        'Press N to start a new debate with AI personas',
        'Use ↑↓ to navigate, Enter to view details',
        'Debates are auto-saved to ~/.spar/sessions/',
        'Export to Markdown with E from any session view'
    ];

    const [tipIndex, setTipIndex] = React.useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTipIndex(i => (i + 1) % tips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box marginTop={1}>
            <Text color="gray" dimColor>💡 </Text>
            <Text color="gray" dimColor>{tips[tipIndex]}</Text>
        </Box>
    );
}

/**
 * Main Dashboard Component
 */
export function Dashboard() {
    const { exit } = useApp();
    const stats = useSessionStore(state => state.stats);
    const loadSessions = useSessionStore(state => state.loadSessions);
    const loadConfig = useConfigStore(state => state.load);
    const providerInfo = useConfigStore(state => state.getProviderInfo());
    const navigate = useNavigationStore(state => state.navigate);

    // Load data on mount
    useEffect(() => {
        loadConfig();
        loadSessions();
    }, []);

    // Handle global keyboard shortcuts
    useInput((input, key) => {
        if (input === 'q' || input === 'Q') {
            exit();
        } else if (input === '?') {
            navigate(Views.HELP);
        } else if (input === 's' || input === 'S') {
            navigate(Views.SETTINGS);
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Header />
            <Tagline />

            {/* Stats Overview */}
            <StatsCard stats={stats} />

            {/* Session List */}
            <SessionList maxItems={8} />

            {/* Provider Status */}
            <ProviderStatus />

            {/* Quick Tips */}
            <QuickTips />

            {/* Status Bar */}
            <StatusBar
                shortcuts={DASHBOARD_SHORTCUTS}
                provider={providerInfo.provider}
                model={providerInfo.model}
            />
        </Box>
    );
}

export default Dashboard;
