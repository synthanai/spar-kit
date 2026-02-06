/**
 * SPAR-Kit TUI: Settings Component
 * 
 * Interactive settings editor for configuring SPAR-Kit.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { useConfigStore } from '../store/config.js';
import { useNavigationStore } from '../store/navigation.js';

/**
 * Section Header
 */
function SectionHeader({ title, icon }) {
    return (
        <Box marginY={1}>
            <Text color="cyan" bold>{icon} {title}</Text>
            <Text color="cyan"> ────────────────────────────────────</Text>
        </Box>
    );
}

/**
 * Setting Row
 */
function SettingRow({ label, value, isSelected, isEditing, children }) {
    return (
        <Box marginY={0}>
            <Box width={3}>
                <Text color={isSelected ? 'cyan' : 'gray'}>
                    {isSelected ? (isEditing ? '✎' : '▶') : ' '}
                </Text>
            </Box>
            <Box width={20}>
                <Text color={isSelected ? 'white' : 'gray'}>{label}:</Text>
            </Box>
            <Box>
                {isEditing ? children : (
                    <Text color="cyan">{value}</Text>
                )}
            </Box>
        </Box>
    );
}

/**
 * Provider Selection
 */
function ProviderSelector({ value, onChange }) {
    const providers = [
        { label: '🏠 Ollama (Local)', value: 'ollama' },
        { label: '🌐 OpenAI', value: 'openai' },
        { label: '🧠 Anthropic', value: 'anthropic' },
        { label: '💎 Gemini', value: 'gemini' }
    ];

    return (
        <SelectInput
            items={providers}
            initialIndex={providers.findIndex(p => p.value === value)}
            onSelect={(item) => onChange(item.value)}
        />
    );
}

/**
 * Model Input with suggestions
 */
function ModelInput({ value, onChange, provider }) {
    const suggestions = {
        ollama: ['mistral:latest', 'deepseek-r1:7b', 'qwen2.5:7b', 'llama2:latest'],
        openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
        anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        gemini: ['gemini-pro', 'gemini-ultra']
    };

    const providerSuggestions = suggestions[provider] || [];

    return (
        <Box flexDirection="column">
            <TextInput value={value} onChange={onChange} />
            {providerSuggestions.length > 0 && (
                <Box marginTop={0}>
                    <Text color="gray" dimColor>
                        Suggestions: {providerSuggestions.join(', ')}
                    </Text>
                </Box>
            )}
        </Box>
    );
}

/**
 * Main Settings Component
 */
