/**
 * SPAR-Kit TUI: SPAR Builder Wizard
 * 
 * No-code interactive wizard for building and running SPAR debates.
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

/**
 * Wizard Step Indicator
 */
function StepIndicator({ current, total }) {
    const progress = Math.round((current / total) * 20);
    const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);
    const percent = Math.round((current / total) * 100);

    return (
        <Box marginBottom={1}>
            <Text color="gray">Step {current} of {total}</Text>
            <Box marginLeft={2}>
                <Text color="cyan">{bar}</Text>
                <Text color="gray"> {percent}%</Text>
            </Box>
        </Box>
    );
}

/**
 * Step 1: Decision Input
 */
function DecisionStep({ value, onChange, onNext }) {
    const tips = [
        '💡 Great decisions are specific. Try adding:',
        '   • Timeline: "...in the next 6 months"',
        '   • Constraints: "...with our current team"',
        '   • Stakes: "...risking $X investment"'
    ];

    useInput((input, key) => {
        if (key.return && value.length >= 10) {
            onNext();
        }
    });

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">🎯 What decision are you wrestling with?</Text>
            <Box marginY={1}>
                <Box borderStyle="round" borderColor="gray" paddingX={1}>
                    <TextInput
                        value={value}
                        onChange={onChange}
                        placeholder="Should we..."
                    />
                </Box>
            </Box>
            {value.length < 10 && (
                <Text color="yellow" dimColor>
                    ⚠️ Try to be more specific (at least 10 characters)
                </Text>
            )}
            {value.length >= 10 && value.length < 50 && (
                <Box flexDirection="column" marginTop={1}>
                    {tips.map((tip, i) => (
                        <Text key={i} color="gray" dimColor>{tip}</Text>
                    ))}
                </Box>
            )}
            {value.length >= 50 && (
                <Text color="green">✓ Great question! Press Enter to continue.</Text>
            )}
        </Box>
    );
}

/**
 * Step 2: Preset Selection
 */
function PresetStep({ value, onChange, onNext, onBack }) {
    const presets = [
        {
            label: '🚀 Startup — Dreamers, Hackers, Operators',
            value: 'startup',
            description: 'Fast-moving, growth-focused'
        },
        {
            label: '💼 Corporate — Strategists, Risk Managers, Innovators',
            value: 'corporate',
            description: 'Structured, stakeholder-aware'
        },
        {
            label: '⚠️ Crisis — Emergency Responders, Communicators',
            value: 'crisis',
            description: 'High-stakes, time-sensitive'
        },
        {
            label: '🎨 Innovation — Disruptors, Futurists, Skeptics',
            value: 'innovation',
            description: 'Blue-sky, challenging assumptions'
        },
        {
            label: '⚖️ Ethics — Philosophers, Advocates, Pragmatists',
            value: 'ethics',
            description: 'Values-driven, stakeholder-focused'
        },
        {
            label: '🔧 Custom — Build your own panel',
            value: 'custom',
            description: 'Choose from 108 personas'
        }
    ];

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">🎭 Who should debate this?</Text>
            <Text color="gray" dimColor>Choose a persona preset or build custom</Text>
            <Box marginY={1}>
                <SelectInput
                    items={presets}
                    onSelect={(item) => {
                        onChange(item.value);
                        onNext();
                    }}
                />
            </Box>
        </Box>
    );
}

/**
 * Step 3: Rules Configuration
 */
