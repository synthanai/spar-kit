/**
 * SPAR-Kit: Template System
 * 
 * Manages reusable debate templates for the no-code builder.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { v4 as uuidv4 } from 'uuid';

const SPAR_DIR = join(homedir(), '.spar');
const TEMPLATES_DIR = join(SPAR_DIR, 'templates');

// Ensure directories exist
function ensureDirectories() {
    if (!existsSync(SPAR_DIR)) mkdirSync(SPAR_DIR, { recursive: true });
    if (!existsSync(TEMPLATES_DIR)) mkdirSync(TEMPLATES_DIR, { recursive: true });
}

/**
 * Built-in templates (always available)
 */
export const BUILTIN_TEMPLATES = {
    'startup-pivot': {
        id: 'startup-pivot',
        name: 'Startup Pivot Decision',
        description: 'Evaluate major strategic pivots for your startup',
        icon: '🚀',
        builtin: true,
        decisionTemplate: 'Should we pivot from {current} to {new_direction}?',
        variables: [
            { name: 'current', label: 'Current Focus', placeholder: 'e.g., B2B SaaS' },
            { name: 'new_direction', label: 'New Direction', placeholder: 'e.g., B2C marketplace' }
        ],
        preset: 'startup',
        rules: {
            rounds: 2,
            style: 'constructive',
            patterns: ['pre_mortem']
        }
    },
    'hiring-decision': {
        id: 'hiring-decision',
        name: 'Hiring Decision',
        description: 'Should you hire this candidate?',
        icon: '👥',
        builtin: true,
        decisionTemplate: 'Should we hire {candidate_name} for the {role} position?',
        variables: [
            { name: 'candidate_name', label: 'Candidate', placeholder: 'e.g., Jane Doe' },
            { name: 'role', label: 'Role', placeholder: 'e.g., Senior Engineer' }
        ],
        preset: 'corporate',
        rules: {
            rounds: 2,
            style: 'constructive',
            patterns: ['steelman', 'absent_voice']
        }
    },
    'investment-eval': {
        id: 'investment-eval',
        name: 'Investment Evaluation',
        description: 'Evaluate a potential investment opportunity',
        icon: '💰',
        builtin: true,
        decisionTemplate: 'Should we invest {amount} in {company_or_asset}?',
        variables: [
            { name: 'amount', label: 'Amount', placeholder: 'e.g., $50,000' },
            { name: 'company_or_asset', label: 'Investment', placeholder: 'e.g., Series A of XYZ Corp' }
        ],
        preset: 'corporate',
        rules: {
            rounds: 3,
            style: 'adversarial',
            patterns: ['pre_mortem', 'inversion']
        }
    },
    'product-launch': {
        id: 'product-launch',
        name: 'Product Launch Readiness',
        description: 'Is the product ready for launch?',
        icon: '🎯',
        builtin: true,
        decisionTemplate: 'Should we launch {product} on {date}?',
        variables: [
            { name: 'product', label: 'Product', placeholder: 'e.g., Mobile App v2.0' },
            { name: 'date', label: 'Target Date', placeholder: 'e.g., March 15th' }
        ],
        preset: 'innovation',
        rules: {
            rounds: 2,
            style: 'constructive',
            patterns: ['pre_mortem']
        }
    },
    'crisis-response': {
        id: 'crisis-response',
        name: 'Crisis Response',
        description: 'How should we respond to this crisis?',
        icon: '🚨',
        builtin: true,
        decisionTemplate: 'How should we respond to {crisis_situation}?',
        variables: [
            { name: 'crisis_situation', label: 'Crisis', placeholder: 'e.g., data breach affecting 10k users' }
        ],
        preset: 'crisis',
        rules: {
            rounds: 1,
            style: 'constructive',
            patterns: ['absent_voice', 'escalation_trigger']
        }
    },
    'ethics-dilemma': {
        id: 'ethics-dilemma',
        name: 'Ethics Dilemma',
        description: 'Navigate a complex ethical situation',
        icon: '⚖️',
        builtin: true,
        decisionTemplate: 'Is it ethical to {proposed_action} given {context}?',
        variables: [
            { name: 'proposed_action', label: 'Proposed Action', placeholder: 'e.g., use customer data for AI training' },
            { name: 'context', label: 'Context', placeholder: 'e.g., users gave general consent' }
        ],
        preset: 'ethics',
        rules: {
            rounds: 3,
            style: 'friendly',
            patterns: ['absent_voice', 'steelman', 'inversion']
        }
    }
};

