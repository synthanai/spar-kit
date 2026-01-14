/**
 * SPAR-Kit TUI: Override Mechanism Components
 * 
 * Allows users to modify, reject, or annotate AI recommendations
 * before acting on them. Ensures human sovereignty over decisions.
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

/**
 * Override Actions
 */
export const OverrideActions = {
    ACCEPT: 'accept',
    MODIFY: 'modify',
    REJECT: 'reject',
    DEFER: 'defer',
    ESCALATE: 'escalate'
};

/**
 * Override Action Selector
 */
export function OverrideSelector({ onSelect }) {
    const actions = [
        {
            label: '✅ Accept — Proceed with recommendation as-is',
            value: OverrideActions.ACCEPT
        },
        {
            label: '✏️ Modify — Accept with changes',
            value: OverrideActions.MODIFY
        },
        {
            label: '❌ Reject — Do not proceed, document why',
            value: OverrideActions.REJECT
        },
        {
            label: '⏸️ Defer — Need more time/information',
            value: OverrideActions.DEFER
        },
        {
            label: '⬆️ Escalate — Requires higher authority',
            value: OverrideActions.ESCALATE
        }
    ];

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">🎯 Your Decision</Text>
            <Text color="gray" dimColor>
                AI has provided a recommendation. What would you like to do?
            </Text>
            <Box marginY={1}>
                <SelectInput
                    items={actions}
                    onSelect={(item) => onSelect(item.value)}
                />
            </Box>
        </Box>
    );
}

/**
 * Modification Input Component
 */
