#!/usr/bin/env node

/**
 * SPAR Kit CLI v2.0
 * Run structured AI persona debates from the command line
 * 
 * Usage:
 *   npx spar-kit
 *   npx spar-kit run "Should we expand to Singapore?"
 *   npx spar-kit --provider openai --key sk-xxx
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ============================================
// CONFIGURATION
// ============================================

const VERSION = '2.0.0';
const CONFIG_PATH = join(homedir(), '.spar-kit.json');

// ============================================
// PERSONA DEFINITIONS (N-E-W-S Compass)
// ============================================

const PERSONAS = {
    north: {
        name: 'The Visionary',
        direction: 'North',
        icon: '🔵',
        color: 'blue',
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
        name: 'The Challenger',
        direction: 'East',
        icon: '🟢',
        color: 'green',
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
        name: 'The Pragmatist',
        direction: 'South',
        icon: '🟡',
        color: 'yellow',
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
        name: 'The Sage',
        direction: 'West',
        icon: '🔴',
        color: 'red',
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
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
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
║   🥊  ${chalk.white('S P A R   K I T')}   ${chalk.gray('v' + VERSION)}                                       ║
║                                                                       ║
║   ${chalk.cyan('Four Perspectives, Four Dimensions, One Synthesis')}                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
    `));
    console.log(chalk.italic.gray('   நாலு பேரு, நாலு திசை, ஒரு முடிவு!'));
    console.log(chalk.gray('   "Four people speak in four different ways." — Tamil wisdom\n'));
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
// MAIN SPAR EXECUTION
// ============================================

async function runSpar(decision, options) {
    printBanner();

    const config = loadConfig();
    let provider = options.provider || config.provider;
    let apiKey = options.key || config.apiKey;

    // Interactive setup if missing
    if (!provider || !apiKey) {
        console.log(chalk.yellow('⚙️  First-time setup required\n'));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'provider',
                message: 'Select AI provider:',
                choices: [
                    { name: 'OpenAI (GPT-4 Turbo)', value: 'openai' },
                    { name: 'Anthropic (Claude 3.5 Sonnet)', value: 'anthropic' },
                    { name: 'Google (Gemini 1.5 Flash)', value: 'gemini' }
                ],
                default: provider || 'openai'
            },
            {
                type: 'password',
                name: 'apiKey',
                message: 'Enter your API key:',
                validate: (input) => input.length > 0 || 'API key is required'
            },
            {
                type: 'confirm',
                name: 'save',
                message: 'Save credentials for future use?',
                default: true
            }
        ]);

        provider = answers.provider;
        apiKey = answers.apiKey;

        if (answers.save) {
            saveConfig({ provider, apiKey });
            console.log(chalk.green(`\n✓ Credentials saved to ${CONFIG_PATH}\n`));
        }
    } else {
        console.log(chalk.gray(`   Using: ${provider} | Config: ${CONFIG_PATH}\n`));
    }

    // Get decision if not provided
    if (!decision) {
        const { decisionInput } = await inquirer.prompt([
            {
                type: 'editor',
                name: 'decisionInput',
                message: 'Describe your decision (opens editor):',
            }
        ]);
        decision = decisionInput;
    }

    if (!decision || !decision.trim()) {
        console.log(chalk.red('❌ No decision provided. Exiting.'));
        process.exit(1);
    }

    printCompass();
    printDivider('═', chalk.magenta);
    console.log(chalk.bold('\n📋 THE DECISION:\n'));
    console.log(chalk.white(`   ${decision.split('\n').join('\n   ')}\n`));
    printDivider();

    const userMessage = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;

    // ========================================
    // ROUND 1: Opening Positions
    // ========================================

    console.log(chalk.bold.magenta('\n\n╔══════════════════════════════════════════╗'));
    console.log(chalk.bold.magenta('║   ⚔️  ROUND 1: Opening Positions         ║'));
    console.log(chalk.bold.magenta('╚══════════════════════════════════════════╝\n'));

    const responses = {};
    const directions = ['north', 'east', 'south', 'west'];
    const spinners = {};
    const colorFns = {
        north: chalk.blue,
        east: chalk.green,
        south: chalk.yellow,
        west: chalk.red
    };

    // Start spinners
    for (const dir of directions) {
        const persona = PERSONAS[dir];
        spinners[dir] = ora({
            text: `${persona.icon} ${persona.direction} — ${persona.name}`,
            color: persona.color
        }).start();
    }

    // Run in parallel
    const promises = directions.map(async (dir) => {
        try {
            const response = await callAI(provider, apiKey, PERSONAS[dir].prompt, userMessage);
            responses[dir] = response;
            spinners[dir].succeed();
        } catch (error) {
            responses[dir] = `Error: ${error.message}`;
            spinners[dir].fail();
        }
    });

    await Promise.all(promises);
    console.log('');

    // Print responses
    for (const dir of directions) {
        const persona = PERSONAS[dir];
        const colorFn = colorFns[dir];

        console.log(colorFn(`\n┌${'─'.repeat(68)}┐`));
        console.log(colorFn(`│ ${persona.icon}  ${persona.direction.toUpperCase().padEnd(6)} — ${persona.name.padEnd(55)} │`));
        console.log(colorFn(`└${'─'.repeat(68)}┘`));
        console.log(chalk.white('\n' + responses[dir].split('\n').map(l => '   ' + l).join('\n')));
        console.log('');
    }

    // ========================================
    // ROUND 2: The Clash (Optional)
    // ========================================

    const { runClash } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'runClash',
            message: 'Run Round 2: The Clash? (Personas respond to each other)',
            default: true
        }
    ]);

    let round2Responses = {};
    let synthesis = '';

    if (runClash) {
        console.log(chalk.bold.red('\n\n╔══════════════════════════════════════════╗'));
        console.log(chalk.bold.red('║   🔥 ROUND 2: The Clash                  ║'));
        console.log(chalk.bold.red('╚══════════════════════════════════════════╝\n'));

        const clashPrompt = `The other perspectives said:

NORTH (Visionary): ${responses.north.substring(0, 200)}...

EAST (Challenger): ${responses.east.substring(0, 200)}...

SOUTH (Pragmatist): ${responses.south.substring(0, 200)}...

WEST (Sage): ${responses.west.substring(0, 200)}...

Where do you DISAGREE with them? What are they missing? Be specific, direct, and confrontational. This is a clash of perspectives.`;

        // Start spinners for round 2
        for (const dir of directions) {
            const persona = PERSONAS[dir];
            spinners[dir] = ora({
                text: `${persona.icon} ${persona.direction} responding...`,
                color: persona.color
            }).start();
        }

        const clashPromises = directions.map(async (dir) => {
            try {
                const response = await callAI(provider, apiKey, PERSONAS[dir].prompt, clashPrompt);
                round2Responses[dir] = response;
                spinners[dir].succeed();
            } catch (error) {
                round2Responses[dir] = `Error: ${error.message}`;
                spinners[dir].fail();
            }
        });

        await Promise.all(clashPromises);
        console.log('');

        // Print clash responses
        for (const dir of directions) {
            const persona = PERSONAS[dir];
            const colorFn = colorFns[dir];

            console.log(colorFn(`\n┌${'─'.repeat(68)}┐`));
            console.log(colorFn(`│ ${persona.icon}  ${persona.direction.toUpperCase().padEnd(6)} responds...${' '.repeat(51)} │`));
            console.log(colorFn(`└${'─'.repeat(68)}┘`));
            console.log(chalk.white('\n' + round2Responses[dir].split('\n').map(l => '   ' + l).join('\n')));
            console.log('');
        }

        // ========================================
        // SYNTHESIS
        // ========================================

        console.log(chalk.bold.cyan('\n\n╔══════════════════════════════════════════╗'));
        console.log(chalk.bold.cyan('║   📊 SYNTHESIS                           ║'));
        console.log(chalk.bold.cyan('╚══════════════════════════════════════════╝\n'));

        const synthesisSpinner = ora('Synthesizing the debate...').start();

        try {
            const synthesisPrompt = `You are a neutral MODERATOR synthesizing a SPAR debate.

The decision was: ${decision}

ROUND 1 POSITIONS:
North (Visionary): ${responses.north}
East (Challenger): ${responses.east}
South (Pragmatist): ${responses.south}
West (Sage): ${responses.west}

ROUND 2 - THE CLASH:
North: ${round2Responses.north}
East: ${round2Responses.east}
South: ${round2Responses.south}
West: ${round2Responses.west}

Provide a synthesis:

## 🔥 KEY TENSIONS
Where do they genuinely disagree?

## 🤝 CONVERGENCES  
Where do they unexpectedly agree?

## 💡 INSIGHTS SURFACED
What emerged that wasn't obvious?

## ❓ OPEN QUESTIONS
What remains unresolved?

Be concise but complete.`;

            synthesis = await callAI(provider, apiKey, 'You are a neutral debate moderator.', synthesisPrompt);
            synthesisSpinner.succeed('Synthesis complete');
            console.log(chalk.white('\n' + synthesis));
        } catch (error) {
            synthesisSpinner.fail('Synthesis failed');
            console.log(chalk.red(error.message));
        }
    }

    // ========================================
    // EXPORT
    // ========================================

    printDivider('═', chalk.magenta);

    const { exportSession } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'exportSession',
            message: 'Export this session to Markdown?',
            default: true
        }
    ]);

    if (exportSession) {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString();
        const filename = `spar-session-${date}-${Date.now()}.md`;

        const md = `# SPAR Session

**Date**: ${date} at ${time}
**Provider**: ${provider}
**Method**: SPAR Kit CLI v${VERSION}

---

## 🎯 The Decision

${decision}

---

## ⚔️ Round 1: Opening Positions

### 🔵 North — The Visionary
${responses.north}

### 🟢 East — The Challenger
${responses.east}

### 🟡 South — The Pragmatist
${responses.south}

### 🔴 West — The Sage
${responses.west}

---

## 🔥 Round 2: The Clash

### 🔵 North responds
${round2Responses.north || '_Not run_'}

### 🟢 East responds
${round2Responses.east || '_Not run_'}

### 🟡 South responds
${round2Responses.south || '_Not run_'}

### 🔴 West responds
${round2Responses.west || '_Not run_'}

---

## 📊 Synthesis

${synthesis || '_Not generated_'}

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு!**
> *Four Perspectives, Four Dimensions, One Synthesis*

🥊 Generated by [SPAR Kit](https://github.com/synthanai/spar-kit) | [Web App](https://synthanai.github.io/spar-kit)
`;

        writeFileSync(filename, md);
        console.log(chalk.green(`\n✓ Exported to ${chalk.bold(filename)}`));
    }

    console.log(chalk.bold.magenta('\n\n🥊 Don\'t deliberate alone. SPAR.\n'));
    console.log(chalk.italic.gray('நாலு பேரு, நாலு திசை, ஒரு முடிவு!\n'));
}

// ============================================
// SETUP COMMAND
// ============================================

async function setupCredentials() {
    printBanner();

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
            message: 'Enter your API key:'
        }
    ]);

    saveConfig(answers);
    console.log(chalk.green(`\n✓ Credentials saved to ${CONFIG_PATH}\n`));
}

// ============================================
// HISTORY COMMAND
// ============================================

async function showHistory() {
    printBanner();

    const config = loadConfig();
    console.log(chalk.bold('\n📁 Configuration:\n'));
    console.log(`   Provider: ${config.provider || chalk.gray('Not set')}`);
    console.log(`   API Key: ${config.apiKey ? chalk.green('Saved ✓') : chalk.gray('Not set')}`);
    console.log(`   Config file: ${CONFIG_PATH}`);
    console.log('');

    // Check for recent exports
    const { readdirSync } = await import('fs');
    const files = readdirSync('.').filter(f => f.startsWith('spar-session-'));

    if (files.length > 0) {
        console.log(chalk.bold('\n📝 Recent sessions in current directory:\n'));
        files.slice(-5).forEach(f => console.log(`   • ${f}`));
    }
    console.log('');
}

// ============================================
// CLI SETUP
// ============================================

const program = new Command();

program
    .name('spar')
    .description('SPAR Kit — Run AI persona debates from the command line')
    .version(VERSION);

program
    .command('run [decision]')
    .description('Run a SPAR debate on a decision')
    .option('-p, --provider <provider>', 'AI provider (openai, anthropic, gemini)')
    .option('-k, --key <apiKey>', 'API key')
    .action(runSpar);

program
    .command('setup')
    .description('Configure API credentials')
    .action(setupCredentials);

program
    .command('compass')
    .description('Show the Four Directions compass')
    .action(() => {
        printBanner();
        printCompass();
        console.log(chalk.gray(`
    Natural Tensions:
    • ${chalk.blue('North')} ↔ ${chalk.yellow('South')}: Vision vs. Reality
    • ${chalk.green('East')} ↔ ${chalk.red('West')}: Innovation vs. Tradition

    When all four directions engage, no blind spot survives.
        `));
    });

program
    .command('history')
    .description('Show configuration and recent sessions')
    .action(showHistory);

// Default action (no command)
program
    .action(() => {
        runSpar(null, {});
    });

program.parse();