export function Settings() {
    const config = useConfigStore(state => state.config);
    const loadConfig = useConfigStore(state => state.load);
    const setConfigValue = useConfigStore(state => state.set);
    const saveConfig = useConfigStore(state => state.save);
    const permissionWarning = useConfigStore(state => state.permissionWarning);

    const goBack = useNavigationStore(state => state.goBack);
    const showSuccess = useNavigationStore(state => state.showSuccess);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    const settings = [
        { key: 'provider', label: 'LLM Provider', section: 'engine' },
        { key: 'model', label: 'Model', section: 'engine' },
        { key: 'baseUrl', label: 'Base URL', section: 'engine' },
        { key: 'apiKey', label: 'API Key', section: 'engine', masked: true },
        { key: 'tui.theme', label: 'Theme', section: 'appearance' },
        { key: 'tui.showTips', label: 'Show Tips', section: 'appearance', boolean: true },
        { key: 'tui.confirmDelete', label: 'Confirm Delete', section: 'appearance', boolean: true },
        { key: 'debate.defaultRounds', label: 'Default Rounds', section: 'debate' },
        { key: 'tui.defaultPreset', label: 'Default Preset', section: 'debate' },
    ];

    useEffect(() => {
        loadConfig();
    }, []);

    const getConfigValue = (key) => {
        const keys = key.split('.');
        let value = config;
        for (const k of keys) {
            value = value?.[k];
        }
        return value;
    };

    const currentSetting = settings[selectedIndex];
    const currentValue = getConfigValue(currentSetting.key);

    useInput((input, key) => {
        if (editingField) {
            if (key.escape) {
                setEditingField(null);
            } else if (key.return) {
                setConfigValue(editingField, editValue);
                saveConfig();
                setEditingField(null);
                showSuccess('Setting saved!');
            }
            return;
        }

        if (key.leftArrow || key.escape) {
            goBack();
        } else if (key.upArrow) {
            setSelectedIndex(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setSelectedIndex(i => Math.min(settings.length - 1, i + 1));
        } else if (key.return) {
            const setting = settings[selectedIndex];
            if (setting.boolean) {
                // Toggle boolean
                setConfigValue(setting.key, !getConfigValue(setting.key));
                saveConfig();
            } else {
                // Start editing
                setEditingField(setting.key);
                setEditValue(String(getConfigValue(setting.key) || ''));
            }
        } else if (input === 's' || input === 'S') {
            saveConfig();
            showSuccess('All settings saved!');
        }
    });

    // Group settings by section
    const sections = {
        engine: settings.filter(s => s.section === 'engine'),
        appearance: settings.filter(s => s.section === 'appearance'),
        debate: settings.filter(s => s.section === 'debate')
    };

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box marginBottom={1}>
                <Text bold color="cyan">⚙️ Settings</Text>
            </Box>

            {/* Permission Warning */}
            {permissionWarning && (
                <Box marginBottom={1}>
                    <Text color="yellow">⚠️ {permissionWarning}</Text>
                </Box>
            )}

            {/* Engine Section */}
            <SectionHeader title="AI Engine" icon="🤖" />
            {sections.engine.map((setting, i) => {
                const globalIndex = settings.indexOf(setting);
                const value = getConfigValue(setting.key);
                const displayValue = setting.masked && value
                    ? '••••••••'
                    : String(value || 'Not set');

                return (
                    <SettingRow
                        key={setting.key}
                        label={setting.label}
                        value={displayValue}
                        isSelected={selectedIndex === globalIndex}
                        isEditing={editingField === setting.key}
                    >
                        {setting.key === 'provider' ? (
                            <ProviderSelector
                                value={editValue}
                                onChange={(v) => {
                                    setConfigValue(setting.key, v);
                                    setEditingField(null);
                                }}
                            />
                        ) : (
                            <TextInput
                                value={editValue}
                                onChange={setEditValue}
                                mask={setting.masked ? '*' : undefined}
                            />
                        )}
                    </SettingRow>
                );
            })}

            {/* Appearance Section */}
            <SectionHeader title="Appearance" icon="🎨" />
            {sections.appearance.map((setting) => {
                const globalIndex = settings.indexOf(setting);
                const value = getConfigValue(setting.key);
                const displayValue = setting.boolean
                    ? (value ? '✓ On' : '✗ Off')
                    : String(value || 'default');

                return (
                    <SettingRow
                        key={setting.key}
                        label={setting.label}
                        value={displayValue}
                        isSelected={selectedIndex === globalIndex}
                        isEditing={editingField === setting.key}
                    >
                        <TextInput value={editValue} onChange={setEditValue} />
                    </SettingRow>
                );
            })}

            {/* Debate Section */}
            <SectionHeader title="Debate Defaults" icon="⚔️" />
            {sections.debate.map((setting) => {
                const globalIndex = settings.indexOf(setting);
                const value = getConfigValue(setting.key);

                return (
                    <SettingRow
                        key={setting.key}
                        label={setting.label}
                        value={String(value || 'default')}
                        isSelected={selectedIndex === globalIndex}
                        isEditing={editingField === setting.key}
                    >
                        <TextInput value={editValue} onChange={setEditValue} />
                    </SettingRow>
                );
            })}

            {/* Actions */}
            <Box marginTop={2}>
                <Text color="gray" dimColor>
                    ↑↓ Navigate | Enter: Edit | S: Save All | ← Back
                </Text>
            </Box>

            {/* Config File Location */}
            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    📁 Config: ~/.spar/config.json
                </Text>
            </Box>
        </Box>
    );
}

export default Settings;
