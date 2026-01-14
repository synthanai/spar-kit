/**
 * SPAR-Kit Unit Tests: Bias Detection Module
 */

import { describe, test, expect } from '@jest/globals';

import {
    BiasCategories,
    detectBiases,
    analyzePersonaDiversity,
    getMitigationSuggestions
} from '../../cli/bias.js';

describe('Bias Detection Module', () => {
    describe('BiasCategories', () => {
        test('defines confirmation bias', () => {
            expect(BiasCategories.CONFIRMATION).toBeDefined();
            expect(BiasCategories.CONFIRMATION.name).toBe('Confirmation Bias');
        });

        test('defines anchoring bias', () => {
            expect(BiasCategories.ANCHORING).toBeDefined();
        });

        test('defines availability bias', () => {
            expect(BiasCategories.AVAILABILITY).toBeDefined();
        });

        test('has 9 bias categories', () => {
            expect(Object.keys(BiasCategories).length).toBe(9);
        });
    });

    describe('detectBiases', () => {
        test('detects confirmation bias patterns', () => {
            const content = 'This confirms our previous assumption that we were right all along.';
            const result = detectBiases(content);

            expect(result.hasBias).toBe(true);
            expect(result.biases.some(b => b.type === 'confirmation')).toBe(true);
        });

        test('returns score between 0 and 1', () => {
            const result = detectBiases('Some neutral content');

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1);
        });

        test('handles empty content', () => {
            const result = detectBiases('');

            expect(result.biases).toEqual([]);
            expect(result.hasBias).toBe(false);
        });

        test('detects groupthink patterns', () => {
            const content = 'Everyone agrees this is the best approach.';
            const result = detectBiases(content);

            expect(result.biases.some(b => b.type === 'groupthink')).toBe(true);
        });
    });

    describe('analyzePersonaDiversity', () => {
        test('flags low diversity with similar personas', () => {
            const personas = ['optimist', 'enthusiast', 'believer'];
            const result = analyzePersonaDiversity(personas);

            expect(result.diverse).toBe(false);
        });

        test('confirms diversity with mixed personas', () => {
            const personas = ['optimist', 'skeptic', 'pragmatist', 'visionary'];
            const result = analyzePersonaDiversity(personas);

            expect(result.diverse).toBe(true);
        });
    });

    describe('getMitigationSuggestions', () => {
        test('returns suggestions for detected biases', () => {
            const biases = [{ type: 'confirmation' }, { type: 'anchoring' }];
            const suggestions = getMitigationSuggestions(biases);

            expect(Array.isArray(suggestions)).toBe(true);
            expect(suggestions.length).toBeGreaterThan(0);
        });

        test('returns empty for no biases', () => {
            const suggestions = getMitigationSuggestions([]);

            expect(suggestions).toEqual([]);
        });
    });
});
