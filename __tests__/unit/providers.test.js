/**
 * SPAR-Kit Unit Tests: Provider Module
 */

import { describe, test, expect, jest, beforeEach } from '@jest/globals';

import {
    REASONING_MODES,
    REASONING_TIERS,
    PROVIDERS,
    getAvailableProviders,
    extractThinkingBlocks
} from '../../cli/providers.js';

describe('Provider Module', () => {
    describe('REASONING_MODES', () => {
        test('defines standard mode', () => {
            expect(REASONING_MODES.standard).toBeDefined();
            expect(REASONING_MODES.standard.name).toBe('Standard');
            expect(REASONING_MODES.standard.thinkingEnabled).toBe(false);
        });

        test('defines ultrathink mode', () => {
            expect(REASONING_MODES.ultrathink).toBeDefined();
            expect(REASONING_MODES.ultrathink.name).toBe('Ultrathink');
            expect(REASONING_MODES.ultrathink.thinkingEnabled).toBe(true);
        });

        test('defines maximum mode', () => {
            expect(REASONING_MODES.maximum).toBeDefined();
            expect(REASONING_MODES.maximum.name).toBe('Maximum');
            expect(REASONING_MODES.maximum.thinkingEnabled).toBe(true);
        });

        test('REASONING_TIERS alias exists', () => {
            expect(REASONING_TIERS).toBe(REASONING_MODES);
        });
    });

    describe('PROVIDERS', () => {
        test('defines ollama provider', () => {
            expect(PROVIDERS.ollama).toBeDefined();
            expect(PROVIDERS.ollama.name).toBe('Ollama (Local)');
            expect(PROVIDERS.ollama.requiresKey).toBe(false);
        });

        test('defines openai provider', () => {
            expect(PROVIDERS.openai).toBeDefined();
            expect(PROVIDERS.openai.requiresKey).toBe(true);
        });

        test('defines anthropic provider', () => {
            expect(PROVIDERS.anthropic).toBeDefined();
            expect(PROVIDERS.anthropic.requiresKey).toBe(true);
        });

        test('defines gemini provider', () => {
            expect(PROVIDERS.gemini).toBeDefined();
            expect(PROVIDERS.gemini.requiresKey).toBe(true);
        });

        test('defines openai_compatible provider', () => {
            expect(PROVIDERS.openai_compatible).toBeDefined();
            expect(PROVIDERS.openai_compatible.customEndpoint).toBe(true);
        });
    });

    describe('getAvailableProviders', () => {
        test('returns array of providers', () => {
            const providers = getAvailableProviders();
            expect(Array.isArray(providers)).toBe(true);
            expect(providers.length).toBeGreaterThan(0);
        });

        test('each provider has required fields', () => {
            const providers = getAvailableProviders();
            providers.forEach(provider => {
                expect(provider.key).toBeDefined();
                expect(provider.name).toBeDefined();
                expect(typeof provider.requiresKey).toBe('boolean');
            });
        });
    });

    describe('extractThinkingBlocks', () => {
        test('extracts thinking from <think> blocks', () => {
            const content = '<think>This is my reasoning process</think>The final answer.';
            const result = extractThinkingBlocks(content);

            expect(result.thinking).toBe('This is my reasoning process');
            expect(result.response).toBe('The final answer.');
        });

        test('handles multiple thinking blocks', () => {
            const content = '<think>First thought</think>Middle<think>Second thought</think>End.';
            const result = extractThinkingBlocks(content);

            expect(result.thinking).toContain('First thought');
            expect(result.thinking).toContain('Second thought');
        });

        test('returns null thinking when no blocks present', () => {
            const content = 'Just a regular response without thinking.';
            const result = extractThinkingBlocks(content);

            expect(result.thinking).toBeNull();
            expect(result.response).toBe(content);
        });

        test('handles empty content', () => {
            const result = extractThinkingBlocks('');

            expect(result.thinking).toBeNull();
            expect(result.response).toBe('');
        });
    });
});
