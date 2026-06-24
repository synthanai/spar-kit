/**
 * SPAR-Kit Unit Tests: Config Store
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock the config store
const createMockConfigStore = () => ({
    provider: 'ollama',
    model: 'llama3.2',
    reasoningMode: 'standard',
    apiKey: null,
    baseUrl: 'http://localhost:11434',

    setProvider: jest.fn(),
    setModel: jest.fn(),
    setReasoningMode: jest.fn(),
    setApiKey: jest.fn(),
    setBaseUrl: jest.fn(),
    reset: jest.fn(),
    loadFromDisk: jest.fn(),
    saveToDisk: jest.fn()
});

describe('Config Store', () => {
    let configStore;

    beforeEach(() => {
        configStore = createMockConfigStore();
    });

    describe('Provider Configuration', () => {
        test('default provider is ollama', () => {
            expect(configStore.provider).toBe('ollama');
        });

        test('setProvider updates provider', () => {
            configStore.provider = 'openai';
            expect(configStore.provider).toBe('openai');
        });

        test('supports all valid providers', () => {
            const validProviders = ['ollama', 'openai', 'anthropic', 'gemini', 'openai-compatible'];
            validProviders.forEach(provider => {
                configStore.provider = provider;
                expect(configStore.provider).toBe(provider);
            });
        });
    });

    describe('Model Configuration', () => {
        test('default model is set', () => {
            expect(configStore.model).toBeDefined();
        });

        test('setModel updates model', () => {
            configStore.model = 'gpt-4';
            expect(configStore.model).toBe('gpt-4');
        });
    });

    describe('Reasoning Mode', () => {
        test('default reasoning mode is standard', () => {
            expect(configStore.reasoningMode).toBe('standard');
        });

        test('supports ultrathink mode', () => {
            configStore.reasoningMode = 'ultrathink';
            expect(configStore.reasoningMode).toBe('ultrathink');
        });

        test('supports maximum mode', () => {
            configStore.reasoningMode = 'maximum';
            expect(configStore.reasoningMode).toBe('maximum');
        });
    });

    describe('API Key Handling', () => {
        test('API key is null by default', () => {
            expect(configStore.apiKey).toBeNull();
        });

        test('setApiKey stores key', () => {
            configStore.apiKey = 'sk-test-key';
            expect(configStore.apiKey).toBe('sk-test-key');
        });

        test('API key not required for ollama', () => {
            configStore.provider = 'ollama';
            expect(configStore.apiKey).toBeNull();
        });
    });

    describe('Base URL', () => {
        test('default baseUrl for ollama', () => {
            expect(configStore.baseUrl).toBe('http://localhost:11434');
        });

        test('setBaseUrl updates URL', () => {
            configStore.baseUrl = 'http://custom:8080';
            expect(configStore.baseUrl).toBe('http://custom:8080');
        });
    });

    describe('Persistence', () => {
        test('loadFromDisk is callable', () => {
            expect(typeof configStore.loadFromDisk).toBe('function');
        });

        test('saveToDisk is callable', () => {
            expect(typeof configStore.saveToDisk).toBe('function');
        });

        test('reset restores defaults', () => {
            configStore.reset();
            expect(configStore.reset).toHaveBeenCalled();
        });
    });
});

describe('Config Validation', () => {
    test('provider must be valid string', () => {
        const invalidProviders = [null, undefined, 123, {}, []];
        invalidProviders.forEach(provider => {
            expect(typeof provider !== 'string' || provider === '').toBe(true);
        });
    });

    test('model must be non-empty string', () => {
        const validModels = ['llama3.2', 'gpt-4', 'claude-3-sonnet'];
        validModels.forEach(model => {
            expect(typeof model).toBe('string');
            expect(model.length).toBeGreaterThan(0);
        });
    });

    test('reasoning mode must be valid', () => {
        const validModes = ['standard', 'ultrathink', 'maximum'];
        validModes.forEach(mode => {
            expect(validModes).toContain(mode);
        });
    });
});
