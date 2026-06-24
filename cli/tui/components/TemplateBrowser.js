/**
 * SPAR-Kit TUI: Template Browser Component
 * 
 * Browse, select, and use debate templates.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { listTemplates, getTemplate, applyTemplate, getTemplatesByCategory } from '../store/templates.js';
import { useNavigationStore, Views } from '../store/navigation.js';

/**
 * Template Card
 */
function TemplateCard({ template, isSelected, onSelect }) {
    return (
        <Box
            flexDirection="column"
            borderStyle={isSelected ? 'double' : 'single'}
            borderColor={isSelected ? 'cyan' : 'gray'}
            paddingX={1}
            paddingY={0}
            marginBottom={1}
        >
            <Box>
                <Text color={isSelected ? 'cyan' : 'white'} bold>
                    {template.icon} {template.name}
                </Text>
                {template.builtin && (
                    <Text color="gray" dimColor> (built-in)</Text>
                )}
            </Box>
            <Text color="gray" wrap="wrap">{template.description}</Text>
            <Box>
                <Text color="magenta" dimColor>
                    {template.preset} • {template.variableCount} variable{template.variableCount !== 1 ? 's' : ''}
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Variable Input Form
 */
function VariableForm({ template, values, onChange, onSubmit, onCancel }) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const variables = template.variables || [];

    useInput((input, key) => {
        if (key.escape) {
            onCancel();
        } else if (key.return) {
            if (focusedIndex < variables.length - 1) {
                setFocusedIndex(i => i + 1);
            } else {
                onSubmit();
            }
        } else if (key.upArrow) {
            setFocusedIndex(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setFocusedIndex(i => Math.min(variables.length - 1, i + 1));
        }
    });

    if (variables.length === 0) {
        return (
            <Box flexDirection="column">
                <Text color="cyan">This template has no variables.</Text>
                <Text color="gray">Press Enter to continue.</Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="column">
            <Text bold color="cyan">📝 Fill in the details:</Text>
            <Box marginY={1} />

            {variables.map((variable, index) => (
                <Box key={variable.name} flexDirection="column" marginBottom={1}>
                    <Box>
                        <Text color={focusedIndex === index ? 'cyan' : 'gray'}>
                            {focusedIndex === index ? '▶ ' : '  '}
                        </Text>
                        <Text color={focusedIndex === index ? 'white' : 'gray'}>
                            {variable.label}:
                        </Text>
                    </Box>
                    {focusedIndex === index ? (
                        <Box marginLeft={2}>
                            <Box borderStyle="round" borderColor="cyan" paddingX={1}>
                                <TextInput
                                    value={values[variable.name] || ''}
                                    onChange={(v) => onChange({ ...values, [variable.name]: v })}
                                    placeholder={variable.placeholder}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box marginLeft={2}>
                            <Text color="gray">
                                {values[variable.name] || variable.placeholder}
                            </Text>
                        </Box>
                    )}
                </Box>
            ))}

            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    ↑↓ Navigate | Enter: Next/Submit | Esc: Cancel
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Template Preview
 */
function TemplatePreview({ template, variableValues }) {
    const preview = applyTemplate(template, variableValues);

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="green"
            paddingX={2}
            paddingY={1}
        >
            <Text bold color="green">Preview:</Text>
            <Box marginY={1}>
                <Text wrap="wrap">{preview.decision}</Text>
            </Box>
            <Box>
                <Text color="gray">Preset: </Text>
                <Text color="magenta">{preview.preset}</Text>
                <Text color="gray"> • Rounds: </Text>
                <Text>{preview.rules.rounds}</Text>
            </Box>
        </Box>
    );
}

/**
 * Main Template Browser Component
 */
export function TemplateBrowser({ onSelect, onCancel }) {
    const [view, setView] = useState('list'); // list, variables, preview
    const [templates, setTemplates] = useState({ builtin: [], user: [] });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [variableValues, setVariableValues] = useState({});
    const [showCategory, setShowCategory] = useState('builtin'); // builtin, user

    const navigate = useNavigationStore(state => state.navigate);
    const goBack = useNavigationStore(state => state.goBack);

    useEffect(() => {
        const loaded = getTemplatesByCategory();
        setTemplates(loaded);
    }, []);

    const currentList = templates[showCategory] || [];

    useInput((input, key) => {
        if (view !== 'list') return;

        if (key.escape || key.leftArrow) {
            onCancel ? onCancel() : goBack();
        } else if (key.upArrow) {
            setSelectedIndex(i => Math.max(0, i - 1));
        } else if (key.downArrow) {
            setSelectedIndex(i => Math.min(currentList.length - 1, i + 1));
        } else if (key.return) {
            const template = getTemplate(currentList[selectedIndex].id);
            setSelectedTemplate(template);
            if (template.variables?.length > 0) {
                setView('variables');
            } else {
                handleComplete(template, {});
            }
        } else if (key.tab) {
            setShowCategory(c => c === 'builtin' ? 'user' : 'builtin');
            setSelectedIndex(0);
        }
    });

    const handleComplete = (template, values) => {
        const debate = applyTemplate(template, values);
        if (onSelect) {
            onSelect(debate);
        } else {
            navigate(Views.NEW_DEBATE, { prefill: debate });
        }
    };

    const handleVariableSubmit = () => {
        setView('preview');
    };

    const handleConfirm = () => {
        handleComplete(selectedTemplate, variableValues);
    };

    // Variable Input View
    if (view === 'variables') {
        return (
            <Box flexDirection="column" padding={1}>
                <Box marginBottom={1}>
                    <Text bold color="cyan">📋 {selectedTemplate.icon} {selectedTemplate.name}</Text>
                </Box>

                <VariableForm
                    template={selectedTemplate}
                    values={variableValues}
                    onChange={setVariableValues}
                    onSubmit={handleVariableSubmit}
                    onCancel={() => setView('list')}
                />
            </Box>
        );
    }

    // Preview View
    if (view === 'preview') {
        return (
            <Box flexDirection="column" padding={1}>
                <Box marginBottom={1}>
                    <Text bold color="cyan">🚀 Ready to debate!</Text>
                </Box>

                <TemplatePreview
                    template={selectedTemplate}
                    variableValues={variableValues}
                />

                <Box marginTop={1}>
                    <Text color="gray">
                        [Enter] Start Debate | [E] Edit | [Esc] Cancel
                    </Text>
                </Box>
            </Box>
        );
    }

    // List View
    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box marginBottom={1}>
                <Text bold color="cyan">📚 Templates</Text>
            </Box>

            {/* Category Tabs */}
            <Box marginBottom={1}>
                <Text
                    color={showCategory === 'builtin' ? 'cyan' : 'gray'}
                    bold={showCategory === 'builtin'}
                >
                    Built-in ({templates.builtin.length})
                </Text>
                <Text color="gray"> | </Text>
                <Text
                    color={showCategory === 'user' ? 'cyan' : 'gray'}
                    bold={showCategory === 'user'}
                >
                    My Templates ({templates.user.length})
                </Text>
                <Text color="gray" dimColor> [Tab to switch]</Text>
            </Box>

            {/* Template List */}
            <Box flexDirection="column">
                {currentList.length === 0 ? (
                    <Box>
                        <Text color="gray">
                            {showCategory === 'user'
                                ? 'No custom templates yet. Save a debate as template to add one!'
                                : 'No templates available.'}
                        </Text>
                    </Box>
                ) : (
                    currentList.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={selectedIndex === index}
                        />
                    ))
                )}
            </Box>

            {/* Navigation */}
            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    ↑↓ Navigate | Enter: Select | Tab: Switch category | Esc: Back
                </Text>
            </Box>
        </Box>
    );
}

export default TemplateBrowser;
