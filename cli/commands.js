/**
 * SPAR-Kit CLI: TUI Integration
 * 
 * Extends the main CLI with TUI launcher and template commands.
 */

import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import {
    loadTemplates,
    listTemplates,
    getTemplate,
    saveTemplate,
    deleteTemplate,
    applyTemplate,
    getTemplatesByCategory,
    BUILTIN_TEMPLATES
} from './tui/store/templates.js';
import {
    ARENAS,
    getArena,
    listArenas,
    getCategories,
    getContextualPrompts
} from './arena.js';

const SPAR_DIR = join(homedir(), '.spar');
const CONFIG_PATH = join(SPAR_DIR, 'config.json');

// ============================================
// TUI LAUNCHER
// ============================================

/**
 * Launch the interactive TUI
 */
export async function launchTUI(options = {}) {
    try {
        // Dynamic import to avoid loading React for non-TUI commands
        const { launchTUI: runTUI } = await import('./tui/index.js');
        await runTUI();
    } catch (error) {
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
            console.log(chalk.yellow(`
⚠️  TUI dependencies not installed.

Run: npm install

Or use the classic CLI:
  sparkit debate start "Your decision"
`));
        } else {
            console.error(chalk.red('Error launching TUI:'), error.message);
        }
        process.exit(1);
    }
}

// ============================================
// TEMPLATE COMMANDS
// ============================================

/**
 * List all templates
 */
export function templateList() {
    console.log(chalk.bold.cyan('\n📚 SPAR Templates\n'));

    const { builtin, user } = getTemplatesByCategory();

    console.log(chalk.bold('Built-in Templates:\n'));
    if (builtin.length === 0) {
        console.log(chalk.gray('  No built-in templates found.\n'));
    } else {
        builtin.forEach(t => {
            console.log(`  ${t.icon} ${chalk.bold(t.name)}`);
            console.log(chalk.gray(`     ${t.description}`));
            console.log(chalk.magenta(`     Preset: ${t.preset} | Variables: ${t.variableCount}\n`));
        });
    }

    console.log(chalk.bold('Your Templates:\n'));
    if (user.length === 0) {
        console.log(chalk.gray('  No custom templates yet.'));
        console.log(chalk.gray('  Create one with: sparkit template create\n'));
    } else {
        user.forEach(t => {
            console.log(`  ${t.icon || '📋'} ${chalk.bold(t.name)} (${t.id})`);
            console.log(chalk.gray(`     ${t.description}\n`));
        });
    }
}

/**
 * Show template details
 */
export function templateShow(templateId) {
    const template = getTemplate(templateId);

    if (!template) {
        console.log(chalk.red(`\n❌ Template not found: ${templateId}`));
        console.log(chalk.gray('\nUse "sparkit template list" to see available templates.\n'));
        return;
    }

    console.log(chalk.bold.cyan(`\n${template.icon || '📋'} ${template.name}\n`));
    console.log(chalk.gray('Description:'));
    console.log(`  ${template.description}\n`);

    console.log(chalk.gray('Decision Template:'));
    console.log(chalk.white(`  "${template.decisionTemplate}"\n`));

    if (template.variables?.length > 0) {
        console.log(chalk.gray('Variables:'));
        template.variables.forEach(v => {
            console.log(`  • {${v.name}} — ${v.label}`);
            if (v.placeholder) console.log(chalk.gray(`    e.g., "${v.placeholder}"`));
        });
        console.log('');
    }

    console.log(chalk.gray('Configuration:'));
    console.log(`  Preset: ${chalk.magenta(template.preset)}`);
    console.log(`  Rounds: ${template.rules?.rounds || 2}`);
    console.log(`  Style: ${template.rules?.style || 'constructive'}`);

    if (template.rules?.patterns?.length > 0) {
        console.log(`  ASPIRES: ${template.rules.patterns.join(', ')}`);
    }

    console.log('');

    if (template.builtin) {
        console.log(chalk.gray('ℹ️  This is a built-in template.\n'));
    } else {
        console.log(chalk.gray(`ID: ${template.id}`));
        console.log(chalk.gray(`Created: ${template.createdAt || 'Unknown'}\n`));
    }
}

