/**
 * PersonaBrowser Component
 * Browse and select personas from the 109-persona PERSONA Library
 * Shows full profiles before confirming selection
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

import {
    getAllPersonas,
    PERSONA_ARCHETYPES,
    PRESET_PACKS,
    getPersonasByArchetype
} from '../../../personas.js';

/**
 * Archetype selector (P-E-R-S-O-N-A tabs)
 */
function ArchetypeSelector({ selected, onSelect }) {
    const archetypes = Object.entries(PERSONA_ARCHETYPES);

    return (
        <Box marginBottom={1}>
            {archetypes.map(([key, arch], i) => {
                const isSelected = key === selected;
                return (
                    <Box key={key} marginRight={1}>
                        <Text
                            color={isSelected ? 'cyan' : 'gray'}
                            bold={isSelected}
                            inverse={isSelected}
                        >
                            {' '}{key}{' '}
                        </Text>
                    </Box>
                );
            })}
            <Box marginLeft={2}>
                <Text color="gray" dimColor>← → to switch</Text>
            </Box>
        </Box>
    );
}

/**
 * Persona list within an archetype
 */
function PersonaList({ personas, selectedIndex, onSelect }) {
    return (
        <Box flexDirection="column" marginLeft={2}>
            {personas.map((persona, i) => {
                const isSelected = i === selectedIndex;
                return (
                    <Box key={persona.id}>
                        <Text
                            color={isSelected ? 'cyan' : 'white'}
                            bold={isSelected}
                        >
                            {isSelected ? '▶ ' : '  '}
                            {persona.icon || '•'} {persona.name}
                        </Text>
                        {isSelected && (
                            <Text color="gray"> — {persona.keyQuestion}</Text>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

/**
 * Full persona profile preview
 */
function PersonaProfile({ persona }) {
    if (!persona) {
        return (
            <Box padding={1}>
                <Text color="gray" italic>Select a persona to see profile</Text>
            </Box>
        );
    }

    return (
        <Box
            flexDirection="column"
            borderStyle="round"
            borderColor="cyan"
            paddingX={2}
            paddingY={1}
        >
            <Box marginBottom={1}>
                <Text bold color="cyan">
                    {persona.icon || '•'} {persona.name}
                </Text>
                <Text color="gray"> ({persona.archetype})</Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text color="yellow" bold>🎯 Core Priority:</Text>
                <Text wrap="wrap">{persona.corePriority}</Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text color="red" bold>😱 Fear:</Text>
                <Text wrap="wrap">{persona.fear}</Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text color="green" bold>❓ Key Question:</Text>
                <Text wrap="wrap">"{persona.keyQuestion}"</Text>
            </Box>

            <Box marginTop={1}>
                <Text color="gray" dimColor>
                    Press ENTER to add to selection, ESC to go back
                </Text>
            </Box>
        </Box>
    );
}

/**
 * Selected personas display
 */
function SelectedPersonas({ personas, maxPersonas = 4 }) {
    const slots = Array(maxPersonas).fill(null);
    personas.forEach((p, i) => {
        if (i < maxPersonas) slots[i] = p;
    });

    return (
        <Box marginBottom={1}>
            <Text bold>Selected ({personas.length}/{maxPersonas}): </Text>
            {slots.map((persona, i) => (
                <Box key={i} marginRight={1}>
                    {persona ? (
                        <Text color="green">
                            {persona.icon || '•'} {persona.name.split(' ').pop()}
                        </Text>
                    ) : (
                        <Text color="gray">[ empty ]</Text>
                    )}
                </Box>
            ))}
        </Box>
    );
}

/**
 * Preset pack selector
 */
function PresetSelector({ onSelect }) {
    const presets = Object.entries(PRESET_PACKS);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useInput((input, key) => {
        if (key.upArrow && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
        if (key.downArrow && selectedIndex < presets.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
        if (key.return) {
            const [id, pack] = presets[selectedIndex];
            onSelect(id, pack);
        }
    });

    return (
        <Box flexDirection="column">
            <Text bold color="yellow" marginBottom={1}>
                📦 Quick Start: Choose a Preset Pack
            </Text>
            {presets.map(([id, pack], i) => (
                <Box key={id}>
                    <Text
                        color={i === selectedIndex ? 'cyan' : 'white'}
                        bold={i === selectedIndex}
                    >
                        {i === selectedIndex ? '▶ ' : '  '}
                        {pack.name}
                    </Text>
                    <Text color="gray"> — {pack.description}</Text>
                </Box>
            ))}
            <Box marginTop={1}>
                <Text color="gray">ENTER to select, TAB for custom selection</Text>
            </Box>
        </Box>
    );
}

/**
 * Main PersonaBrowser component
 */
export function PersonaBrowser({ onConfirm, onCancel, maxPersonas = 4 }) {
    const [mode, setMode] = useState('presets'); // 'presets' | 'browse' | 'preview'
    const [selectedArchetype, setSelectedArchetype] = useState('P');
    const [personaIndex, setPersonaIndex] = useState(0);
    const [selectedPersonas, setSelectedPersonas] = useState([]);
    const [previewPersona, setPreviewPersona] = useState(null);

    const archetypeKeys = Object.keys(PERSONA_ARCHETYPES);
    const allPersonas = getAllPersonas();
    const currentArchetypePersonas = Object.values(allPersonas).filter(
        p => p.archetype === PERSONA_ARCHETYPES[selectedArchetype]?.name
    );

    useInput((input, key) => {
        // Mode switching
        if (key.tab && mode === 'presets') {
            setMode('browse');
            return;
        }
        if (key.tab && mode === 'browse') {
            setMode('presets');
            return;
        }

        // Cancel
        if (key.escape) {
            if (mode === 'preview') {
                setMode('browse');
                setPreviewPersona(null);
            } else {
                onCancel?.();
            }
            return;
        }

        // Browse mode navigation
        if (mode === 'browse') {
            // Archetype navigation (left/right)
            if (key.leftArrow) {
                const currentIndex = archetypeKeys.indexOf(selectedArchetype);
                if (currentIndex > 0) {
                    setSelectedArchetype(archetypeKeys[currentIndex - 1]);
                    setPersonaIndex(0);
                }
            }
            if (key.rightArrow) {
                const currentIndex = archetypeKeys.indexOf(selectedArchetype);
                if (currentIndex < archetypeKeys.length - 1) {
                    setSelectedArchetype(archetypeKeys[currentIndex + 1]);
                    setPersonaIndex(0);
                }
            }

            // Persona navigation (up/down)
            if (key.upArrow && personaIndex > 0) {
                setPersonaIndex(personaIndex - 1);
            }
            if (key.downArrow && personaIndex < currentArchetypePersonas.length - 1) {
                setPersonaIndex(personaIndex + 1);
            }

            // Preview persona (Enter)
            if (key.return && currentArchetypePersonas[personaIndex]) {
                setPreviewPersona(currentArchetypePersonas[personaIndex]);
                setMode('preview');
            }

            // Quick add with space
            if (input === ' ' && currentArchetypePersonas[personaIndex]) {
                addPersona(currentArchetypePersonas[personaIndex]);
            }
        }

        // Preview mode
        if (mode === 'preview') {
            if (key.return) {
                addPersona(previewPersona);
                setPreviewPersona(null);
                setMode('browse');
            }
        }

        // Confirm selection (when we have enough personas)
        if (input === 'c' && selectedPersonas.length >= 2) {
            onConfirm?.(selectedPersonas);
        }

        // Remove last persona
        if (input === 'x' && selectedPersonas.length > 0) {
            setSelectedPersonas(selectedPersonas.slice(0, -1));
        }
    });

    const addPersona = (persona) => {
        if (selectedPersonas.length >= maxPersonas) return;
        if (selectedPersonas.find(p => p.id === persona.id)) return;
        setSelectedPersonas([...selectedPersonas, persona]);
    };

    // Handle preset selection
    const handlePresetSelect = (id, pack) => {
        const presetPersonas = pack.personas.map(pid => allPersonas[pid]).filter(Boolean);
        setSelectedPersonas(presetPersonas);
        onConfirm?.(presetPersonas);
    };

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header */}
            <Box marginBottom={1}>
                <Text bold color="magenta">
                    👥 POPULATE: Choose Your Four Clashing Perspectives
                </Text>
            </Box>

            {/* Selected personas */}
            <SelectedPersonas personas={selectedPersonas} maxPersonas={maxPersonas} />

            {/* Preset mode */}
            {mode === 'presets' && (
                <PresetSelector onSelect={handlePresetSelect} />
            )}

            {/* Browse mode */}
            {mode === 'browse' && (
                <Box flexDirection="column">
                    <ArchetypeSelector
                        selected={selectedArchetype}
                        onSelect={setSelectedArchetype}
                    />

                    <Box>
                        <Text color="yellow" bold>
                            {PERSONA_ARCHETYPES[selectedArchetype]?.icon}{' '}
                            {PERSONA_ARCHETYPES[selectedArchetype]?.name}
                        </Text>
                        <Text color="gray">
                            {' '}— "{PERSONA_ARCHETYPES[selectedArchetype]?.question}"
                        </Text>
                    </Box>

                    <PersonaList
                        personas={currentArchetypePersonas}
                        selectedIndex={personaIndex}
                    />

                    <Box marginTop={1}>
                        <Text color="gray">
                            ↑↓ navigate | ENTER preview | SPACE add | X remove | C confirm
                        </Text>
                    </Box>
                </Box>
            )}

            {/* Preview mode */}
            {mode === 'preview' && (
                <PersonaProfile persona={previewPersona} />
            )}

            {/* Confirm button */}
            {selectedPersonas.length >= 2 && mode !== 'preview' && (
                <Box marginTop={1}>
                    <Text color="green" bold>
                        ✓ Press C to confirm selection and proceed
                    </Text>
                </Box>
            )}
        </Box>
    );
}

export default PersonaBrowser;