/**
 * Load all templates (builtin + user)
 */
export function loadTemplates() {
    ensureDirectories();

    const templates = { ...BUILTIN_TEMPLATES };

    try {
        const files = readdirSync(TEMPLATES_DIR);
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const content = readFileSync(join(TEMPLATES_DIR, file), 'utf-8');
                    const template = JSON.parse(content);
                    template.builtin = false;
                    templates[template.id] = template;
                } catch (e) {
                    console.error(`Failed to load template: ${file}`, e.message);
                }
            }
        }
    } catch (e) {
        console.error('Failed to read templates directory:', e.message);
    }

    return templates;
}

/**
 * Get a single template by ID
 */
export function getTemplate(id) {
    const templates = loadTemplates();
    return templates[id] || null;
}

/**
 * Save a user template
 */
export function saveTemplate(template) {
    ensureDirectories();

    if (!template.id) {
        template.id = uuidv4();
    }

    template.builtin = false;
    template.createdAt = template.createdAt || new Date().toISOString();
    template.updatedAt = new Date().toISOString();

    const filename = `${template.id}.json`;

    try {
        writeFileSync(
            join(TEMPLATES_DIR, filename),
            JSON.stringify(template, null, 2),
            'utf-8'
        );
        return template;
    } catch (e) {
        console.error('Failed to save template:', e.message);
        return null;
    }
}

/**
 * Delete a user template
 */
export function deleteTemplate(id) {
    // Can't delete builtin templates
    if (BUILTIN_TEMPLATES[id]) {
        return false;
    }

    const filename = `${id}.json`;
    const filepath = join(TEMPLATES_DIR, filename);

    if (existsSync(filepath)) {
        try {
            unlinkSync(filepath);
            return true;
        } catch (e) {
            console.error('Failed to delete template:', e.message);
        }
    }

    return false;
}

/**
 * Create template from debate config
 */
export function createTemplateFromDebate(debate, name, description) {
    // Extract variable placeholders from decision
    const variableRegex = /\{([^}]+)\}/g;
    const variables = [];
    let match;

    while ((match = variableRegex.exec(debate.decision)) !== null) {
        variables.push({
            name: match[1],
            label: match[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            placeholder: ''
        });
    }

    return saveTemplate({
        name,
        description,
        icon: '📋',
        decisionTemplate: debate.decision,
        variables,
        preset: debate.preset,
        customPersonas: debate.customPersonas || [],
        rules: debate.rules,
        config: {
            provider: debate.config.provider
        }
    });
}

/**
 * Apply template to create debate config
 */
export function applyTemplate(template, variableValues = {}) {
    let decision = template.decisionTemplate;

    // Replace variables
    for (const [name, value] of Object.entries(variableValues)) {
        decision = decision.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
    }

    return {
        decision,
        preset: template.preset,
        customPersonas: template.customPersonas || [],
        rules: { ...template.rules },
        config: { ...template.config }
    };
}

/**
 * List templates for display
 */
export function listTemplates() {
    const templates = loadTemplates();

    return Object.values(templates).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        icon: t.icon,
        builtin: t.builtin,
        preset: t.preset,
        variableCount: t.variables?.length || 0
    }));
}

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory() {
    const templates = listTemplates();

    return {
        builtin: templates.filter(t => t.builtin),
        user: templates.filter(t => !t.builtin)
    };
}

export default {
    BUILTIN_TEMPLATES,
    loadTemplates,
    getTemplate,
    saveTemplate,
    deleteTemplate,
    createTemplateFromDebate,
    applyTemplate,
    listTemplates,
    getTemplatesByCategory
};