/**
 * Use a template interactively
 */
export async function templateUse(templateId, options = {}) {
    const template = getTemplate(templateId);

    if (!template) {
        console.log(chalk.red(`\n❌ Template not found: ${templateId}`));
        return;
    }

    console.log(chalk.bold.cyan(`\n📋 Using template: ${template.name}\n`));

    const inquirer = (await import('inquirer')).default;
    const variableValues = {};

    // Collect variable values
    if (template.variables?.length > 0) {
        console.log(chalk.gray('Fill in the template variables:\n'));

        for (const variable of template.variables) {
            const { value } = await inquirer.prompt([{
                type: 'input',
                name: 'value',
                message: variable.label + ':',
                default: options[variable.name] || variable.placeholder || ''
            }]);
            variableValues[variable.name] = value;
        }
    }

    // Apply template
    const debate = applyTemplate(template, variableValues);

    console.log(chalk.green('\n✓ Generated decision:\n'));
    console.log(chalk.white(`  "${debate.decision}"\n`));

    const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Start debate with this decision?',
        default: true
    }]);

    if (proceed) {
        // Import and run debate
        const { debateStart } = await import('./index.js');
        await debateStart(debate.decision, { preset: debate.preset });
    }
}

/**
 * Create a new template interactively
 */
export async function templateCreate() {
    const inquirer = (await import('inquirer')).default;

    console.log(chalk.bold.cyan('\n🛠️  Create New Template\n'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Template name:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description:',
            validate: i => i.length > 0 || 'Required'
        },
        {
            type: 'input',
            name: 'icon',
            message: 'Icon emoji:',
            default: '📋'
        },
        {
            type: 'input',
            name: 'decisionTemplate',
            message: 'Decision template (use {variable} for placeholders):',
            validate: i => i.length > 10 || 'Must be at least 10 characters'
        },
        {
            type: 'list',
            name: 'preset',
            message: 'Persona preset:',
            choices: [
                { name: '🚀 Startup', value: 'startup' },
                { name: '💼 Corporate', value: 'corporate' },
                { name: '⚠️  Crisis', value: 'crisis' },
                { name: '🎨 Innovation', value: 'innovation' },
                { name: '⚖️  Ethics', value: 'ethics' }
            ]
        },
        {
            type: 'list',
            name: 'rounds',
            message: 'Default rounds:',
            choices: [
                { name: '⚡ Quick (1 round)', value: 1 },
                { name: '⚔️  Standard (2 rounds)', value: 2 },
                { name: '🔥 Deep (3 rounds)', value: 3 }
            ],
            default: 1
        },
        {
            type: 'list',
            name: 'style',
            message: 'Debate style:',
            choices: [
                { name: '🤝 Friendly', value: 'friendly' },
                { name: '💬 Constructive', value: 'constructive' },
                { name: '⚔️  Adversarial', value: 'adversarial' }
            ],
            default: 1
        }
    ]);

    // Extract variables from decision template
    const variableRegex = /\{([^}]+)\}/g;
    const variables = [];
    let match;

    while ((match = variableRegex.exec(answers.decisionTemplate)) !== null) {
        const varName = match[1];
        const { label, placeholder } = await inquirer.prompt([
            {
                type: 'input',
                name: 'label',
                message: `Label for {${varName}}:`,
                default: varName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            },
            {
                type: 'input',
                name: 'placeholder',
                message: `Example value for {${varName}}:`,
                default: ''
            }
        ]);

        variables.push({ name: varName, label, placeholder });
    }

    // Save template
    const template = saveTemplate({
        name: answers.name,
        description: answers.description,
        icon: answers.icon,
        decisionTemplate: answers.decisionTemplate,
        variables,
        preset: answers.preset,
        rules: {
            rounds: answers.rounds,
            style: answers.style,
            patterns: []
        }
    });

    if (template) {
        console.log(chalk.green(`\n✓ Template "${answers.name}" created!`));
        console.log(chalk.gray(`  ID: ${template.id}`));
        console.log(chalk.gray(`  Use: sparkit template use ${template.id}\n`));
    } else {
        console.log(chalk.red('\n❌ Failed to create template.\n'));
    }
}

