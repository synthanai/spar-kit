/**
 * SPAR-Kit Unit Tests: Security Validation
 */

import { describe, test, expect } from '@jest/globals';

import {
    validateUUID,
    validateDecision,
    validatePersonaId,
    validateFilePath,
    validateModelName,
    validateBaseUrl,
    validateApiKey,
    validateSessionJson
} from '../../cli/security/validation.js';

describe('Security: Input Validation', () => {
    describe('validateUUID', () => {
        test('accepts valid UUID v4', () => {
            const result = validateUUID('550e8400-e29b-41d4-a716-446655440000');
            expect(result.valid).toBe(true);
        });

        test('rejects invalid UUID', () => {
            const result = validateUUID('not-a-uuid');
            expect(result.valid).toBe(false);
        });

        test('rejects empty string', () => {
            const result = validateUUID('');
            expect(result.valid).toBe(false);
        });

        test('rejects null/undefined', () => {
            expect(validateUUID(null).valid).toBe(false);
            expect(validateUUID(undefined).valid).toBe(false);
        });
    });

    describe('validateDecision', () => {
        test('accepts valid decision text', () => {
            const result = validateDecision('Should we expand to the Singapore market?');
            expect(result.valid).toBe(true);
        });

        test('rejects too short text', () => {
            const result = validateDecision('Yes');
            expect(result.valid).toBe(false);
        });

        test('rejects XSS script tags', () => {
            const result = validateDecision('<script>alert("xss")</script>');
            expect(result.valid).toBe(false);
        });

        test('rejects javascript: protocol', () => {
            const result = validateDecision('Check this: javascript:void(0)');
            expect(result.valid).toBe(false);
        });

        test('rejects event handlers', () => {
            const result = validateDecision('<div onclick="alert()">click</div>');
            expect(result.valid).toBe(false);
        });
    });

    describe('validatePersonaId', () => {
        test('accepts valid persona ID', () => {
            const result = validatePersonaId('p1_risk_watcher');
            expect(result.valid).toBe(true);
        });

        test('accepts alphanumeric with underscores', () => {
            const result = validatePersonaId('north');
            expect(result.valid).toBe(true);
        });

        test('rejects special characters', () => {
            const result = validatePersonaId('persona/../../../etc');
            expect(result.valid).toBe(false);
        });

        test('rejects too long IDs', () => {
            const longId = 'a'.repeat(100);
            const result = validatePersonaId(longId);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateFilePath', () => {
        test('accepts valid path', () => {
            const result = validateFilePath('/home/user/exports/report.md');
            expect(result.valid).toBe(true);
        });

        test('rejects path traversal', () => {
            const result = validateFilePath('../../../etc/passwd');
            expect(result.valid).toBe(false);
        });

        test('rejects encoded path traversal', () => {
            const result = validateFilePath('%2e%2e/etc/passwd');
            expect(result.valid).toBe(false);
        });

        test('rejects null bytes', () => {
            const result = validateFilePath('file.txt\0.jpg');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateModelName', () => {
        test('accepts valid model names', () => {
            expect(validateModelName('llama3.2').valid).toBe(true);
            expect(validateModelName('gpt-4-turbo').valid).toBe(true);
            expect(validateModelName('claude-3-sonnet-20240229').valid).toBe(true);
        });

        test('rejects invalid characters', () => {
            const result = validateModelName('model<script>');
            expect(result.valid).toBe(false);
        });

        test('rejects too long names', () => {
            const longName = 'a'.repeat(200);
            const result = validateModelName(longName);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateBaseUrl', () => {
        test('accepts localhost', () => {
            const result = validateBaseUrl('http://localhost:11434');
            expect(result.valid).toBe(true);
        });

        test('accepts OpenAI API', () => {
            const result = validateBaseUrl('https://api.openai.com');
            expect(result.valid).toBe(true);
        });

        test('accepts Anthropic API', () => {
            const result = validateBaseUrl('https://api.anthropic.com');
            expect(result.valid).toBe(true);
        });

        test('rejects non-whitelisted URLs', () => {
            const result = validateBaseUrl('https://evil.com/api');
            expect(result.valid).toBe(false);
        });

        test('rejects internal IP ranges', () => {
            const result = validateBaseUrl('http://192.168.1.1:8080');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateApiKey', () => {
        test('allows null for ollama', () => {
            const result = validateApiKey(null, 'ollama');
            expect(result.valid).toBe(true);
        });

        test('requires key for openai', () => {
            const result = validateApiKey(null, 'openai');
            expect(result.valid).toBe(false);
        });

        test('validates openai key format', () => {
            // Valid format
            const valid = validateApiKey('sk-' + 'a'.repeat(48), 'openai');
            expect(valid.valid).toBe(true);

            // Invalid format
            const invalid = validateApiKey('invalid-key', 'openai');
            expect(invalid.valid).toBe(false);
        });
    });

    describe('validateSessionJson', () => {
        const validSession = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            version: '1.0.0',
            status: 'completed',
            decision: 'Should we expand to the Singapore market?'
        };

        test('accepts valid session', () => {
            const result = validateSessionJson(validSession);
            expect(result.valid).toBe(true);
        });

        test('rejects missing required fields', () => {
            const noId = { ...validSession };
            delete noId.id;
            expect(validateSessionJson(noId).valid).toBe(false);
        });

        test('rejects invalid status', () => {
            const badStatus = { ...validSession, status: 'invalid' };
            expect(validateSessionJson(badStatus).valid).toBe(false);
        });

        test('rejects non-object input', () => {
            expect(validateSessionJson(null).valid).toBe(false);
            expect(validateSessionJson('string').valid).toBe(false);
        });
    });
});
