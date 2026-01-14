/**
 * SPAR-Kit Unit Tests: Template System
 * 
 * Tests for template storage and operations.
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import {
    BUILTIN_TEMPLATES,
    loadTemplates,
    getTemplate,
    saveTemplate,
    deleteTemplate,
    applyTemplate,
    listTemplates,
    getTemplatesByCategory,
    createTemplateFromDebate
} from '../../cli/tui/store/templates.js';

// Mock fs module
jest.mock('fs', () => ({
    existsSync: jest.fn(() => true),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(() => '{}'),
    writeFileSync: jest.fn(),
    readdirSync: jest.fn(() => []),
    unlinkSync: jest.fn()
}));

// ============================================
// BUILTIN TEMPLATES TESTS
// ============================================

describe('Built-in Templates', () => {
    test('has at least 5 built-in templates', () => {
        expect(Object.keys(BUILTIN_TEMPLATES).length).toBeGreaterThanOrEqual(5);
    });

    test('each template has required fields', () => {
        for (const [id, template] of Object.entries(BUILTIN_TEMPLATES)) {
            expect(template.id).toBe(id);
            expect(template.name).toBeDefined();
            expect(template.description).toBeDefined();
            expect(template.decisionTemplate).toBeDefined();
            expect(template.preset).toBeDefined();
            expect(template.builtin).toBe(true);
        }
    });

    test('startup-pivot template exists', () => {
        expect(BUILTIN_TEMPLATES['startup-pivot']).toBeDefined();
        expect(BUILTIN_TEMPLATES['startup-pivot'].name).toBe('Startup Pivot Decision');
    });

    test('hiring-decision template exists', () => {
        expect(BUILTIN_TEMPLATES['hiring-decision']).toBeDefined();
    });

    test('crisis-response template exists', () => {
        expect(BUILTIN_TEMPLATES['crisis-response']).toBeDefined();
    });

    test('templates have valid presets', () => {
        const validPresets = ['startup', 'corporate', 'crisis', 'innovation', 'ethics'];
        for (const template of Object.values(BUILTIN_TEMPLATES)) {
            expect(validPresets).toContain(template.preset);
        }
    });

    test('templates have valid rules', () => {
        for (const template of Object.values(BUILTIN_TEMPLATES)) {
            expect(template.rules).toBeDefined();
            expect(template.rules.rounds).toBeGreaterThanOrEqual(1);
            expect(template.rules.rounds).toBeLessThanOrEqual(3);
            expect(['friendly', 'constructive', 'adversarial']).toContain(template.rules.style);
        }
    });
});

// ============================================
// TEMPLATE VARIABLE TESTS
// ============================================

describe('Template Variables', () => {
    test('startup-pivot has correct variables', () => {
        const template = BUILTIN_TEMPLATES['startup-pivot'];
        expect(template.variables).toHaveLength(2);
        expect(template.variables[0].name).toBe('current');
        expect(template.variables[1].name).toBe('new_direction');
    });

    test('hiring-decision has correct variables', () => {
        const template = BUILTIN_TEMPLATES['hiring-decision'];
        expect(template.variables).toHaveLength(2);
        expect(template.variables[0].name).toBe('candidate_name');
        expect(template.variables[1].name).toBe('role');
    });

    test('variables match placeholders in decisionTemplate', () => {
        for (const template of Object.values(BUILTIN_TEMPLATES)) {
            const placeholders = template.decisionTemplate.match(/\{([^}]+)\}/g) || [];
            const expectedCount = placeholders.length;
            expect(template.variables?.length || 0).toBe(expectedCount);
        }
    });
});

// ============================================
// APPLY TEMPLATE TESTS
// ============================================

describe('Apply Template', () => {
    test('replaces single variable', () => {
        const template = BUILTIN_TEMPLATES['crisis-response'];
        const result = applyTemplate(template, {
            crisis_situation: 'data breach'
        });

        expect(result.decision).toBe('How should we respond to data breach?');
        expect(result.preset).toBe('crisis');
    });

    test('replaces multiple variables', () => {
        const template = BUILTIN_TEMPLATES['startup-pivot'];
        const result = applyTemplate(template, {
            current: 'B2B SaaS',
            new_direction: 'B2C marketplace'
        });

        expect(result.decision).toBe('Should we pivot from B2B SaaS to B2C marketplace?');
    });

    test('preserves rules from template', () => {
        const template = BUILTIN_TEMPLATES['investment-eval'];
        const result = applyTemplate(template, {
            amount: '$100k',
            company_or_asset: 'XYZ Corp'
        });

        expect(result.rules.rounds).toBe(3);
        expect(result.rules.style).toBe('adversarial');
    });

    test('handles empty variables gracefully', () => {
        const template = BUILTIN_TEMPLATES['startup-pivot'];
        const result = applyTemplate(template, {});

        // Variables should remain as placeholders
        expect(result.decision).toContain('{current}');
        expect(result.decision).toContain('{new_direction}');
    });
});

// ============================================
// LIST TEMPLATES TESTS
// ============================================

describe('List Templates', () => {
    test('returns array of template summaries', () => {
        const list = listTemplates();

        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThan(0);
    });

    test('summaries have required fields', () => {
        const list = listTemplates();

        for (const summary of list) {
            expect(summary.id).toBeDefined();
            expect(summary.name).toBeDefined();
            expect(summary.description).toBeDefined();
            expect(summary.preset).toBeDefined();
            expect(typeof summary.builtin).toBe('boolean');
            expect(typeof summary.variableCount).toBe('number');
        }
    });

    test('getTemplatesByCategory separates builtin and user', () => {
        const categories = getTemplatesByCategory();

        expect(categories.builtin).toBeDefined();
        expect(categories.user).toBeDefined();
        expect(Array.isArray(categories.builtin)).toBe(true);
        expect(Array.isArray(categories.user)).toBe(true);
    });

    test('builtin templates are in builtin category', () => {
        const categories = getTemplatesByCategory();

        expect(categories.builtin.length).toBeGreaterThan(0);
        for (const template of categories.builtin) {
            expect(template.builtin).toBe(true);
        }
    });
});

// ============================================
// GET TEMPLATE TESTS
// ============================================

describe('Get Template', () => {
    test('returns builtin template by ID', () => {
        const template = getTemplate('startup-pivot');

        expect(template).toBeDefined();
        expect(template.id).toBe('startup-pivot');
        expect(template.builtin).toBe(true);
    });

    test('returns null for non-existent template', () => {
        const template = getTemplate('non-existent-template');

        expect(template).toBeNull();
    });
});

// ============================================
// SAVE TEMPLATE TESTS
// ============================================

describe('Save Template', () => {
    test('generates UUID if not provided', () => {
        const template = saveTemplate({
            name: 'Test Template',
            description: 'A test template',
            decisionTemplate: 'Should we {action}?',
            preset: 'innovation',
            rules: { rounds: 2, style: 'constructive', patterns: [] }
        });

        expect(template.id).toBeDefined();
        expect(template.id.length).toBeGreaterThan(0);
    });

    test('sets builtin to false', () => {
        const template = saveTemplate({
            id: 'test-id',
            name: 'Test',
            description: 'Test',
            decisionTemplate: 'Test?',
            preset: 'startup',
            rules: { rounds: 1, style: 'friendly', patterns: [] }
        });

        expect(template.builtin).toBe(false);
    });

    test('sets creation timestamps', () => {
        const template = saveTemplate({
            name: 'Test',
            description: 'Test',
            decisionTemplate: 'Test?',
            preset: 'ethics',
            rules: { rounds: 2, style: 'constructive', patterns: [] }
        });

        expect(template.createdAt).toBeDefined();
        expect(template.updatedAt).toBeDefined();
    });
});

// ============================================
// DELETE TEMPLATE TESTS
// ============================================

describe('Delete Template', () => {
    test('cannot delete builtin templates', () => {
        const result = deleteTemplate('startup-pivot');

        expect(result).toBe(false);
    });

    test('returns false for non-existent template', () => {
        const result = deleteTemplate('non-existent');

        expect(result).toBe(false);
    });
});

// ============================================
// CREATE FROM DEBATE TESTS
// ============================================

describe('Create Template From Debate', () => {
    test('extracts variables from decision', () => {
        const debate = {
            decision: 'Should we hire {name} for {position}?',
            preset: 'corporate',
            rules: { rounds: 2, style: 'constructive', patterns: [] },
            config: { provider: 'ollama' }
        };

        const template = createTemplateFromDebate(debate, 'Hiring Template', 'For hiring decisions');

        expect(template.variables).toHaveLength(2);
        expect(template.variables[0].name).toBe('name');
        expect(template.variables[1].name).toBe('position');
    });

    test('preserves debate configuration', () => {
        const debate = {
            decision: 'Should we {action}?',
            preset: 'ethics',
            rules: { rounds: 3, style: 'friendly', patterns: ['steelman'] },
            config: { provider: 'openai' }
        };

        const template = createTemplateFromDebate(debate, 'Ethics Template', 'For ethics decisions');

        expect(template.preset).toBe('ethics');
        expect(template.rules.rounds).toBe(3);
        expect(template.config.provider).toBe('openai');
    });
});