function RulesStep({ rules, onChange, onNext, onBack }) {
    const [focusedField, setFocusedField] = useState('rounds');

    const roundOptions = [
        { label: '⚡ Quick (1 round)', value: 1 },
        { label: '⚔️ Standard (2 rounds)', value: 2 },
        { label: '🔥 Deep (3 rounds)', value: 3 }
    ];

    const styleOptions = [
        { label: '🤝 Friendly — Collaborative exploration', value: 'friendly' },
        { label: '💬 Constructive — Balanced debate', value: 'constructive' },
        { label: '⚔️ Adversarial — Strong challenges', value: 'adversarial' }
    ];

    useInput((input, key) => {
        if (key.tab) {
            setFocusedField(f => f === 'rounds' ? 'style' : 'rounds');
        }
    });

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">⚙️ How should they debate?</Text>

            <Box marginY={1} flexDirection="column">
                <Text color={focusedField === 'rounds' ? 'white' : 'gray'}>
                    Rounds:
                </Text>
                {focusedField === 'rounds' && (
                    <SelectInput
                        items={roundOptions}
                        initialIndex={rules.rounds - 1}
                        onSelect={(item) => {
                            onChange({ ...rules, rounds: item.value });
                            setFocusedField('style');
                        }}
                    />
                )}
            </Box>

            <Box marginY={1} flexDirection="column">
                <Text color={focusedField === 'style' ? 'white' : 'gray'}>
                    Style:
                </Text>
                {focusedField === 'style' && (
                    <SelectInput
                        items={styleOptions}
                        onSelect={(item) => {
                            onChange({ ...rules, style: item.value });
                            onNext();
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}

/**
 * Step 4: Engine Selection
 */
function EngineStep({ config, onChange, onNext, onBack }) {
    const engines = [
        {
            label: '🏠 Ollama (Local, Private)',
            value: 'ollama',
            description: 'Runs on your machine, no data sent externally'
        },
        {
            label: '🌐 OpenAI (GPT-4)',
            value: 'openai',
            description: 'Powerful, requires API key'
        },
        {
            label: '🧠 Anthropic (Claude)',
            value: 'anthropic',
            description: 'Nuanced, requires API key'
        },
        {
            label: '💎 Google (Gemini)',
            value: 'gemini',
            description: 'Fast, requires API key'
        }
    ];

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">🤖 Choose your AI engine</Text>
            <Text color="gray" dimColor>Local engines keep your data private</Text>
            <Box marginY={1}>
                <SelectInput
                    items={engines}
                    onSelect={(item) => {
                        onChange({ ...config, provider: item.value });
                        onNext();
                    }}
                />
            </Box>
        </Box>
    );
}

/**
 * Step 5: Review & Launch
 */
function ReviewStep({ debate, onLaunch, onBack, onSaveTemplate }) {
    const [action, setAction] = useState(null);

    const actions = [
        { label: '🚀 START DEBATE', value: 'start' },
        { label: '💾 Save as Template', value: 'template' },
        { label: '📤 Share Link', value: 'share' },
        { label: '← Edit', value: 'back' }
    ];

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">🚀 Ready to SPAR!</Text>

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="green"
                paddingX={2}
                paddingY={1}
                marginY={1}
            >
                <Box>
                    <Text color="gray">📋 Decision: </Text>
                    <Text>{debate.decision}</Text>
                </Box>
                <Box>
                    <Text color="gray">🎭 Panel: </Text>
                    <Text color="magenta">{debate.preset}</Text>
                    <Text color="gray"> preset</Text>
                </Box>
                <Box>
                    <Text color="gray">⚔️ Format: </Text>
                    <Text>{debate.rules.rounds} rounds, {debate.rules.style} style</Text>
                </Box>
                <Box>
                    <Text color="gray">🤖 Engine: </Text>
                    <Text color="cyan">{debate.config.provider}</Text>
                </Box>
                <Box marginTop={1}>
                    <Text color="gray">⏱️ Estimated time: </Text>
                    <Text>{debate.rules.rounds * 3}-{debate.rules.rounds * 5} minutes</Text>
                </Box>
            </Box>

            <SelectInput
                items={actions}
                onSelect={(item) => {
                    if (item.value === 'start') onLaunch();
                    else if (item.value === 'template') onSaveTemplate();
                    else if (item.value === 'back') onBack();
                }}
            />
        </Box>
    );
}

/**
 * Main SPAR Builder Wizard
 */
export function SparBuilder({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [debate, setDebate] = useState({
        decision: '',
        preset: 'innovation',
        rules: {
            rounds: 2,
            style: 'constructive',
            patterns: []
        },
        config: {
            provider: 'ollama',
            model: 'mistral:latest'
        }
    });

    const totalSteps = 5;

    const updateDebate = (updates) => {
        setDebate(prev => ({ ...prev, ...updates }));
    };

    const handleLaunch = () => {
        onComplete(debate);
    };

    const handleSaveTemplate = () => {
        // TODO: Implement template saving
        console.log('Saving template:', debate);
    };

    useInput((input, key) => {
        if (key.escape) {
            if (step > 1) {
                setStep(s => s - 1);
            } else {
                onCancel();
            }
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box marginBottom={1}>
                <Text bold color="cyan">🥊 SPAR Builder</Text>
            </Box>

            {/* Progress */}
            <StepIndicator current={step} total={totalSteps} />

            {/* Current Step */}
            <Box
                flexDirection="column"
                borderStyle="single"
                borderColor="gray"
                paddingX={2}
                paddingY={1}
            >
                {step === 1 && (
                    <DecisionStep
                        value={debate.decision}
                        onChange={(v) => updateDebate({ decision: v })}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <PresetStep
                        value={debate.preset}
                        onChange={(v) => updateDebate({ preset: v })}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && (
                    <RulesStep
                        rules={debate.rules}
                        onChange={(v) => updateDebate({ rules: v })}
                        onNext={() => setStep(4)}
                        onBack={() => setStep(2)}
                    />
                )}
                {step === 4 && (
                    <EngineStep
                        config={debate.config}
                        onChange={(v) => updateDebate({ config: v })}
                        onNext={() => setStep(5)}
                        onBack={() => setStep(3)}
                    />
                )}
                {step === 5 && (
                    <ReviewStep
                        debate={debate}
                        onLaunch={handleLaunch}
                        onBack={() => setStep(4)}
                        onSaveTemplate={handleSaveTemplate}
                    />
                )}
            </Box>

            {/* Navigation hint */}
            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    Esc: {step > 1 ? 'Go back' : 'Cancel'} | Tab: Switch fields
                </Text>
            </Box>
        </Box>
    );
}

export default SparBuilder;
