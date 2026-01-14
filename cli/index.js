#!/usr/bin/env node

/**
 * SPAR Kit CLI v3.1
 * Structured Persona-Argumentation for Reasoning
 * 
 * Full SPAR Methodology Implementation:
 * - NEWS Compass (4 Directions)
 * - PERSONA Library (108 personas, 7 archetypes)
 * - SPARKIT Protocol (7 steps)
 * - SPARK Principles (5 foundations)
 * - ASPIRES Framework (7 advanced patterns)
 * 
 * நாலு பேரு, நாலு திசை, ஒரு முடிவு!
 * Four Perspectives, Four Dimensions, One Synthesis
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
import { join } from 'path';

import { callAI, PROVIDERS } from './providers.js';
import { NEWS_COMPASS, PRESET_PACKS, getAllPersonas, getPresetPersonas, PERSONA_ARCHETYPES } from './personas.js';
import { SPARKIT_PROTOCOL, SPARK_PRINCIPLES, ASPIRES_FRAMEWORK, formatSparkitQuickRef, formatSparkQuickRef, formatAspiresQuickRef } from './methodology.js';

// ============================================
// CONFIGURATION
// ============================================

const VERSION = '3.1.0';
const SPAR_DIR = join(homedir(), '.spar');
const CONFIG_PATH = join(SPAR_DIR, 'config.json');
const PERSONAS_DIR = join(SPAR_DIR, 'personas');
const SESSIONS_DIR = join(SPAR_DIR, 'sessions');

function ensureDirectories() {
    [SPAR_DIR, PERSONAS_DIR, SESSIONS_DIR].forEach(dir => {
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    });
}

// ============================================
// CONFIG MANAGEMENT
// ============================================

function loadConfig() {
    ensureDirectories();
    if (existsSync(CONFIG_PATH)) {
        try { return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')); }
        catch { return {}; }
    }
    return {};
}

function saveConfig(config) {
    ensureDirectories();
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function getConfig(key) { return loadConfig()[key]; }
function setConfig(key, value) { const c = loadConfig(); c[key] = value; saveConfig(c); }

// ============================================
// CUSTOM PERSONA MANAGEMENT
// ============================================

function loadCustomPersonas() {
    ensureDirectories();
    const personas = {};
    if (existsSync(PERSONAS_DIR)) {
        readdirSync(PERSONAS_DIR).filter(f => f.endsWith('.json')).forEach(file => {
            try {
                const p = JSON.parse(readFileSync(join(PERSONAS_DIR, file), 'utf-8'));
                personas[p.id] = p;
            } catch { }
        });
    }
    return personas;
}

function getAllPersonasWithCustom() {
    return { ...getAllPersonas(), ...loadCustomPersonas() };
}

function savePersona(persona) {
    ensureDirectories();
    writeFileSync(join(PERSONAS_DIR, `${persona.id}.json`), JSON.stringify(persona, null, 2));
}

// ============================================
// SESSION MANAGEMENT
// ============================================

function saveSession(session) {
    ensureDirectories();
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = session.decision.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fn = `${ts}_${slug}.json`;
    writeFileSync(join(SESSIONS_DIR, fn), JSON.stringify(session, null, 2));
    return fn;
}

function listSessions(limit = 10) {
    ensureDirectories();
    return readdirSync(SESSIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .sort().reverse().slice(0, limit)
        .map(f => {
            try { return { filename: f, ...JSON.parse(readFileSync(join(SESSIONS_DIR, f), 'utf-8')) }; }
            catch { return { filename: f, error: true }; }
        });
}

// ============================================
// UI COMPONENTS
// ============================================

function printBanner() {
    console.log(chalk.bold.magenta(`
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🥊  ${chalk.white('S P A R   K I T')}   ${chalk.gray('v' + VERSION)}                                      ║
║   ${chalk.dim('Structured Persona-Argumentation for Reasoning')}                      ║
║                                                                       ║
║   ${chalk.cyan('SPARKIT Protocol')} · ${chalk.yellow('SPARK Principles')} · ${chalk.green('ASPIRES Framework')}       ║
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
             ${chalk.red('🔴 WEST')} ─────────────┼───────────── ${chalk.green('🟢 EAST')}
             The Sage            │          The Challenger
         "What's proven?"        │       "What's emerging?"
                                 │
                            ${chalk.yellow('🟡 SOUTH')}
                          The Pragmatist
                       "What's grounded?"
    `));
}

function printDivider(char = '─', color = chalk.gray) {
    console.log(color(char.repeat(72)));
}

// ============================================
// SPARK PRINCIPLES CHECK
// ============================================

async function runSparkCheck(phase = 'before') {
    const principles = Object.values(SPARK_PRINCIPLES);
    const relevant = principles.filter(p => {
        if (phase === 'before') return p.timing === 'Before SPAR';
        if (phase === 'during') return p.timing === 'During SPAR';
        if (phase === 'after') return p.timing.includes('After');
        return false;
    });

    if (relevant.length === 0) return true;

    console.log(chalk.yellow(`\n⚡ SPARK Check (${phase}):\n`));

    for (const p of relevant) {
        console.log(chalk.bold(`  ${p.letter} — ${p.name}`));
        console.log(chalk.gray(`     ${p.check}`));
    }

    const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Have you considered these principles?',
        default: true
    }]);

    return proceed;
}

// ============================================
// MAIN DEBATE ENGINE (SPARKIT Protocol)
// ============================================

async function debateStart(decision, options) {
    printBanner();

    let provider = getConfig('provider');
    let apiKey = getConfig('apiKey');
    const model = getConfig('model');
    const baseUrl = getConfig('baseUrl');

    // Setup if needed
    if (!provider) {
        console.log(chalk.yellow('⚙️  First-time setup required\n'));
        await configSetup();
        provider = getConfig('provider');
        apiKey = getConfig('apiKey');
    }

    // STEP 1: SCOPE - Define the question
    console.log(chalk.bold.cyan('\n═══ STEP 1: SCOPE ═══'));
    console.log(chalk.gray(SPARKIT_PROTOCOL.S.description + '\n'));

    if (!decision) {
        const { decisionInput } = await inquirer.prompt([{
            type: 'editor',
            name: 'decisionInput',
            message: 'Describe your decision (opens editor):'
        }]);
        decision = decisionInput?.trim();
    }

    if (!decision) {
        console.log(chalk.red('❌ No decision provided.'));
        process.exit(1);
    }

    // SPARK Check (Before)
    const sparkOk = await runSparkCheck('before');
    if (!sparkOk) {
        console.log(chalk.yellow('\n💡 Consider addressing the SPARK principles first.\n'));
        return;
    }

    // STEP 2: POPULATE - Select personas
    console.log(chalk.bold.cyan('\n═══ STEP 2: POPULATE ═══'));
    console.log(chalk.gray(SPARKIT_PROTOCOL.P.description + '\n'));

    const allPersonas = getAllPersonasWithCustom();
    let selectedPersonas = ['north', 'east', 'south', 'west'];

    if (options.preset) {
        const preset = PRESET_PACKS[options.preset];
        if (preset) {
            selectedPersonas = preset.personas;
            console.log(chalk.green(`  Using preset: ${preset.name}`));
        }
    } else if (options.personas) {
        selectedPersonas = options.personas.split(',').map(p => p.trim());
    } else if (options.interactive) {
        const { chosen } = await inquirer.prompt([{
            type: 'checkbox',
            name: 'chosen',
            message: 'Select personas:',
            choices: Object.values(allPersonas).map(p => ({
                name: `${p.icon} ${p.name} — ${p.corePriority || p.keyQuestion}`,
                value: p.id,
                checked: selectedPersonas.includes(p.id)
            }))
        }]);
        selectedPersonas = chosen;
    }

    printCompass();
    printDivider('═', chalk.magenta);

    // STEP 3: ANNOUNCE - Present the challenge
    console.log(chalk.bold.cyan('\n═══ STEP 3: ANNOUNCE ═══'));
    console.log(chalk.bold('📋 THE DECISION:\n'));
    console.log(chalk.white(`   ${decision.split('\n').join('\n   ')}\n`));
    printDivider();

    const session = {
        decision,
        provider,
        model: model || PROVIDERS[provider]?.defaultModel,
        personas: selectedPersonas,
        timestamp: new Date().toISOString(),
        protocol: 'SPARKIT',
        responses: { round1: {}, round2: {} },
        synthesis: null,
        interrogation: {},
        finalPositions: {}
    };

    const announcePrompt = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your initial position, and why?
- What would change your mind?`;

    // STEP 4: RUMBLE - Round 1
    console.log(chalk.bold.red('\n═══ STEP 4: RUMBLE — Round 1 ═══\n'));

    const colorFns = { north: chalk.blue, east: chalk.green, south: chalk.yellow, west: chalk.red };
    const spinners = {};

    for (const id of selectedPersonas) {
        const persona = allPersonas[id];
        if (!persona) continue;
        spinners[id] = ora({ text: `${persona.icon} ${persona.name}`, color: persona.color || 'white' }).start();
    }

    const round1Promises = selectedPersonas.map(async (id) => {
        const persona = allPersonas[id];
        if (!persona) return;
        try {
            const response = await callAI(provider, apiKey, persona.prompt, announcePrompt, { model, baseUrl });
            session.responses.round1[id] = response;
            spinners[id].succeed();
        } catch (error) {
            session.responses.round1[id] = `Error: ${error.message}`;
            spinners[id].fail();
        }
    });

    await Promise.all(round1Promises);

    for (const id of selectedPersonas) {
        const persona = allPersonas[id];
        if (!persona) continue;
        const colorFn = colorFns[id] || chalk.white;
        console.log(colorFn(`\n┌${'─'.repeat(70)}┐`));
        console.log(colorFn(`│ ${persona.icon}  ${(persona.direction || persona.name).toUpperCase().padEnd(62)} │`));
        console.log(colorFn(`└${'─'.repeat(70)}┘`));
        console.log(chalk.white('\n' + (session.responses.round1[id] || '').split('\n').map(l => '   ' + l).join('\n')));
    }

    // Round 2 - The Clash
    const { runClash } = await inquirer.prompt([
        { type: 'confirm', name: 'runClash', message: 'Run Round 2: The Clash?', default: true }
    ]);

    if (runClash) {
        console.log(chalk.bold.red('\n═══ RUMBLE — Round 2: The Clash ═══\n'));

        const clashContext = selectedPersonas.map(id => {
            const p = allPersonas[id];
            const resp = session.responses.round1[id] || '';
            return `${p?.name || id}: ${resp.substring(0, 300)}...`;
        }).join('\n\n');

        const clashPrompt = `The other perspectives said:\n\n${clashContext}\n\nWhere do you DISAGREE with them? What are they missing? Be direct.`;

        for (const id of selectedPersonas) {
            spinners[id] = ora({ text: `${allPersonas[id]?.icon} responding...` }).start();
        }

        const round2Promises = selectedPersonas.map(async (id) => {
            const persona = allPersonas[id];
            if (!persona) return;
            try {
                const response = await callAI(provider, apiKey, persona.prompt, clashPrompt, { model, baseUrl });
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
            console.log(colorFn(`\n┌${'─'.repeat(70)}┐`));
            console.log(colorFn(`│ ${persona.icon}  ${persona.name} responds${' '.repeat(52)} │`));
            console.log(colorFn(`└${'─'.repeat(70)}┘`));
            console.log(chalk.white('\n' + (session.responses.round2[id] || '').split('\n').map(l => '   ' + l).join('\n')));
        }
    }

    // STEP 5: KNIT - Synthesis
    console.log(chalk.bold.cyan('\n═══ STEP 5: KNIT — Synthesis ═══\n'));

    const synthSpinner = ora('Synthesizing tensions...').start();
    try {
        const synthPrompt = `Synthesize this SPAR debate on: ${decision}

Round 1 Positions:
${JSON.stringify(session.responses.round1, null, 2)}

Round 2 Clash:
${JSON.stringify(session.responses.round2, null, 2)}

Provide:
1. KEY TENSIONS — Where do personas fundamentally disagree?
2. CONVERGENCE — What do they surprisingly agree on?
3. UNEXAMINED — What has NOT been addressed?
4. DRAFT SYNTHESIS — A position that honors valid concerns from all sides`;

        session.synthesis = await callAI(provider, apiKey,
            'You are a neutral debate moderator synthesizing tensions.',
            synthPrompt, { model, baseUrl, maxTokens: 1500 });
        synthSpinner.succeed();
        console.log(chalk.white('\n' + session.synthesis));
    } catch (e) {
        synthSpinner.fail();
        console.log(chalk.red(e.message));
    }

    // STEP 6: INTERROGATE
    const { runInterrogate } = await inquirer.prompt([
        { type: 'confirm', name: 'runInterrogate', message: 'Run Step 6: INTERROGATE (stress-test synthesis)?', default: true }
    ]);

    if (runInterrogate && session.synthesis) {
        console.log(chalk.bold.yellow('\n═══ STEP 6: INTERROGATE ═══\n'));

        const interrogatePrompt = `The moderator has proposed this synthesis:

${session.synthesis}

Evaluate this synthesis:
- What does it get RIGHT about your concerns?
- What does it MISS or underweight?
- What ASSUMPTIONS could be wrong?
- What would make this synthesis FAIL?`;

        for (const id of selectedPersonas) {
            const persona = allPersonas[id];
            if (!persona) continue;
            const spinner = ora(`${persona.icon} ${persona.name} interrogating...`).start();
            try {
                session.interrogation[id] = await callAI(provider, apiKey, persona.prompt, interrogatePrompt, { model, baseUrl });
                spinner.succeed();
                console.log(chalk.gray(`\n${persona.icon} ${persona.name}:`));
                console.log(chalk.white(session.interrogation[id].split('\n').map(l => '   ' + l).join('\n')));
            } catch (e) {
                spinner.fail();
            }
        }
    }

    // STEP 7: TRANSMIT
    console.log(chalk.bold.green('\n═══ STEP 7: TRANSMIT — Final Recommendations ═══\n'));

    const transmitSpinner = ora('Generating actionable recommendations...').start();
    try {
        const transmitPrompt = `Based on this complete SPAR session:

Decision: ${decision}

Synthesis: ${session.synthesis}

Interrogation feedback: ${JSON.stringify(session.interrogation)}

Provide:
1. PRIMARY RECOMMENDATION — The clearest path forward
2. KEY CONDITION — What must be true for this to work
3. WATCH-OUTS — What could derail this
4. OPEN QUESTIONS — What remains genuinely unresolved
5. NEXT ACTION — The very next step to take`;

        const finalRec = await callAI(provider, apiKey,
            'You are a strategic advisor providing clear, actionable recommendations.',
            transmitPrompt, { model, baseUrl, maxTokens: 1000 });
        transmitSpinner.succeed();

        console.log(chalk.bold.green('\n📋 ACTIONABLE RECOMMENDATIONS:\n'));
        console.log(chalk.white(finalRec));
        session.finalRecommendation = finalRec;
    } catch (e) {
        transmitSpinner.fail();
    }

    // SPARK Check (After)
    await runSparkCheck('after');

    // Auto-save
    const savedFile = saveSession(session);
    console.log(chalk.green(`\n✓ Session saved: ~/.spar/sessions/${savedFile}`));

    // Export option
    const { exportMd } = await inquirer.prompt([
        { type: 'confirm', name: 'exportMd', message: 'Export to Markdown?', default: true }
    ]);

    if (exportMd) {
        const mdFile = exportSessionMarkdown(session);
        console.log(chalk.green(`✓ Exported: ${mdFile}`));
    }

    console.log(chalk.bold.magenta('\n\n🥊 Don\'t deliberate alone. SPAR.\n'));
}

function exportSessionMarkdown(session) {
    const allPersonas = getAllPersonasWithCustom();
    let md = `# SPAR Session (SPARKIT Protocol)\n\n`;
    md += `**Date**: ${session.timestamp}\n`;
    md += `**Provider**: ${session.provider} (${session.model})\n\n---\n\n`;
    md += `## 🎯 The Decision\n\n${session.decision}\n\n---\n\n`;
    md += `## ⚔️ Round 1: Opening Positions\n\n`;

    for (const id of session.personas) {
        const p = allPersonas[id];
        md += `### ${p?.icon || '•'} ${p?.name || id}\n${session.responses.round1[id] || '_No response_'}\n\n`;
    }

    md += `---\n\n## 🔥 Round 2: The Clash\n\n`;
    for (const id of session.personas) {
        const p = allPersonas[id];
        md += `### ${p?.icon || '•'} ${p?.name || id}\n${session.responses.round2[id] || '_Not run_'}\n\n`;
    }

    md += `---\n\n## 📊 Synthesis (KNIT)\n\n${session.synthesis || '_Not generated_'}\n\n`;

    if (Object.keys(session.interrogation || {}).length > 0) {
        md += `---\n\n## 🔍 Interrogation\n\n`;
        for (const id of session.personas) {
            const p = allPersonas[id];
            if (session.interrogation[id]) {
                md += `### ${p?.icon || '•'} ${p?.name || id}\n${session.interrogation[id]}\n\n`;
            }
        }
    }

    if (session.finalRecommendation) {
        md += `---\n\n## ✅ Final Recommendations (TRANSMIT)\n\n${session.finalRecommendation}\n\n`;
    }

    md += `---\n\n> **நாலு பேரு, நாலு திசை, ஒரு முடிவு!**\n\n🥊 Generated by SPAR Kit v${VERSION}\n`;

    const filename = `spar-session-${new Date().toISOString().split('T')[0]}.md`;
    writeFileSync(filename, md);
    return filename;
}

// ============================================
// CONFIG SETUP
// ============================================

async function configSetup() {
    const providerChoices = [
        { name: '🟢 Ollama (Local - No API key)', value: 'ollama' },
        { name: '🔵 OpenAI (GPT-4)', value: 'openai' },
        { name: '🟣 Anthropic (Claude)', value: 'anthropic' },
        { name: '🟠 Google Gemini', value: 'gemini' },
        { name: '⚪ OpenAI-Compatible (vLLM/llama.cpp/LM Studio)', value: 'openai_compatible' }
    ];

    const answers = await inquirer.prompt([
        { type: 'list', name: 'provider', message: 'Select AI provider:', choices: providerChoices }
    ]);

    setConfig('provider', answers.provider);

    if (answers.provider === 'ollama') {
        const { baseUrl, model } = await inquirer.prompt([
            { type: 'input', name: 'baseUrl', message: 'Ollama URL:', default: 'http://localhost:11434/api/chat' },
            { type: 'input', name: 'model', message: 'Model name:', default: 'llama3.2' }
        ]);
        setConfig('baseUrl', baseUrl);
        setConfig('model', model);
    } else if (answers.provider === 'openai_compatible') {
        const { baseUrl, model, apiKey } = await inquirer.prompt([
            { type: 'input', name: 'baseUrl', message: 'API endpoint:', default: 'http://localhost:8000/v1/chat/completions' },
            { type: 'input', name: 'model', message: 'Model name:', default: 'default' },
            { type: 'password', name: 'apiKey', message: 'API key (leave blank if none):' }
        ]);
        setConfig('baseUrl', baseUrl);
        setConfig('model', model);
        if (apiKey) setConfig('apiKey', apiKey);
    } else {
        const { apiKey } = await inquirer.prompt([
            { type: 'password', name: 'apiKey', message: 'Enter your API key:', validate: i => i.length > 0 || 'Required' }
        ]);
        setConfig('apiKey', apiKey);

        const models = PROVIDERS[answers.provider]?.models || [];
        if (models.length > 1) {
            const { model } = await inquirer.prompt([
                { type: 'list', name: 'model', message: 'Select model:', choices: models }
            ]);
            setConfig('model', model);
        }
    }

    console.log(chalk.green(`\n✓ Configuration saved to ${CONFIG_PATH}\n`));
}

async function configShow() {
    printBanner();
    console.log(chalk.bold('\n⚙️  Configuration\n'));
    const config = loadConfig();
    console.log(`  Provider:    ${config.provider || chalk.gray('Not set')}`);
    console.log(`  Model:       ${config.model || chalk.gray('Default')}`);
    console.log(`  API Key:     ${config.apiKey ? chalk.green('••••' + config.apiKey.slice(-4)) : chalk.gray('Not set')}`);
    console.log(`  Base URL:    ${config.baseUrl || chalk.gray('Default')}`);
    console.log(`  Config:      ${CONFIG_PATH}`);
    console.log(`  Personas:    ${PERSONAS_DIR}`);
    console.log(`  Sessions:    ${SESSIONS_DIR}\n`);
}

// ============================================
// PERSONA COMMANDS
// ============================================

async function personaList() {
    printBanner();
    console.log(chalk.bold('\n📋 PERSONA Library\n'));

    console.log(chalk.cyan('NEWS Compass (Default 4):\n'));
    Object.values(NEWS_COMPASS).forEach(p => {
        console.log(`  ${p.icon} ${chalk.bold(p.name)} (${p.direction}) — ${p.keyQuestion}`);
    });

    console.log(chalk.yellow('\n7 Archetypes (108 Total):\n'));
    Object.entries(PERSONA_ARCHETYPES).forEach(([key, arch]) => {
        console.log(`  ${arch.icon} ${chalk.bold(arch.name)} (${arch.count}) — "${arch.question}"`);
    });

    console.log(chalk.green('\nPreset Packs:\n'));
    Object.entries(PRESET_PACKS).forEach(([id, pack]) => {
        console.log(`  ${chalk.bold(id.padEnd(12))} ${pack.name} — ${pack.description}`);
    });

    const custom = loadCustomPersonas();
    if (Object.keys(custom).length > 0) {
        console.log(chalk.magenta('\nCustom Personas:\n'));
        Object.values(custom).forEach(p => {
            console.log(`  ${p.icon || '•'} ${chalk.bold(p.name)} (${p.id})`);
        });
    }
    console.log('');
}

async function personaCreate() {
    printBanner();
    console.log(chalk.bold('\n🎭 Create New Persona\n'));

    const answers = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID (lowercase):', validate: i => /^[a-z0-9_]+$/.test(i) || 'Lowercase only' },
        { type: 'input', name: 'name', message: 'Display name:', validate: i => i.length > 0 || 'Required' },
        { type: 'input', name: 'icon', message: 'Icon emoji:', default: '🎯' },
        { type: 'input', name: 'corePriority', message: 'Core priority:', validate: i => i.length > 0 || 'Required' },
        { type: 'input', name: 'fear', message: 'Fundamental fear:', validate: i => i.length > 0 || 'Required' },
        { type: 'input', name: 'keyQuestion', message: 'Key question:', validate: i => i.length > 0 || 'Required' },
        { type: 'editor', name: 'prompt', message: 'System prompt:' }
    ]);

    savePersona(answers);
    console.log(chalk.green(`\n✓ Persona "${answers.name}" saved\n`));
}

// ============================================
// METHODOLOGY COMMANDS
// ============================================

function showSparkit() {
    printBanner();
    console.log(chalk.bold.cyan('\n📜 The SPARKIT Protocol\n'));
    console.log(formatSparkitQuickRef());
    console.log('\n');
    Object.values(SPARKIT_PROTOCOL).forEach(step => {
        console.log(chalk.bold(`  ${step.letter} — ${step.name}`));
        console.log(chalk.gray(`      ${step.description}\n`));
    });
}

function showSpark() {
    printBanner();
    console.log(chalk.bold.yellow('\n⚡ The SPARK Principles\n'));
    console.log(formatSparkQuickRef());
    console.log('\n');
    Object.values(SPARK_PRINCIPLES).forEach(p => {
        console.log(chalk.bold(`  ${p.letter} — ${p.name}`));
        console.log(chalk.gray(`      When: ${p.timing}`));
        console.log(chalk.white(`      Check: "${p.check}"\n`));
    });
}

function showAspires() {
    printBanner();
    console.log(chalk.bold.green('\n🌟 The ASPIRES Framework\n'));
    console.log(formatAspiresQuickRef());
    console.log('\n');
    Object.values(ASPIRES_FRAMEWORK).forEach(p => {
        console.log(chalk.bold(`  ${p.letter} — ${p.name}`));
        console.log(chalk.gray(`      Use: ${p.use}\n`));
    });
}

function showStatus() {
    printBanner();
    const config = loadConfig();
    const custom = loadCustomPersonas();
    const sessions = listSessions(5);

    console.log(chalk.bold('\n📊 Status\n'));
    console.log(`  Version:         ${VERSION}`);
    console.log(`  Provider:        ${config.provider || chalk.gray('Not configured')}`);
    console.log(`  Model:           ${config.model || chalk.gray('Default')}`);
    console.log(`  Custom Personas: ${Object.keys(custom).length}`);
    console.log(`  Sessions:        ${sessions.length} recent\n`);

    if (sessions.length > 0) {
        console.log(chalk.bold('Recent Sessions:\n'));
        sessions.forEach(s => {
            console.log(`  • ${s.timestamp?.split('T')[0] || 'Unknown'}: ${s.decision?.substring(0, 50) || s.filename}...`);
        });
        console.log('');
    }
}

function debateHistory() {
    printBanner();
    console.log(chalk.bold('\n📜 Session History\n'));
    const sessions = listSessions(20);
    if (sessions.length === 0) {
        console.log(chalk.gray('  No sessions found.\n'));
        return;
    }
    sessions.forEach((s, i) => {
        console.log(`  ${chalk.gray(i + 1 + '.')} ${s.timestamp?.split('T')[0]} — ${s.decision?.substring(0, 55)}...`);
    });
    console.log(chalk.gray(`\n  Sessions: ${SESSIONS_DIR}\n`));
}

// ============================================
// CLI SETUP
// ============================================

const program = new Command();

program
    .name('spar')
    .description('SPAR Kit — Structured Persona-Argumentation for Reasoning')
    .version(VERSION);

// Default: spar [decision]
program
    .argument('[decision]', 'The decision to debate')
    .option('-p, --personas <list>', 'Comma-separated persona IDs')
    .option('-P, --preset <pack>', 'Use persona preset (news, startup, corporate, crisis, innovation, ethics)')
    .option('-i, --interactive', 'Interactive persona selection')
    .action((decision, options) => debateStart(decision, options));

// spar debate
const debate = program.command('debate').description('Debate commands');
debate.command('start [decision]')
    .option('-p, --personas <list>', 'Comma-separated persona IDs')
    .option('-P, --preset <pack>', 'Use persona preset')
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
config.command('setup').description('Interactive setup').action(configSetup);

// Methodology commands
program.command('status').description('Show SPAR Kit status').action(showStatus);
program.command('compass').description('Show NEWS compass').action(() => { printBanner(); printCompass(); });
program.command('sparkit').description('Show SPARKIT 7-step protocol').action(showSparkit);
program.command('spark').description('Show SPARK 5 principles').action(showSpark);
program.command('aspires').description('Show ASPIRES 7 patterns').action(showAspires);

// TUI commands (v3.1+)
program.command('tui')
    .description('Launch interactive Mission Control TUI')
    .action(async () => {
        try {
            const { launchTUI } = await import('./tui/index.js');
            await launchTUI();
        } catch (e) {
            console.log(chalk.yellow('TUI not available. Run: npm install'));
            console.log(chalk.gray('Using classic CLI: sparkit debate start'));
        }
    });

program.command('builder')
    .description('Launch SPAR Builder wizard')
    .action(async () => {
        try {
            const { launchTUI } = await import('./tui/index.js');
            // Note: Builder launches inside TUI
            await launchTUI();
        } catch (e) {
            console.log(chalk.yellow('Builder requires TUI. Run: npm install'));
        }
    });

// Template commands
const template = program.command('template').description('Template management');

template.command('list')
    .description('List all templates')
    .action(async () => {
        const { templateList } = await import('./commands.js');
        templateList();
    });

template.command('show <id>')
    .description('Show template details')
    .action(async (id) => {
        const { templateShow } = await import('./commands.js');
        templateShow(id);
    });

template.command('use <id>')
    .description('Use a template to start debate')
    .action(async (id) => {
        const { templateUse } = await import('./commands.js');
        await templateUse(id);
    });

template.command('create')
    .description('Create a new template')
    .action(async () => {
        const { templateCreate } = await import('./commands.js');
        await templateCreate();
    });

template.command('delete <id>')
    .description('Delete a template')
    .action(async (id) => {
        const { templateDelete } = await import('./commands.js');
        await templateDelete(id);
    });

// Export debateStart for template use
export { debateStart };

program.parse();