export function ModificationInput({ originalRecommendation, onSave, onCancel }) {
    const [modification, setModification] = useState('');
    const [reason, setReason] = useState('');
    const [field, setField] = useState('modification');

    useInput((input, key) => {
        if (key.escape) {
            onCancel();
        } else if (key.tab) {
            setField(f => f === 'modification' ? 'reason' : 'modification');
        } else if (key.return && modification.length > 0 && reason.length > 0) {
            onSave({ modification, reason });
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="cyan">✏️ Modify Recommendation</Text>

            {/* Original */}
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="gray"
                paddingX={2}
                marginY={1}
            >
                <Text color="gray">Original Recommendation:</Text>
                <Text wrap="wrap">{originalRecommendation}</Text>
            </Box>

            {/* Modification */}
            <Text color={field === 'modification' ? 'white' : 'gray'}>
                Your Modification:
            </Text>
            <Box borderStyle="round" borderColor={field === 'modification' ? 'cyan' : 'gray'} paddingX={1}>
                <TextInput
                    value={modification}
                    onChange={setModification}
                    placeholder="Enter your modified version..."
                    focus={field === 'modification'}
                />
            </Box>

            {/* Reason */}
            <Box marginTop={1}>
                <Text color={field === 'reason' ? 'white' : 'gray'}>
                    Reason for Change:
                </Text>
            </Box>
            <Box borderStyle="round" borderColor={field === 'reason' ? 'cyan' : 'gray'} paddingX={1}>
                <TextInput
                    value={reason}
                    onChange={setReason}
                    placeholder="Why are you making this change?"
                    focus={field === 'reason'}
                />
            </Box>

            {/* Actions */}
            <Box marginTop={1}>
                <Text color="gray">
                    Tab: Switch fields | Enter: Save | Esc: Cancel
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Rejection Input Component
 */
export function RejectionInput({ onSave, onCancel }) {
    const [reason, setReason] = useState('');
    const [alternative, setAlternative] = useState('');
    const [field, setField] = useState('reason');

    const rejectionReasons = [
        { label: 'Insufficient evidence', value: 'insufficient_evidence' },
        { label: 'Missing key perspective', value: 'missing_perspective' },
        { label: 'Conflicts with known constraints', value: 'constraint_conflict' },
        { label: 'Timing not appropriate', value: 'timing' },
        { label: 'Risk too high', value: 'high_risk' },
        { label: 'Other (specify)', value: 'other' }
    ];

    useInput((input, key) => {
        if (key.escape) onCancel();
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Text bold color="red">❌ Reject Recommendation</Text>
            <Text color="gray" dimColor>
                Document why you're not proceeding with this recommendation
            </Text>

            <Box marginY={1}>
                <Text>Rejection Reason:</Text>
            </Box>
            <SelectInput
                items={rejectionReasons}
                onSelect={(item) => {
                    setReason(item.value);
                    if (item.value !== 'other') {
                        setField('alternative');
                    }
                }}
            />

            {reason && (
                <Box marginTop={1} flexDirection="column">
                    <Text>Alternative Action (optional):</Text>
                    <Box borderStyle="round" borderColor="gray" paddingX={1}>
                        <TextInput
                            value={alternative}
                            onChange={setAlternative}
                            placeholder="What will you do instead?"
                        />
                    </Box>
                    <Box marginTop={1}>
                        <Text
                            color="green"
                            onClick={() => onSave({ reason, alternative })}
                        >
                            [Enter] Confirm Rejection
                        </Text>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

/**
 * Override Summary Component
 */
export function OverrideSummary({ override }) {
    const actionLabels = {
        [OverrideActions.ACCEPT]: { icon: '✅', label: 'Accepted', color: 'green' },
        [OverrideActions.MODIFY]: { icon: '✏️', label: 'Modified', color: 'yellow' },
        [OverrideActions.REJECT]: { icon: '❌', label: 'Rejected', color: 'red' },
        [OverrideActions.DEFER]: { icon: '⏸️', label: 'Deferred', color: 'blue' },
        [OverrideActions.ESCALATE]: { icon: '⬆️', label: 'Escalated', color: 'magenta' }
    };

    const { icon, label, color } = actionLabels[override.action] || actionLabels[OverrideActions.ACCEPT];

    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor={color}
            paddingX={2}
            paddingY={0}
            marginY={1}
        >
            <Box>
                <Text>{icon} </Text>
                <Text color={color} bold>Human Decision: {label}</Text>
            </Box>

            {override.reason && (
                <Box marginTop={1}>
                    <Text color="gray">Reason: </Text>
                    <Text>{override.reason}</Text>
                </Box>
            )}

            {override.modification && (
                <Box marginTop={1} flexDirection="column">
                    <Text color="gray">Modified to:</Text>
                    <Text wrap="wrap">{override.modification}</Text>
                </Box>
            )}

            {override.alternative && (
                <Box marginTop={1}>
                    <Text color="gray">Alternative: </Text>
                    <Text>{override.alternative}</Text>
                </Box>
            )}

            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    Recorded at: {new Date(override.timestamp).toLocaleString()}
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Main Override Panel - Orchestrates the override flow
 */
export function OverridePanel({ recommendation, onComplete }) {
    const [stage, setStage] = useState('select'); // select | modify | reject | complete
    const [override, setOverride] = useState(null);

    const handleAction = (action) => {
        if (action === OverrideActions.ACCEPT) {
            const result = {
                action,
                timestamp: new Date().toISOString(),
                original: recommendation
            };
            setOverride(result);
            setStage('complete');
            onComplete(result);
        } else if (action === OverrideActions.MODIFY) {
            setStage('modify');
        } else if (action === OverrideActions.REJECT) {
            setStage('reject');
        } else {
            // DEFER or ESCALATE
            const result = {
                action,
                timestamp: new Date().toISOString(),
                original: recommendation
            };
            setOverride(result);
            setStage('complete');
            onComplete(result);
        }
    };

    const handleModification = (data) => {
        const result = {
            action: OverrideActions.MODIFY,
            timestamp: new Date().toISOString(),
            original: recommendation,
            modification: data.modification,
            reason: data.reason
        };
        setOverride(result);
        setStage('complete');
        onComplete(result);
    };

    const handleRejection = (data) => {
        const result = {
            action: OverrideActions.REJECT,
            timestamp: new Date().toISOString(),
            original: recommendation,
            reason: data.reason,
            alternative: data.alternative
        };
        setOverride(result);
        setStage('complete');
        onComplete(result);
    };

    return (
        <Box flexDirection="column">
            {stage === 'select' && (
                <OverrideSelector onSelect={handleAction} />
            )}

            {stage === 'modify' && (
                <ModificationInput
                    originalRecommendation={recommendation}
                    onSave={handleModification}
                    onCancel={() => setStage('select')}
                />
            )}

            {stage === 'reject' && (
                <RejectionInput
                    onSave={handleRejection}
                    onCancel={() => setStage('select')}
                />
            )}

            {stage === 'complete' && override && (
                <OverrideSummary override={override} />
            )}
        </Box>
    );
}

export default {
    OverrideActions,
    OverrideSelector,
    ModificationInput,
    RejectionInput,
    OverrideSummary,
    OverridePanel
};
