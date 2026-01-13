#!/usr/bin/env node

/**
 * SPAR CLI v2.5
 * Structured Persona-Argumentation for Reasoning
 * 
 * Installation:
 *   npm install -g spar-ai
 *   
 * Usage:
 *   spar                        → Start interactive debate
 *   spar debate start [topic]   → Full debate session
 *   spar persona list           → Show available personas
 *   spar persona create         → Create custom persona
 *   spar config show            → View configuration
 *   spar status                 → Show version, config, stats
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join, basename } from 'path';

// ============================================
// CONFIGURATION
// ============================================

const VERSION = '2.5.0';
const SPAR_DIR = join(homedir(), '.spar');
const CONFIG_PATH = join(SPAR_DIR, 'config.json');
const PERSONAS_DIR = join(SPAR_DIR, 'personas');
const SESSIONS_DIR = join(SPAR_DIR, 'sessions');

// Ensure directories exist
function ensureDirectories() {
    [SPAR_DIR, PERSONAS_DIR, SESSIONS_DIR].forEach(dir => {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
    });
}

// ============================================
// BUILT-IN PERSONAS (N-E-W-S Compass)
// ============================================

const BUILTIN_PERSONAS = {
    north: {
        id: 'north',
        name: 'The Visionary',
        direction: 'North',
        icon: '🔵',
        color: 'blue',
        corePriority: 'Where are we going? What\'s the ideal future?',
        fear: 'Settling for mediocrity when greatness is possible',
        style: 'Focus on possibility, aspiration, and long-term direction',
        keyQuestion: 'What could this become? Are we thinking big enough?',
        prompt: `You are THE VISIONARY (North).

YOUR CORE PRIORITY: Where are we going? What's the ideal future?
YOUR FEAR: Settling for mediocrity when greatness is possible.
YOUR STYLE: You focus on possibility, aspiration, and long-term direction.

When engaging with problems, you ask: "What could this become? Are we thinking big enough?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Challenge others to think beyond current constraints.
Keep your response focused and under 250 words.`
    },
    east: {
        id: 'east',
        name: 'The Challenger',
        direction: 'East',
        icon: '🟢',
        color: 'green',
        corePriority: 'What\'s emerging? What new dawn is breaking?',
        fear: 'Being left behind by clinging to the old way',
        style: 'Focus on disruption, innovation, and what\'s coming next',
        keyQuestion: 'What\'s changing? What would a newcomer do differently?',
        prompt: `You are THE CHALLENGER (East).

YOUR CORE PRIORITY: What's emerging? What new dawn is breaking?
YOUR FEAR: Being left behind by clinging to the old way.
YOUR STYLE: You focus on disruption, innovation, and what's coming next.

When engaging with problems, you ask: "What's changing? What would a newcomer do differently?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Challenge assumptions that worked yesterday but may fail tomorrow.
Keep your response focused and under 250 words.`
    },
    south: {
        id: 'south',
        name: 'The Pragmatist',
        direction: 'South',
        icon: '🟡',
        color: 'yellow',
        corePriority: 'What\'s grounded? What actually works in reality?',
        fear: 'Beautiful ideas that collapse when they meet the real world',
        style: 'Focus on execution, feasibility, and practical constraints',
        keyQuestion: 'Can we actually do this? What are the real constraints?',
        prompt: `You are THE PRAGMATIST (South).

YOUR CORE PRIORITY: What's grounded? What actually works in reality?
YOUR FEAR: Beautiful ideas that collapse when they meet the real world.
YOUR STYLE: You focus on execution, feasibility, and practical constraints.

When engaging with problems, you ask: "Can we actually do this? What are the real constraints?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Ground airy visions in operational reality.
Keep your response focused and under 250 words.`
    },
    west: {
        id: 'west',
        name: 'The Sage',
        direction: 'West',
        icon: '🔴',
        color: 'red',
        corePriority: 'What\'s proven? What has history taught us?',
        fear: 'Repeating mistakes that wisdom could have prevented',
        style: 'Focus on experience, patterns, and lessons from the past',
        keyQuestion: 'What have we learned before? What does wisdom suggest?',
        prompt: `You are THE SAGE (West).

YOUR CORE PRIORITY: What's proven? What has history taught us?
YOUR FEAR: Repeating mistakes that wisdom could have prevented.
YOUR STYLE: You focus on experience, patterns, and lessons from the past.

When engaging with problems, you ask: "What have we learned before? What does wisdom suggest?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Bring the weight of experience to bear on shiny new ideas.
Keep your response focused and under 250 words.`
    }
};

// ============================================
// CONFIG MANAGEMENT
// ============================================

function loadConfig() {
    ensureDirectories();
    if (existsSync(CONFIG_PATH)) {
        try {
            return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
        } catch {
            return {};
        }
    }
    return {};
}

function saveConfig(config) {
    ensureDirectories();
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getConfig(key) {
    const config = loadConfig();
    return config[key];
}

function setConfig(key, value) {
    const config = loadConfig();
    config[key] = value;
    saveConfig(config);
}

// ============================================
// PERSONA MANAGEMENT
// ============================================

function loadCustomPersonas() {
    ensureDirectories();
    const personas = {};

    if (existsSync(PERSONAS_DIR)) {
        const files = readdirSync(PERSONAS_DIR).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const persona = JSON.parse(readFileSync(join(PERSONAS_DIR, file), 'utf-8'));
                personas[persona.id] = persona;
            } catch (e) {
                console.error(chalk.yellow(`Warning: Could not load persona ${file}`));
            }
        }
    }

    return personas;
}

function getAllPersonas() {
    const custom = loadCustomPersonas();
    return { ...BUILTIN_PERSONAS, ...custom };
}

function savePersona(persona) {
    ensureDirectories();
    const filename = `${persona.id}.json`;
    writeFileSync(join(PERSONAS_DIR, filename), JSON.stringify(persona, null, 2));
}

// ============================================
// SESSION MANAGEMENT
// ============================================

function saveSession(session) {
    ensureDirectories();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = session.decision.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filename = `${timestamp}_${slug}.json`;
    writeFileSync(join(SESSIONS_DIR, filename), JSON.stringify(session, null, 2));
    return filename;
}

function listSessions(limit = 10) {
    ensureDirectories();
    const files = readdirSync(SESSIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse()
        .slice(0, limit);

    return files.map(f => {
        try {
            const session = JSON.parse(readFileSync(join(SESSIONS_DIR, f), 'utf-8'));
            return { filename: f, ...session };
        } catch {
            return { filename: f, error: true };
        }
    });
}

// ============================================
// API CALLS
// ============================================

async function callAI(provider, apiKey, systemPrompt, userMessage) {
    const endpoints = {
        openai: 'https://api.openai.com/v1/chat/completions',
        anthropic: 'https://api.anthropic.com/v1/messages',
        gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    };

    if (provider === 'openai') {
        const response = await fetch(endpoints.openai, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 800
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;
    }

    if (provider === 'anthropic') {
        const response = await fetch(endpoints.anthropic, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 800,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }]
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.content[0].text;
    }

    if (provider === 'gemini') {
        const response = await fetch(endpoints.gemini, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }]
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    }

    throw new Error(`Unknown provider: ${provider}`);
}

// ============================================
// UI COMPONENTS
// ============================================

function printBanner() {
    console.log(chalk.bold.magenta(`
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🥊  ${chalk.white('S P A R')}   ${chalk.gray('v' + VERSION)}                                             ║
║   ${chalk.dim('Structured Persona-Argumentation for Reasoning')}                      ║
║                                                                       ║
║   ${chalk.cyan('Four Perspectives, Four Dimensions, One Synthesis')}                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
    `));
    console.log(chalk.italic.gray('   நாலு பேரு, நாலு திசை, ஒரு முடிவு!\n'));
}

function printCompass() {
    console.log(chalk.gray(`
                            ${chalk.blue('🔵 NORTH')}
                           The Visionary
                        "Where are we going?"
                                 │
                                 │
             ${chalk.red('🔴 WEST')} ─────────────┼───────────── ${chalk.green('🟢 EAST')}
             The Sage            │             The Challenger
         "What's proven?"        │          "What's emerging?"
                                 │
                                 │
                            ${chalk.yellow('🟡 SOUTH')}
                          The Pragmatist
                       "What's grounded?"
    `));
}

function printDivider(char = '─', color = chalk.gray) {
    console.log(color(char.repeat(70)));
}

// ============================================
// COMMANDS
// ============================================

// --- spar debate start ---
async function debateStart(decision, options) {
    printBanner();

    let provider = getConfig('provider');
    let apiKey = getConfig('apiKey');

    // Setup if needed
    if (!provider || !apiKey) {
        console.log(chalk.yellow('⚙️  First-time setup required\n'));
        await configSetup();
        provider = getConfig('provider');
        apiKey = getConfig('apiKey');
    }

    // Get decision
    if (!decision) {
        const { decisionInput } = await inquirer.prompt([
            {
                type: 'editor',
                name: 'decisionInput',
                message: 'Describe your decision (opens editor):'
            }
        ]);
        decision = decisionInput?.trim();
    }

    if (!decision) {
        console.log(chalk.red('❌ No decision provided.'));
        process.exit(1);
    }

    // Select personas
    const allPersonas = getAllPersonas();
    let selectedPersonas = ['north', 'east', 'south', 'west']; // Default N-E-W-S

    if (options.personas) {
        selectedPersonas = options.personas.split(',').map(p => p.trim());
    } else if (options.interactive) {
        const { chosen } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'chosen',
                message: 'Select personas for this debate:',
                choices: Object.values(allPersonas).map(p => ({
                    name: `${p.icon} ${p.name} — ${p.corePriority || p.keyQuestion}`,
                    value: p.id,
                    checked: ['north', 'east', 'south', 'west'].includes(p.id)
                }))
            }
        ]);
        selectedPersonas = chosen;
    }

    printCompass();
    printDivider('═', chalk.magenta);
    console.log(chalk.bold('\n📋 THE DECISION:\n'));
    console.log(chalk.white(`   ${decision.split('\n').join('\n   ')}\n`));
    printDivider();

    const session = {
        decision,
        provider,
        personas: selectedPersonas,
        timestamp: new Date().toISOString(),
        responses: { round1: {}, round2: {} },
        synthesis: null
    };

    const userMessage = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;

    // Round 1
    console.log(chalk.bold.magenta('\n\n╔══════════════════════════════════════════╗'));
    console.log(chalk.bold.magenta('║   ⚔️  ROUND 1: Opening Positions         ║'));
    console.log(chalk.bold.magenta('╚══════════════════════════════════════════╝\n'));

    const colorFns = { north: chalk.blue, east: chalk.green, south: chalk.yellow, west: chalk.red };
    const spinners = {};

    for (const id of selectedPersonas) {
        const persona = allPersonas[id];
        if (!persona) continue;
        spinners[id] = ora({
            text: `${persona.icon} ${persona.name}`,
            color: persona.color || 'white'
        }).start();
    }

    const round1Promises = selectedPersonas.map(async (id) => {
        const persona = allPersonas[id];
        if (!persona) return;
        try {
            const response = await callAI(provider, apiKey, persona.prompt, userMessage);
            session.responses.round1[id] = response;
            spinners[id].succeed();
        } catch (error) {
            session.responses.round1[id] = `Error: ${error.message}`;
            spinners[id].fail();
        }
    });

    await Promise.all(round1Promises);
    console.log('');

    // Print Round 1 responses
    for (const id of selectedPersonas) {
        const persona = allPersonas[id];
        if (!persona) continue;
        const colorFn = colorFns[id] || chalk.white;

        console.log(colorFn(`\n┌${'─'.repeat(68)}┐`));
        console.log(colorFn(`│ ${persona.icon}  ${(persona.direction || persona.name).toUpperCase().padEnd(60)} │`));
        console.log(colorFn(`└${'─'.repeat(68)}┘`));
        console.log(chalk.white('\n' + (session.responses.round1[id] || '').split('\n').map(l => '   ' + l).join('\n')));
        console.log('');
    }

    // Round 2
    const { runClash } = await inquirer.prompt([
        { type: 'confirm', name: 'runClash', message: 'Run Round 2: The Clash?', default: true }
    ]);

    if (runClash) {
        console.log(chalk.bold.red('\n\n╔══════════════════════════════════════════╗'));
        console.log(chalk.bold.red('║   🔥 ROUND 2: The Clash                  ║'));
        console.log(chalk.bold.red('╚══════════════════════════════════════════╝\n'));

        const clashPrompt = selectedPersonas.map(id => {
            const p = allPersonas[id];
            const resp = session.responses.round1[id] || '';
            return `${p?.name || id}: ${resp.substring(0, 200)}...`;
        }).join('\n\n');

        const clashMessage = `The other perspectives said:\n\n${clashPrompt}\n\nWhere do you DISAGREE with them? Be direct and confrontational.`;

        for (const id of selectedPersonas) {
            spinners[id] = ora({ text: `${allPersonas[id]?.icon} responding...`, color: allPersonas[id]?.color || 'white' }).start();
        }

        const round2Promises = selectedPersonas.map(async (id) => {
            const persona = allPersonas[id];
            if (!persona) return;
            try {
                const response = await callAI(provider, apiKey, persona.prompt, clashMessage);
                session.responses.round2[id] = response;
                spinners[id].succeed();
            } catch (error) {
                session.responses.round2[id] = `Error: ${error.message}`;
                spinners[id].fail();
            }
        });

        await Promise.all(round2Promises);

        for (const id of selectedPersonas) {
            const persona = allPersonas[id];
            if (!persona) continue;
            const colorFn = colorFns[id] || chalk.white;
            console.log(colorFn(`\n┌${'─'.repeat(68)}┐`));
            console.log(colorFn(`│ ${persona.icon}  responds...${' '.repeat(55)} │`));
            console.log(colorFn(`└${'─'.repeat(68)}┘`));
            console.log(chalk.white('\n' + (session.responses.round2[id] || '').split('\n').map(l => '   ' + l).join('\n')));
        }

        // Synthesis
        console.log(chalk.bold.cyan('\n\n╔══════════════════════════════════════════╗'));
        console.log(chalk.bold.cyan('║   📊 SYNTHESIS                           ║'));
        console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

        const synthesisSpinner = ora('Synthesizing...').start();
        try {
            const synthPrompt = `Synthesize this SPAR debate on: ${decision}\n\nRound 1:\n${JSON.stringify(session.responses.round1)}\n\nRound 2:\n${JSON.stringify(session.responses.round2)}\n\nProvide: Key Tensions, Convergences, Insights, Open Questions.`;
            session.synthesis = await callAI(provider, apiKey, 'You are a neutral debate moderator.', synthPrompt);
            synthesisSpinner.succeed();
            console.log(chalk.white('\n' + session.synthesis));
        } catch (e) {
            synthesisSpinner.fail();
            console.log(chalk.red(e.message));
        }
    }

    // Auto-save session
    const savedFile = saveSession(session);
    console.log(chalk.green(`\n✓ Session saved to ~/.spar/sessions/${savedFile}`));

    // Export option
    const { exportMd } = await inquirer.prompt([
        { type: 'confirm', name: 'exportMd', message: 'Export to Markdown?', default: true }
    ]);

    if (exportMd) {
        const mdFilename = exportSessionMarkdown(session);
        console.log(chalk.green(`✓ Exported to ${mdFilename}`));
    }

    console.log(chalk.bold.magenta('\n\n🥊 Don\'t deliberate alone. SPAR.\n'));
}

function exportSessionMarkdown(session) {
    const date = new Date().toISOString().split('T')[0];
    const allPersonas = getAllPersonas();

    let md = `# SPAR Session\n\n**Date**: ${session.timestamp}\n**Provider**: ${session.provider}\n\n---\n\n## 🎯 The Decision\n\n${session.decision}\n\n---\n\n## ⚔️ Round 1\n\n`;

    for (const id of session.personas) {
        const p = allPersonas[id];
        md += `### ${p?.icon || '•'} ${p?.name || id}\n${session.responses.round1[id] || '_No response_'}\n\n`;
    }

    md += `---\n\n## 🔥 Round 2: The Clash\n\n`;
    for (const id of session.personas) {
        const p = allPersonas[id];
        md += `### ${p?.icon || '•'} ${p?.name || id} responds\n${session.responses.round2[id] || '_Not run_'}\n\n`;
    }

    md += `---\n\n## 📊 Synthesis\n\n${session.synthesis || '_Not generated_'}\n\n---\n\n> **நாலு பேரு, நாலு திசை, ஒரு முடிவு!**\n\n🥊 Generated by SPAR CLI\n`;

    const filename = `spar-session-${date}.md`;
    writeFileSync(filename, md);
    return filename;
}

// --- spar persona list ---
async function personaList() {
    printBanner();
    console.log(chalk.bold('\n📋 Available Personas\n'));

    const allPersonas = getAllPersonas();
    const builtinIds = Object.keys(BUILTIN_PERSONAS);

    console.log(chalk.cyan('Built-in (N-E-W-S Compass):\n'));
    for (const id of builtinIds) {
        const p = allPersonas[id];
        console.log(`  ${p.icon} ${chalk.bold(p.name)} (${p.direction})`);
        console.log(chalk.gray(`     Priority: ${p.corePriority}`));
        console.log(chalk.gray(`     Fear: ${p.fear}`));
        console.log('');
    }

    const customIds = Object.keys(allPersonas).filter(id => !builtinIds.includes(id));
    if (customIds.length > 0) {
        console.log(chalk.green('\nCustom Personas:\n'));
        for (const id of customIds) {
            const p = allPersonas[id];
            console.log(`  ${p.icon || '•'} ${chalk.bold(p.name)} (${p.id})`);
            console.log(chalk.gray(`     ${p.corePriority || p.keyQuestion || ''}`));
            console.log('');
        }
    }

    console.log(chalk.gray(`\nPersonas stored in: ${PERSONAS_DIR}\n`));
}

// --- spar persona create ---
async function personaCreate() {
    printBanner();
    console.log(chalk.bold('\n🎭 Create New Persona\n'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Persona ID (lowercase, no spaces):',
            validate: (input) => /^[a-z0-9_]+$/.test(input) || 'Use lowercase letters, numbers, underscores only'
        },
        {
            type: 'input',
            name: 'name',
            message: 'Display name (e.g., "The Risk Analyst"):',
            validate: (input) => input.length > 0 || 'Name required'
        },
        {
            type: 'input',
            name: 'icon',
            message: 'Icon emoji:',
            default: '🎯'
        },
        {
            type: 'input',
            name: 'corePriority',
            message: 'Core priority (what matters most to this persona):',
            validate: (input) => input.length > 0 || 'Priority required'
        },
        {
            type: 'input',
            name: 'fear',
            message: 'Fundamental fear (what keeps this persona up at night):',
            validate: (input) => input.length > 0 || 'Fear required'
        },
        {
            type: 'input',
            name: 'keyQuestion',
            message: 'Key question this persona always asks:',
            validate: (input) => input.length > 0 || 'Question required'
        },
        {
            type: 'editor',
            name: 'prompt',
            message: 'Full system prompt (opens editor):',
            default: (answers) => `You are ${answers.name}.

YOUR CORE PRIORITY: ${answers.corePriority}
YOUR FEAR: ${answers.fear}
YOUR STYLE: [Describe how this persona engages with problems]

When engaging with problems, you ask: "${answers.keyQuestion}"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you.
Keep your response focused and under 250 words.`
        }
    ]);

    const persona = {
        id: answers.id,
        name: answers.name,
        icon: answers.icon,
        corePriority: answers.corePriority,
        fear: answers.fear,
        keyQuestion: answers.keyQuestion,
        prompt: answers.prompt
    };

    savePersona(persona);
    console.log(chalk.green(`\n✓ Persona "${persona.name}" saved to ${PERSONAS_DIR}/${persona.id}.json\n`));
}

// --- spar config show ---
async function configShow() {
    printBanner();
    console.log(chalk.bold('\n⚙️  Configuration\n'));

    const config = loadConfig();

    console.log(`  Provider:    ${config.provider || chalk.gray('Not set')}`);
    console.log(`  API Key:     ${config.apiKey ? chalk.green('••••••••' + config.apiKey.slice(-4)) : chalk.gray('Not set')}`);
    console.log(`  Config file: ${CONFIG_PATH}`);
    console.log(`  Personas:    ${PERSONAS_DIR}`);
    console.log(`  Sessions:    ${SESSIONS_DIR}`);
    console.log('');
}

// --- spar config set ---
async function configSet(key, value) {
    if (!key) {
        console.log(chalk.red('Usage: spar config set <key> <value>'));
        console.log(chalk.gray('Keys: provider, apiKey'));
        return;
    }

    if (key === 'apiKey' && !value) {
        const { apiKey } = await inquirer.prompt([
            { type: 'password', name: 'apiKey', message: 'Enter API key:' }
        ]);
        value = apiKey;
    }

    setConfig(key, value);
    console.log(chalk.green(`✓ Set ${key}`));
}

// --- spar config setup (interactive) ---
async function configSetup() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'provider',
            message: 'Select AI provider:',
            choices: [
                { name: 'OpenAI (GPT-4 Turbo)', value: 'openai' },
                { name: 'Anthropic (Claude 3.5 Sonnet)', value: 'anthropic' },
                { name: 'Google (Gemini 1.5 Flash)', value: 'gemini' }
            ]
        },
        {
            type: 'password',
            name: 'apiKey',
            message: 'Enter your API key:',
            validate: (input) => input.length > 0 || 'API key is required'
        }
    ]);

    setConfig('provider', answers.provider);
    setConfig('apiKey', answers.apiKey);
    console.log(chalk.green(`\n✓ Configuration saved to ${CONFIG_PATH}\n`));
}

// --- spar status ---
async function showStatus() {
    printBanner();

    const config = loadConfig();
    const customPersonas = loadCustomPersonas();
    const sessions = listSessions(5);

    console.log(chalk.bold('\n📊 Status\n'));
    console.log(`  Version:         ${VERSION}`);
    console.log(`  Provider:        ${config.provider || chalk.gray('Not configured')}`);
    console.log(`  API Key:         ${config.apiKey ? chalk.green('Configured ✓') : chalk.yellow('Not set')}`);
    console.log(`  Custom Personas: ${Object.keys(customPersonas).length}`);
    console.log(`  Saved Sessions:  ${sessions.length > 0 ? sessions.length + ' recent' : 'None'}`);
    console.log('');

    if (sessions.length > 0) {
        console.log(chalk.bold('Recent Sessions:\n'));
        sessions.forEach(s => {
            console.log(`  • ${s.timestamp?.split('T')[0] || 'Unknown'}: ${s.decision?.substring(0, 50) || s.filename}...`);
        });
        console.log('');
    }
}

// --- spar debate history ---
async function debateHistory() {
    printBanner();
    console.log(chalk.bold('\n📜 Session History\n'));

    const sessions = listSessions(20);

    if (sessions.length === 0) {
        console.log(chalk.gray('  No sessions found.\n'));
        return;
    }

    sessions.forEach((s, i) => {
        const date = s.timestamp?.split('T')[0] || 'Unknown';
        const decision = s.decision?.substring(0, 60) || 'Unknown';
        console.log(`  ${chalk.gray(i + 1 + '.')} ${date} — ${decision}...`);
    });

    console.log(chalk.gray(`\n  Sessions stored in: ${SESSIONS_DIR}\n`));
}

// ============================================
// CLI SETUP
// ============================================

const program = new Command();

program
    .name('spar')
    .description('SPAR — Structured Persona-Argumentation for Reasoning')
    .version(VERSION);

// spar (default = spar debate start)
program
    .argument('[decision]', 'The decision to debate')
    .option('-p, --personas <list>', 'Comma-separated persona IDs')
    .option('-i, --interactive', 'Interactive persona selection')
    .action((decision, options) => debateStart(decision, options));

// spar debate
const debate = program.command('debate').description('Debate commands');
debate.command('start [decision]')
    .description('Start a new SPAR debate')
    .option('-p, --personas <list>', 'Comma-separated persona IDs')
    .option('-i, --interactive', 'Interactive persona selection')
    .action(debateStart);
debate.command('history').description('Show session history').action(debateHistory);

// spar persona
const persona = program.command('persona').description('Persona management');
persona.command('list').description('List all personas').action(personaList);
persona.command('create').description('Create a new persona').action(personaCreate);

// spar config
const config = program.command('config').description('Configuration');
config.command('show').description('Show current configuration').action(configShow);
config.command('set <key> [value]').description('Set a configuration value').action(configSet);
config.command('setup').description('Interactive setup').action(configSetup);

// spar status
program.command('status').description('Show SPAR status').action(showStatus);

// spar compass
program.command('compass').description('Show the N-E-W-S framework').action(() => {
    printBanner();
    printCompass();
    console.log(chalk.gray(`
    Natural Tensions:
    • ${chalk.blue('North')} ↔ ${chalk.yellow('South')}: Vision vs. Reality  
    • ${chalk.green('East')} ↔ ${chalk.red('West')}: Innovation vs. Tradition

    When all four directions engage, no blind spot survives.
    `));
});

program.parse();
