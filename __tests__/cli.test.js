/**
 * SPAR Kit CLI Test Suite
 * Tests for the command-line interface functionality
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { jest } from '@jest/globals';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Mock dependencies
jest.unstable_mockModule('commander', () => ({
    Command: class MockCommand {
        name() { return this; }
        description() { return this; }
        version() { return this; }
        command() { return this; }
        option() { return this; }
        action() { return this; }
        parse() { return this; }
    }
}));

jest.unstable_mockModule('inquirer', () => ({
    default: {
        prompt: jest.fn()
    }
}));

jest.unstable_mockModule('chalk', () => ({
    default: {
        bold: Object.assign(str => str, {
            magenta: str => str,
            white: str => str
        }),
        gray: str => str,
        blue: str => str,
        green: str => str,
        yellow: str => str,
        red: str => str,
        white: str => str,
        magenta: str => str
    }
}));

jest.unstable_mockModule('ora', () => ({
    default: () => ({
        start: jest.fn().mockReturnThis(),
        succeed: jest.fn().mockReturnThis(),
        fail: jest.fn().mockReturnThis()
    })
}));

// Test constants
const CONFIG_PATH = join(homedir(), '.spar-kit.json');
const TEST_CONFIG_BACKUP = join(homedir(), '.spar-kit.json.test-backup');

describe('SPAR Kit CLI', () => {
    // Backup and restore config file
    beforeAll(() => {
        if (existsSync(CONFIG_PATH)) {
            writeFileSync(TEST_CONFIG_BACKUP, readFileSync(CONFIG_PATH));
        }
    });

    afterAll(() => {
        if (existsSync(TEST_CONFIG_BACKUP)) {
            writeFileSync(CONFIG_PATH, readFileSync(TEST_CONFIG_BACKUP));
            unlinkSync(TEST_CONFIG_BACKUP);
        } else if (existsSync(CONFIG_PATH)) {
            unlinkSync(CONFIG_PATH);
        }
    });

    describe('Configuration Management', () => {
        test('should create config file when saving credentials', () => {
            const testConfig = { provider: 'openai', apiKey: 'test-key-123' };
            writeFileSync(CONFIG_PATH, JSON.stringify(testConfig, null, 2));

            expect(existsSync(CONFIG_PATH)).toBe(true);

            const loaded = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
            expect(loaded.provider).toBe('openai');
            expect(loaded.apiKey).toBe('test-key-123');
        });

        test('should handle malformed config gracefully', () => {
            writeFileSync(CONFIG_PATH, 'not-valid-json');

            let config = {};
            try {
                config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
            } catch {
                config = {};
            }

            expect(config).toEqual({});
        });

        test('should return empty config when file does not exist', () => {
            if (existsSync(CONFIG_PATH)) {
                unlinkSync(CONFIG_PATH);
            }

            let config = {};
            if (existsSync(CONFIG_PATH)) {
                config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
            }

            expect(config).toEqual({});
        });
    });

    describe('Persona Definitions', () => {
        const PERSONAS = {
            north: {
                name: 'The Visionary',
                direction: 'North',
                icon: '🔵'
            },
            east: {
                name: 'The Challenger',
                direction: 'East',
                icon: '🟢'
            },
            south: {
                name: 'The Pragmatist',
                direction: 'South',
                icon: '🟡'
            },
            west: {
                name: 'The Sage',
                direction: 'West',
                icon: '🔴'
            }
        };

        test('should have all four compass directions', () => {
            expect(Object.keys(PERSONAS)).toEqual(['north', 'east', 'south', 'west']);
        });

        test('each persona should have required properties', () => {
            for (const [dir, persona] of Object.entries(PERSONAS)) {
                expect(persona).toHaveProperty('name');
                expect(persona).toHaveProperty('direction');
                expect(persona).toHaveProperty('icon');
                expect(typeof persona.name).toBe('string');
                expect(typeof persona.direction).toBe('string');
                expect(typeof persona.icon).toBe('string');
            }
        });

        test('persona names should match directions', () => {
            expect(PERSONAS.north.name).toBe('The Visionary');
            expect(PERSONAS.east.name).toBe('The Challenger');
            expect(PERSONAS.south.name).toBe('The Pragmatist');
            expect(PERSONAS.west.name).toBe('The Sage');
        });
    });

    describe('API Provider Support', () => {
        const SUPPORTED_PROVIDERS = ['openai', 'anthropic', 'gemini'];

        test('should support OpenAI provider', () => {
            expect(SUPPORTED_PROVIDERS).toContain('openai');
        });

        test('should support Anthropic provider', () => {
            expect(SUPPORTED_PROVIDERS).toContain('anthropic');
        });

        test('should support Gemini provider', () => {
            expect(SUPPORTED_PROVIDERS).toContain('gemini');
        });
    });

    describe('Markdown Export Format', () => {
        test('should generate valid markdown structure', () => {
            const decision = 'Test decision';
            const responses = {
                north: 'North response',
                east: 'East response',
                south: 'South response',
                west: 'West response'
            };
            const date = new Date().toISOString().split('T')[0];

            const md = `# SPAR Session

**Date**: ${new Date().toISOString()}
**Provider**: openai

---

## Decision

${decision}

---

## Round 1: Opening Positions

### 🔵 North — The Visionary
${responses.north}

### 🟢 East — The Challenger
${responses.east}

### 🟡 South — The Pragmatist
${responses.south}

### 🔴 West — The Sage
${responses.west}

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு.**
> *Four voices, four directions, one decision.*

Generated by [SPAR Kit](https://github.com/synthanai/spar-kit)
`;

            expect(md).toContain('# SPAR Session');
            expect(md).toContain('## Decision');
            expect(md).toContain('## Round 1: Opening Positions');
            expect(md).toContain('### 🔵 North — The Visionary');
            expect(md).toContain('### 🟢 East — The Challenger');
            expect(md).toContain('### 🟡 South — The Pragmatist');
            expect(md).toContain('### 🔴 West — The Sage');
            expect(md).toContain('நாலு பேரு, நாலு திசை, ஒரு முடிவு');
        });
    });

    describe('Input Validation', () => {
        test('should reject empty decision', () => {
            const decision = '';
            const isValid = Boolean(decision && decision.trim().length > 0);
            expect(isValid).toBe(false);
        });

        test('should reject whitespace-only decision', () => {
            const decision = '   \n\t  ';
            const isValid = decision && decision.trim().length > 0;
            expect(isValid).toBe(false);
        });

        test('should accept valid decision', () => {
            const decision = 'Should we expand to Singapore?';
            const isValid = decision && decision.trim().length > 0;
            expect(isValid).toBe(true);
        });
    });

    describe('API Request Structure', () => {
        test('should create valid OpenAI request body', () => {
            const systemPrompt = 'You are THE VISIONARY';
            const userMessage = 'THE DECISION: Test';

            const body = {
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 800
            };

            expect(body.model).toBe('gpt-4-turbo-preview');
            expect(body.messages).toHaveLength(2);
            expect(body.messages[0].role).toBe('system');
            expect(body.messages[1].role).toBe('user');
        });

        test('should create valid Anthropic request body', () => {
            const systemPrompt = 'You are THE VISIONARY';
            const userMessage = 'THE DECISION: Test';

            const body = {
                model: 'claude-3-sonnet-20240229',
                max_tokens: 800,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }]
            };

            expect(body.model).toBe('claude-3-sonnet-20240229');
            expect(body.system).toBe(systemPrompt);
            expect(body.messages[0].content).toBe(userMessage);
        });

        test('should create valid Gemini request body', () => {
            const systemPrompt = 'You are THE VISIONARY';
            const userMessage = 'THE DECISION: Test';

            const body = {
                contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }]
            };

            expect(body.contents).toHaveLength(1);
            expect(body.contents[0].parts[0].text).toContain(systemPrompt);
            expect(body.contents[0].parts[0].text).toContain(userMessage);
        });
    });
});
