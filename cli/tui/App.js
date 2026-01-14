/**
 * SPAR-Kit TUI: Main App Component
 * 
 * Root component that handles view routing and global state.
 */

import React, { useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { SessionDetail } from './components/SessionDetail.js';
import { Settings } from './components/Settings.js';
import { SparBuilder } from './components/SparBuilder.js';
import { TemplateBrowser } from './components/TemplateBrowser.js';
import { useNavigationStore, Views } from './store/navigation.js';
import { useConfigStore } from './store/config.js';
import { useSessionStore } from './store/sessions.js';

/**
 * Modal Component
 */
function Modal({ modal, onConfirm, onCancel }) {
    if (!modal.visible) return null;

    const colors = {
        confirm: 'yellow',
        error: 'red',
        success: 'green',
        input: 'cyan'
    };

    useInput((input, key) => {
        if (modal.type === 'confirm') {
            if (input === 'y' || input === 'Y') {
                modal.onConfirm?.();
            } else if (input === 'n' || input === 'N' || key.escape) {
                modal.onCancel?.();
            }
        } else {
            if (key.return || key.escape) {
                modal.onConfirm?.();
            }
        }
    });

    return (
        <Box
            flexDirection="column"
            borderStyle="double"
            borderColor={colors[modal.type] || 'white'}
            paddingX={2}
            paddingY={1}
            marginTop={2}
        >
            <Text bold color={colors[modal.type]}>{modal.title}</Text>
            <Box marginY={1}>
                <Text wrap="wrap">{modal.message}</Text>
            </Box>
            <Box>
                {modal.type === 'confirm' ? (
                    <Text color="gray">[Y] Yes  [N] No</Text>
                ) : (
                    <Text color="gray">[Enter] OK</Text>
                )}
            </Box>
        </Box>
    );
}

/**
 * Help View
 */
function HelpView() {
    const goBack = useNavigationStore(state => state.goBack);

    useInput((input, key) => {
        if (key.escape || key.leftArrow) {
            goBack();
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="cyan">🥊 SPAR-Kit Help</Text>
            <Box marginY={1} />

            <Text bold color="yellow">━━━ Navigation ━━━</Text>
            <Text color="gray">  ↑/↓       Move selection</Text>
            <Text color="gray">  Enter     Select / Confirm</Text>
            <Text color="gray">  ←/Esc     Go back</Text>
            <Text color="gray">  Q         Quit</Text>

            <Box marginY={1} />

            <Text bold color="yellow">━━━ Dashboard ━━━</Text>
            <Text color="gray">  N         New debate (Builder wizard)</Text>
            <Text color="gray">  T         Browse templates</Text>
            <Text color="gray">  R         Refresh session list</Text>
            <Text color="gray">  S         Open settings</Text>

            <Box marginY={1} />

            <Text bold color="yellow">━━━ Session View ━━━</Text>
            <Text color="gray">  E         Export to Markdown</Text>
            <Text color="gray">  C         Clone session</Text>
            <Text color="gray">  D         Delete session</Text>

            <Box marginY={1} />

            <Text bold color="yellow">━━━ SPAR Builder ━━━</Text>
            <Text color="gray">  Tab       Switch fields</Text>
            <Text color="gray">  Enter     Next step</Text>
            <Text color="gray">  Esc       Go back</Text>

            <Box marginY={1} />
            <Text color="gray" dimColor>Press ← or Esc to go back</Text>
        </Box>
    );
}

/**
 * Live Session View (placeholder for now)
 */
function LiveSessionView() {
    const goBack = useNavigationStore(state => state.goBack);
    const selectedSessionId = useNavigationStore(state => state.viewState.selectedSessionId);

    useInput((input, key) => {
        if (key.escape || key.leftArrow) {
            goBack();
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="cyan">🔴 Live Session</Text>
            <Box marginY={1}>
                <Text color="yellow">Session: {selectedSessionId}</Text>
            </Box>
            <Text color="gray">Live streaming view coming soon...</Text>
            <Box marginTop={1}>
                <Text color="gray" dimColor>Press ← to go back</Text>
            </Box>
        </Box>
    );
}

/**
 * Phase View (placeholder for now)
 */
function PhaseView() {
    const goBack = useNavigationStore(state => state.goBack);
    const selectedPhase = useNavigationStore(state => state.viewState.selectedPhase);

    useInput((input, key) => {
        if (key.escape || key.leftArrow) {
            goBack();
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="cyan">📋 Phase: {selectedPhase?.toUpperCase()}</Text>
            <Box marginY={1}>
                <Text color="gray">Phase detail view coming soon...</Text>
            </Box>
            <Box marginTop={1}>
                <Text color="gray" dimColor>Press ← to go back</Text>
            </Box>
        </Box>
    );
}

/**
 * Main App Component
 */
export function App() {
    const { exit } = useApp();
    const currentView = useNavigationStore(state => state.currentView);
    const modal = useNavigationStore(state => state.modal);
    const hideModal = useNavigationStore(state => state.hideModal);
    const navigate = useNavigationStore(state => state.navigate);
    const goBack = useNavigationStore(state => state.goBack);

    const loadConfig = useConfigStore(state => state.load);
    const loadSessions = useSessionStore(state => state.loadSessions);

    // Initialize on mount
    useEffect(() => {
        loadConfig();
        loadSessions();
    }, []);

    // Global keyboard shortcuts
    useInput((input, key) => {
        // Don't handle if modal is visible
        if (modal.visible) return;

        // Quit
        if (input === 'q' || input === 'Q') {
            exit();
        }

        // Global shortcuts only on dashboard
        if (currentView === Views.DASHBOARD) {
            if (input === '?') {
                navigate(Views.HELP);
            } else if (input === 's' || input === 'S') {
                navigate(Views.SETTINGS);
            } else if (input === 't' || input === 'T') {
                navigate(Views.TEMPLATES);
            }
        }
    });

    // Handle SPAR Builder completion
    const handleBuilderComplete = (debate) => {
        // TODO: Actually start the debate
        console.log('Starting debate:', debate);
        navigate(Views.DASHBOARD);
    };

    const handleBuilderCancel = () => {
        goBack();
    };

    // Render current view
    const renderView = () => {
        switch (currentView) {
            case Views.DASHBOARD:
                return <Dashboard />;

            case Views.SESSION_DETAIL:
                return <SessionDetail />;

            case Views.SESSION_LIST:
                return <Dashboard />; // Reuse dashboard for now

            case Views.PHASE_VIEW:
                return <PhaseView />;

            case Views.LIVE_SESSION:
                return <LiveSessionView />;

            case Views.NEW_DEBATE:
                return (
                    <SparBuilder
                        onComplete={handleBuilderComplete}
                        onCancel={handleBuilderCancel}
                    />
                );

            case Views.TEMPLATES:
                return (
                    <TemplateBrowser
                        onCancel={() => goBack()}
                    />
                );

            case Views.SETTINGS:
                return <Settings />;

            case Views.HELP:
                return <HelpView />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <Box flexDirection="column">
            {renderView()}
            {modal.visible && (
                <Modal
                    modal={modal}
                    onConfirm={modal.onConfirm}
                    onCancel={modal.onCancel}
                />
            )}
        </Box>
    );
}

export default App;
