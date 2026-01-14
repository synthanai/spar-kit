/**
 * SPAR-Kit Unit Tests: Confidence Module
 */

import { describe, test, expect } from '@jest/globals';

import {
    calculateConfidence,
    CONFIDENCE_LEVELS,
    getConfidenceLabel
} from '../../cli/confidence.js';

describe('Confidence Module', () => {
    describe('CONFIDENCE_LEVELS', () => {
        test('defines low confidence', () => {
            expect(CONFIDENCE_LEVELS.LOW).toBeDefined();
            expect(CONFIDENCE_LEVELS.LOW.max).toBe(0.4);
        });

        test('defines medium confidence', () => {
            expect(CONFIDENCE_LEVELS.MEDIUM).toBeDefined();
        });

        test('defines high confidence', () => {
            expect(CONFIDENCE_LEVELS.HIGH).toBeDefined();
            expect(CONFIDENCE_LEVELS.HIGH.min).toBeGreaterThan(0.7);
        });
    });

    describe('calculateConfidence', () => {
        test('returns score between 0 and 1', () => {
            const result = calculateConfidence({
                agreement: 0.6,
                evidenceQuality: 0.7,
                timeConsistency: 0.8
            });

            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(1);
        });

        test('handles missing factors gracefully', () => {
            const result = calculateConfidence({});

            expect(result.score).toBeDefined();
            expect(typeof result.score).toBe('number');
        });
    });

    describe('getConfidenceLabel', () => {
        test('returns LOW for low scores', () => {
            const label = getConfidenceLabel(0.2);
            expect(label).toBe('LOW');
        });

        test('returns MEDIUM for medium scores', () => {
            const label = getConfidenceLabel(0.5);
            expect(label).toBe('MEDIUM');
        });

        test('returns HIGH for high scores', () => {
            const label = getConfidenceLabel(0.9);
            expect(label).toBe('HIGH');
        });
    });
});
