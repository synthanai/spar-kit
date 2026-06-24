/**
 * SPAR-Kit Security Tests
 * 
 * Tests for input validation and sanitization to prevent security vulnerabilities.
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
    validateSessionJson,
    validatePreset,
    validateAll
} from '../../cli/security/validation.js';

import {
    escapeHtml,
    sanitizeForTerminal,
    sanitizeForMarkdown,
    sanitizeForJson,
    sanitizeLLMResponse,
    maskSensitiveData,
    createSafeFilename,
    truncateSafely
} from '../../cli/security/sanitization.js';

// ============================================
// UUID VALIDATION TESTS
// ============================================

describe('UUID Validation', () => {
    test('accepts valid UUID v4', () => {
        const result = validateUUID('550e8400-e29b-41d4-a716-446655440000');
        expect(result.valid).toBe(true);
    });

    test('rejects invalid UUID format', () => {
        const result = validateUUID('not-a-uuid');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('UUID');
    });

    test('rejects empty UUID', () => {
        const result = validateUUID('');
        expect(result.valid).toBe(false);
    });

    test('rejects null UUID', () => {
        const result = validateUUID(null);
        expect(result.valid).toBe(false);
    });

    test('rejects UUID with wrong version', () => {
        // UUID v1 (not v4)
        const result = validateUUID('550e8400-e29b-11d4-a716-446655440000');
        expect(result.valid).toBe(false);
    });
});

// ============================================
// DECISION TEXT VALIDATION TESTS
// ============================================

describe('Decision Text Validation', () => {
    test('accepts valid decision text', () => {
        const result = validateDecision('Should we adopt microservices architecture?');
        expect(result.valid).toBe(true);
    });

    test('rejects too short decision', () => {
        const result = validateDecision('Hi');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('10 characters');
    });

    test('rejects too long decision', () => {
        const result = validateDecision('x'.repeat(2001));
        expect(result.valid).toBe(false);
        expect(result.error).toContain('2000 characters');
    });

    test('rejects XSS script tags', () => {
        const result = validateDecision('Hello <script>alert("xss")</script> world');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('invalid content');
    });

    test('rejects javascript: URLs', () => {
        const result = validateDecision('Click javascript:alert(1) for more');
        expect(result.valid).toBe(false);
    });

    test('rejects onclick handlers', () => {
        const result = validateDecision('Try onclick=alert(1) attack');
        expect(result.valid).toBe(false);
    });

    test('rejects iframe injection', () => {
        const result = validateDecision('Embedded <iframe src="evil.com"> here');
        expect(result.valid).toBe(false);
    });

    test('accepts text with HTML-like but safe content', () => {
        const result = validateDecision('Should we use <T> generics in TypeScript?');
        expect(result.valid).toBe(true);
    });
});

// ============================================
// PATH VALIDATION TESTS
// ============================================

describe('File Path Validation', () => {
    test('accepts valid relative path', () => {
        const result = validateFilePath('output/session.md');
        expect(result.valid).toBe(true);
    });

    test('accepts valid absolute path', () => {
        const result = validateFilePath('/home/user/output.md');
        expect(result.valid).toBe(true);
    });

    test('rejects path traversal with ../', () => {
        const result = validateFilePath('../../../etc/passwd');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('invalid');
    });

    test('rejects path traversal with encoded dots', () => {
        const result = validateFilePath('%2e%2e/etc/passwd');
        expect(result.valid).toBe(false);
    });

    test('rejects path with null bytes', () => {
        const result = validateFilePath('file\x00.txt');
        expect(result.valid).toBe(false);
    });

    test('rejects path with backslashes', () => {
        const result = validateFilePath('..\\..\\windows\\system32');
        expect(result.valid).toBe(false);
    });
});

// ============================================
// MODEL NAME VALIDATION TESTS
// ============================================

describe('Model Name Validation', () => {
    test('accepts valid ollama model', () => {
        expect(validateModelName('mistral:latest').valid).toBe(true);
    });

    test('accepts valid openai model', () => {
        expect(validateModelName('gpt-4-turbo').valid).toBe(true);
    });

    test('accepts model with version', () => {
        expect(validateModelName('deepseek-r1:7b').valid).toBe(true);
    });

    test('rejects model with special characters', () => {
        expect(validateModelName('model;rm -rf /').valid).toBe(false);
    });

    test('rejects model with spaces', () => {
        expect(validateModelName('my model').valid).toBe(false);
    });

    test('rejects too long model name', () => {
        expect(validateModelName('a'.repeat(101)).valid).toBe(false);
    });
});

// ============================================
// BASE URL VALIDATION TESTS
// ============================================

describe('Base URL Validation', () => {
    test('accepts localhost URL', () => {
        expect(validateBaseUrl('http://localhost:11434/api/chat').valid).toBe(true);
    });

    test('accepts 127.0.0.1 URL', () => {
        expect(validateBaseUrl('http://127.0.0.1:11434').valid).toBe(true);
    });

    test('accepts OpenAI API URL', () => {
        expect(validateBaseUrl('https://api.openai.com/v1').valid).toBe(true);
    });

    test('accepts Anthropic API URL', () => {
        expect(validateBaseUrl('https://api.anthropic.com/v1').valid).toBe(true);
    });

    test('rejects arbitrary external URL (SSRF prevention)', () => {
        expect(validateBaseUrl('https://evil.com/steal').valid).toBe(false);
    });

    test('rejects file:// protocol', () => {
        expect(validateBaseUrl('file:///etc/passwd').valid).toBe(false);
    });

    test('rejects malformed URL', () => {
        expect(validateBaseUrl('not-a-url').valid).toBe(false);
    });
});

// ============================================
// API KEY VALIDATION TESTS
// ============================================

describe('API Key Validation', () => {
    test('accepts valid OpenAI key format', () => {
        const result = validateApiKey('sk-' + 'a'.repeat(48), 'openai');
        expect(result.valid).toBe(true);
    });

    test('accepts valid Anthropic key format', () => {
        const result = validateApiKey('sk-ant-' + 'a'.repeat(48), 'anthropic');
        expect(result.valid).toBe(true);
    });

    test('allows null API key for Ollama', () => {
        const result = validateApiKey(null, 'ollama');
        expect(result.valid).toBe(true);
    });

    test('requires API key for OpenAI', () => {
        const result = validateApiKey(null, 'openai');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('required');
    });

    test('rejects wrong format for OpenAI', () => {
        const result = validateApiKey('wrong-format', 'openai');
        expect(result.valid).toBe(false);
    });
});

// ============================================
// SESSION JSON VALIDATION TESTS
// ============================================

describe('Session JSON Validation', () => {
    const validSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        version: '3.1.0',
        status: 'completed',
        decision: 'Should we refactor the legacy system?'
    };

    test('accepts valid session JSON', () => {
        expect(validateSessionJson(validSession).valid).toBe(true);
    });

    test('rejects session with missing ID', () => {
        const session = { ...validSession };
        delete session.id;
        expect(validateSessionJson(session).valid).toBe(false);
    });

    test('rejects session with invalid status', () => {
        const session = { ...validSession, status: 'invalid' };
        expect(validateSessionJson(session).valid).toBe(false);
    });

    test('rejects session with XSS in decision', () => {
        const session = { ...validSession, decision: '<script>alert(1)</script>' };
        expect(validateSessionJson(session).valid).toBe(false);
    });

    test('rejects non-object data', () => {
        expect(validateSessionJson('not an object').valid).toBe(false);
        expect(validateSessionJson(null).valid).toBe(false);
    });
});

// ============================================
// SANITIZATION TESTS
// ============================================

describe('HTML Escaping', () => {
    test('escapes script tags', () => {
        const result = escapeHtml('<script>alert("xss")</script>');
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;script&gt;');
    });

    test('escapes quotes', () => {
        const result = escapeHtml('Hello "world" & \'everyone\'');
        expect(result).toContain('&quot;');
        expect(result).toContain('&#x27;');
    });

    test('handles non-string input', () => {
        expect(escapeHtml(123)).toBe(123);
        expect(escapeHtml(null)).toBe(null);
    });
});

describe('Terminal Sanitization', () => {
    test('removes control characters', () => {
        const result = sanitizeForTerminal('Hello\x00\x07World');
        expect(result).toBe('HelloWorld');
    });

    test('preserves normal text', () => {
        const result = sanitizeForTerminal('Hello World!');
        expect(result).toBe('Hello World!');
    });

    test('preserves newlines and tabs', () => {
        const result = sanitizeForTerminal('Hello\nWorld\t!');
        expect(result).toBe('Hello\nWorld\t!');
    });
});

describe('LLM Response Sanitization', () => {
    test('removes role markers', () => {
        const result = sanitizeLLMResponse('system: You are helpful\nuser: Hello');
        expect(result).not.toMatch(/^(system|user):/gim);
    });

    test('removes injection code blocks', () => {
        const result = sanitizeLLMResponse('Normal text ```prompt injection here``` more text');
        expect(result).not.toContain('injection');
    });

    test('trims whitespace', () => {
        const result = sanitizeLLMResponse('  Hello World  ');
        expect(result).toBe('Hello World');
    });
});

describe('Sensitive Data Masking', () => {
    test('masks OpenAI API keys', () => {
        const result = maskSensitiveData('Key: sk-abcdefghijklmnop123456789');
        expect(result).toBe('Key: sk-****');
        expect(result).not.toContain('abcdefg');
    });

    test('masks Anthropic API keys', () => {
        const result = maskSensitiveData('Key: sk-ant-abcdefghijklmnop123456789');
        expect(result).toBe('Key: sk-ant-****');
    });

    test('masks Bearer tokens', () => {
        const result = maskSensitiveData('Authorization: Bearer abc123xyz');
        expect(result).toContain('Bearer ****');
    });

    test('masks email addresses', () => {
        const result = maskSensitiveData('Contact: user@example.com');
        expect(result).toContain('****@****');
        expect(result).not.toContain('example.com');
    });
});

describe('Safe Filename Creation', () => {
    test('converts spaces to underscores', () => {
        expect(createSafeFilename('Hello World')).toBe('hello_world');
    });

    test('removes special characters', () => {
        expect(createSafeFilename('File<>:"/\\|?*Name'))
            .not.toMatch(/[<>:"\/\\|?*]/);
    });

    test('truncates long names', () => {
        expect(createSafeFilename('a'.repeat(100), 50).length).toBeLessThanOrEqual(50);
    });

    test('handles empty input', () => {
        expect(createSafeFilename('')).toBe('untitled');
    });
});

describe('Safe Truncation', () => {
    test('truncates long strings', () => {
        const result = truncateSafely('Hello World', 8);
        expect(result).toBe('Hello...');
    });

    test('preserves short strings', () => {
        const result = truncateSafely('Hi', 10);
        expect(result).toBe('Hi');
    });

    test('handles unicode correctly', () => {
        const result = truncateSafely('Hello 👋 World', 9);
        expect(result.length).toBeLessThanOrEqual(9);
    });
});

// ============================================
// BATCH VALIDATION TESTS
// ============================================

describe('Batch Validation', () => {
    test('returns valid when all pass', () => {
        const result = validateAll({
            id: validateUUID('550e8400-e29b-41d4-a716-446655440000'),
            decision: validateDecision('Valid decision text here')
        });
        expect(result.valid).toBe(true);
    });

    test('returns first failure', () => {
        const result = validateAll({
            id: validateUUID('invalid'),
            decision: validateDecision('Valid decision text here')
        });
        expect(result.valid).toBe(false);
        expect(result.field).toBe('id');
    });
});
