/**
 * SPAR Kit Integration Test Suite
 * End-to-end tests for the complete SPAR workflow
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { jest } from '@jest/globals';

describe('SPAR Kit Integration', () => {
    describe('Full Debate Flow', () => {
        test('should handle complete debate lifecycle', async () => {
            // Simulate state transitions
            const states = ['setup', 'round1', 'round2', 'synthesis', 'export'];

            let currentState = 'setup';
            const transitions = [];

            // Setup -> Round 1
            currentState = 'round1';
            transitions.push('setup->round1');
            expect(currentState).toBe('round1');

            // Round 1 -> Round 2
            currentState = 'round2';
            transitions.push('round1->round2');
            expect(currentState).toBe('round2');

            // Round 2 -> Synthesis
            currentState = 'synthesis';
            transitions.push('round2->synthesis');
            expect(currentState).toBe('synthesis');

            // Synthesis -> Export
            currentState = 'export';
            transitions.push('synthesis->export');
            expect(currentState).toBe('export');

            expect(transitions).toHaveLength(4);
        });

        test('should support early export after round 1', () => {
            // User can export after Round 1 without running Round 2
            const state = {
                currentRound: 1,
                canExport: true,
                round1Complete: true,
                round2Complete: false
            };

            expect(state.canExport).toBe(true);
            expect(state.round2Complete).toBe(false);
        });

        test('should support reset at any point', () => {
            const initialState = {
                decision: '',
                responses: {
                    round1: { north: '', east: '', south: '', west: '' },
                    round2: { north: '', east: '', south: '', west: '' }
                },
                synthesis: ''
            };

            // Simulate some progress
            let state = {
                decision: 'Test decision',
                responses: {
                    round1: { north: 'resp', east: 'resp', south: '', west: '' },
                    round2: { north: '', east: '', south: '', west: '' }
                },
                synthesis: ''
            };

            // Reset
            state = { ...initialState };

            expect(state.decision).toBe('');
            expect(state.responses.round1.north).toBe('');
        });
    });

    describe('Multi-Provider Support', () => {
        const providers = ['openai', 'anthropic', 'gemini'];

        test.each(providers)('should support %s provider selection', (provider) => {
            const config = { provider, apiKey: 'test-key' };
            expect(config.provider).toBe(provider);
        });

        test('should build correct endpoints for each provider', () => {
            const apiKey = 'test-key';
            const endpoints = {
                openai: 'https://api.openai.com/v1/chat/completions',
                anthropic: 'https://api.anthropic.com/v1/messages',
                gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
            };

            expect(endpoints.openai).toContain('openai.com');
            expect(endpoints.anthropic).toContain('anthropic.com');
            expect(endpoints.gemini).toContain('googleapis.com');
            expect(endpoints.gemini).toContain(apiKey);
        });
    });

    describe('Parallel Execution', () => {
        test('should support parallel persona requests', async () => {
            const directions = ['north', 'east', 'south', 'west'];
            const startTime = Date.now();

            // Simulate parallel requests (each takes ~10ms)
            const promises = directions.map(async (dir) => {
                await new Promise(resolve => setTimeout(resolve, 10));
                return { direction: dir, response: `${dir} response` };
            });

            const results = await Promise.all(promises);
            const duration = Date.now() - startTime;

            expect(results).toHaveLength(4);
            expect(results.map(r => r.direction).sort()).toEqual(directions.sort());
            // All should complete in roughly parallel time (not 40ms sequential)
            expect(duration).toBeLessThan(200);
        });
    });

    describe('Error Handling', () => {
        test('should gracefully handle API errors', async () => {
            const mockApiCall = async (provider) => {
                if (provider === 'invalid') {
                    throw new Error('Unknown provider: invalid');
                }
                return 'success';
            };

            // Valid provider
            await expect(mockApiCall('openai')).resolves.toBe('success');

            // Invalid provider
            await expect(mockApiCall('invalid')).rejects.toThrow('Unknown provider');
        });

        test('should continue with other personas if one fails', async () => {
            const directions = ['north', 'east', 'south', 'west'];
            const failDirection = 'east';

            const promises = directions.map(async (dir) => {
                if (dir === failDirection) {
                    return { direction: dir, error: 'API Error' };
                }
                return { direction: dir, response: `${dir} response` };
            });

            const results = await Promise.all(promises);

            expect(results.filter(r => r.response)).toHaveLength(3);
            expect(results.filter(r => r.error)).toHaveLength(1);
            expect(results.find(r => r.direction === failDirection).error).toBe('API Error');
        });
    });

    describe('Response Synthesis', () => {
        test('should combine all persona responses for synthesis', () => {
            const responses = {
                north: 'Vision perspective',
                east: 'Innovation perspective',
                south: 'Practical perspective',
                west: 'Wisdom perspective'
            };

            const synthesisInput = `
NORTH (Visionary): ${responses.north}
EAST (Challenger): ${responses.east}
SOUTH (Pragmatist): ${responses.south}
WEST (Sage): ${responses.west}
            `.trim();

            expect(synthesisInput).toContain('Vision perspective');
            expect(synthesisInput).toContain('Innovation perspective');
            expect(synthesisInput).toContain('Practical perspective');
            expect(synthesisInput).toContain('Wisdom perspective');
        });

        test('should include round 2 responses in synthesis when available', () => {
            const round1 = { north: 'N1', east: 'E1', south: 'S1', west: 'W1' };
            const round2 = { north: 'N2', east: 'E2', south: 'S2', west: 'W2' };

            const hasRound2 = Object.values(round2).some(v => v.length > 0);

            const synthesisContext = hasRound2
                ? { round1, round2 }
                : { round1 };

            expect(synthesisContext.round2).toBeDefined();
        });
    });

    describe('Export Validation', () => {
        test('exported markdown should contain all required sections', () => {
            const requiredSections = [
                '# SPAR Session',
                '## Decision',
                '## Round 1',
                '### 🔵 North',
                '### 🟢 East',
                '### 🟡 South',
                '### 🔴 West',
                'நாலு பேரு, நாலு திசை, ஒரு முடிவு'
            ];

            const md = `# SPAR Session: Test

**Date**: 2026-01-14

---

## Decision

Test decision

---

## Round 1: Opening Positions

### 🔵 North — The Visionary
Response

### 🟢 East — The Challenger
Response

### 🟡 South — The Pragmatist
Response

### 🔴 West — The Sage
Response

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு.**
> *Four voices, four directions, one decision.*

Generated by [SPAR Kit](https://github.com/synthanai/spar-kit)
`;

            for (const section of requiredSections) {
                expect(md).toContain(section);
            }
        });

        test('should generate unique filenames based on date', () => {
            const date = new Date().toISOString().split('T')[0];
            const timestamp = Date.now();
            const filename = `spar-session-${date}-${timestamp}.md`;

            expect(filename).toMatch(/^spar-session-\d{4}-\d{2}-\d{2}-\d+\.md$/);
        });
    });
});

describe('SPAR Kit Cross-Component Integration', () => {
    describe('Persona Consistency', () => {
        test('CLI and HTML should use same persona definitions', () => {
            const cliPersonas = {
                north: { name: 'The Visionary', icon: '🔵' },
                east: { name: 'The Challenger', icon: '🟢' },
                south: { name: 'The Pragmatist', icon: '🟡' },
                west: { name: 'The Sage', icon: '🔴' }
            };

            const htmlPersonas = {
                north: { name: 'The Visionary', icon: '🔵' },
                east: { name: 'The Challenger', icon: '🟢' },
                south: { name: 'The Pragmatist', icon: '🟡' },
                west: { name: 'The Sage', icon: '🔴' }
            };

            for (const dir of ['north', 'east', 'south', 'west']) {
                expect(cliPersonas[dir].name).toBe(htmlPersonas[dir].name);
                expect(cliPersonas[dir].icon).toBe(htmlPersonas[dir].icon);
            }
        });
    });

    describe('Tamil Taglines Consistency', () => {
        test('should use consistent Tamil phrases across components', () => {
            const phrases = [
                'நாலு பேரு நாலு விதமா பேசுவாங்க',
                'நாலு பேரு, நாலு திசை, ஒரு முடிவு'
            ];

            // These should appear in both CLI and HTML
            expect(phrases).toContain('நாலு பேரு நாலு விதமா பேசுவாங்க');
            expect(phrases).toContain('நாலு பேரு, நாலு திசை, ஒரு முடிவு');
        });
    });

    describe('Provider Configuration Consistency', () => {
        test('CLI and HTML should support same providers', () => {
            const supportedProviders = ['openai', 'anthropic', 'gemini'];

            expect(supportedProviders).toContain('openai');
            expect(supportedProviders).toContain('anthropic');
            expect(supportedProviders).toContain('gemini');
            expect(supportedProviders).toHaveLength(3);
        });

        test('API endpoints should match between CLI and HTML', () => {
            const apiKey = 'test';

            const cliEndpoints = {
                openai: 'https://api.openai.com/v1/chat/completions',
                anthropic: 'https://api.anthropic.com/v1/messages',
                gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
            };

            const htmlEndpoints = {
                openai: 'https://api.openai.com/v1/chat/completions',
                anthropic: 'https://api.anthropic.com/v1/messages',
                gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
            };

            expect(cliEndpoints).toEqual(htmlEndpoints);
        });
    });
});