/**
 * Delete a template
 */
export async function templateDelete(templateId) {
    const template = getTemplate(templateId);

    if (!template) {
        console.log(chalk.red(`\n❌ Template not found: ${templateId}\n`));
        return;
    }

    if (template.builtin) {
        console.log(chalk.red('\n❌ Cannot delete built-in templates.\n'));
        return;
    }

    const inquirer = (await import('inquirer')).default;

    const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Delete template "${template.name}"?`,
        default: false
    }]);

    if (confirm) {
        if (deleteTemplate(templateId)) {
            console.log(chalk.green(`\n✓ Template deleted.\n`));
        } else {
            console.log(chalk.red('\n❌ Failed to delete template.\n'));
        }
    }
}

// ============================================
// SESSION COMMANDS (Non-Interactive)
// ============================================

/**
 * List sessions (for scripting)
 */
export async function sessionList(options = {}) {
    const { format = 'table', limit = 20, status } = options;

    const SESSIONS_DIR = join(homedir(), '.spar', 'sessions');
    const { readdirSync } = await import('fs');

    if (!existsSync(SESSIONS_DIR)) {
        console.log(chalk.gray('No sessions found.'));
        return;
    }

    let sessions = readdirSync(SESSIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .sort().reverse()
        .slice(0, limit)
        .map(f => {
            try {
                return { filename: f, ...JSON.parse(readFileSync(join(SESSIONS_DIR, f), 'utf-8')) };
            } catch {
                return { filename: f, error: true };
            }
        });

    if (status) {
        sessions = sessions.filter(s => s.status === status);
    }

    if (format === 'json') {
        console.log(JSON.stringify(sessions, null, 2));
    } else {
        console.log(chalk.bold('\n📜 SPAR Sessions\n'));
        sessions.forEach((s, i) => {
            const date = s.timestamp?.split('T')[0] || 'Unknown';
            const decision = s.decision?.substring(0, 50) || s.filename;
            const statusIcon = {
                completed: '✅',
                running: '🔄',
                paused: '⏸️',
                failed: '❌'
            }[s.status] || '•';

            console.log(`  ${statusIcon} ${date} — ${decision}...`);
        });
        console.log('');
    }
}

// ============================================
// ARENA COMMANDS
// ============================================

/**
 * List all arenas
 */
export function arenaList(category = null) {
    console.log(chalk.bold.cyan('\n🏟️  SPAR ARENA — Pre-configured Debate Formations\n'));

    const categories = getCategories();

    if (category) {
        // Show specific category
        const cat = categories.find(c => c.id === category);
        if (!cat) {
            console.log(chalk.red(`Unknown category: ${category}`));
            console.log(chalk.gray(`Available: ${categories.map(c => c.id).join(', ')}\n`));
            return;
        }

        console.log(chalk.bold(`${cat.emoji} ${cat.name} Arenas:\n`));
        const arenas = listArenas(category);
        arenas.forEach(arena => {
            console.log(`  ${chalk.cyan(arena.id)}`);
            console.log(`    ${arena.name} — "${arena.question}"`);
            console.log(chalk.gray(`    ${arena.personas.north.id} | ${arena.personas.east.id} | ${arena.personas.south.id} | ${arena.personas.west.id}\n`));
        });
    } else {
        // Show all categories with counts
        categories.forEach(cat => {
            const arenas = listArenas(cat.id);
            console.log(`  ${cat.emoji} ${chalk.bold(cat.name)} (${arenas.length} arenas)`);
            arenas.slice(0, 3).forEach(a => {
                console.log(chalk.gray(`     • ${a.id}: ${a.question}`));
            });
            if (arenas.length > 3) {
                console.log(chalk.gray(`     ...and ${arenas.length - 3} more\n`));
            } else {
                console.log('');
            }
        });

        console.log(chalk.gray('\nUse: sparkit arena list <category> for details'));
        console.log(chalk.gray('     sparkit arena show <arena-id> for persona prompts'));
        console.log(chalk.gray('     sparkit arena <arena-id> "Your decision"\n'));
    }
}

/**
 * Show arena details
 */
export function arenaShow(arenaId) {
    const arena = getArena(arenaId);

    if (!arena) {
        console.log(chalk.red(`\n❌ Arena not found: ${arenaId}`));
        console.log(chalk.gray('\nUse "sparkit arena list" to see available arenas.\n'));
        return;
    }

    console.log(chalk.bold.cyan(`\n🏟️  ${arena.name}\n`));
    console.log(chalk.gray('Question: ') + arena.question);
    console.log(chalk.gray('Category: ') + arena.category + '\n');

    console.log(chalk.bold('Personas:\n'));

    const directions = [
        { key: 'north', emoji: '🔵', color: 'blueBright' },
        { key: 'east', emoji: '🟢', color: 'greenBright' },
        { key: 'south', emoji: '🟡', color: 'yellowBright' },
        { key: 'west', emoji: '🔴', color: 'redBright' }
    ];

    directions.forEach(({ key, emoji, color }) => {
        const persona = arena.personas[key];
        console.log(`  ${emoji} ${chalk[color].bold(key.toUpperCase())}: ${persona.id} — ${persona.name}`);
    });

    console.log(chalk.gray('\n─────────────────────────────────────────────────────\n'));
    console.log(chalk.bold('Contextual Prompt Example:'));
    console.log(chalk.gray('(with decision: "Should we add dark mode?")\n'));

    // Show one prompt as example
    const examplePrompt = arena.personas.north.prompt("Should we add dark mode?");
    const lines = examplePrompt.split('\n').slice(0, 8);
    lines.forEach(line => console.log(chalk.gray(`  ${line}`)));
    console.log(chalk.gray('  ...'));

    console.log(chalk.gray('\n─────────────────────────────────────────────────────\n'));
    console.log(chalk.bold('Usage:\n'));
    console.log(`  sparkit arena ${arenaId} "Your decision question"\n`);
}

/**
 * Run a debate with an arena
 */
export async function arenaStart(arenaId, decision, options = {}) {
    const arena = getArena(arenaId);

    if (!arena) {
        console.log(chalk.red(`\n❌ Arena not found: ${arenaId}`));
        console.log(chalk.gray('\nUse "sparkit arena list" to see available arenas.\n'));
        return;
    }

    console.log(chalk.bold.cyan(`\n🏟️  ${arena.name}\n`));
    console.log(chalk.gray('Decision: ') + chalk.white(decision) + '\n');

    // Get contextual prompts
    const prompts = getContextualPrompts(arenaId, decision);

    console.log(chalk.bold('Contextual Persona Prompts Generated:\n'));

    const directions = [
        { key: 'north', emoji: '🔵', color: 'blueBright' },
        { key: 'east', emoji: '🟢', color: 'greenBright' },
        { key: 'south', emoji: '🟡', color: 'yellowBright' },
        { key: 'west', emoji: '🔴', color: 'redBright' }
    ];

    directions.forEach(({ key, emoji, color }) => {
        const persona = arena.personas[key];
        console.log(`  ${emoji} ${chalk[color](persona.name)}`);
    });

    console.log('');

    // Import and run debate with arena prompts
    try {
        const { debateStart } = await import('./index.js');
        await debateStart(decision, {
            ...options,
            arenaId,
            arenaName: arena.name,
            arenaPrompts: prompts.prompts
        });
    } catch (error) {
        console.error(chalk.red('Error starting arena debate:'), error.message);
    }
}

// ============================================
// EXPORTS
// ============================================

export default {
    launchTUI,
    templateList,
    templateShow,
    templateUse,
    templateCreate,
    templateDelete,
    sessionList,
    arenaList,
    arenaShow,
    arenaStart
};
