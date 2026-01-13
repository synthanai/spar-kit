#!/usr/bin/env node

/**
 * SPAR Kit CLI
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

// Version
const VERSION = '1.0.0';

// Config file path
const CONFIG_PATH = join(homedir(), '.spar-kit.json');

// Persona definitions (N-E-W-S Compass)
const PERSONAS = {
    north: {
        name: 'The Visionary',
        direction: 'North',
        icon: '🔵',
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

// Load config
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

// Save config
function saveConfig(config) {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// API call function
async function callAI(provider, apiKey, systemPrompt, userMessage) {
    const endpoints = {
        openai: 'https://api.openai.com/v1/chat/completions',
        anthropic: 'https://api.anthropic.com/v1/messages',
        gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
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
                model: 'claude-3-sonnet-20240229',
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

// Print banner
function printBanner() {
    console.log(chalk.bold.magenta(`
    ╔═══════════════════════════════════════════════════════════╗
    ║  🥊 ${chalk.white('SPAR Kit')} — Four voices, four directions, one decision  ║
    ╚═══════════════════════════════════════════════════════════╝
    `));
    console.log(chalk.gray('    நாலு பேரு நாலு விதமா பேசுவாங்க'));
    console.log(chalk.gray('    "Four people speak in four different ways."\n'));
}

// Print compass
function printCompass() {
    console.log(chalk.gray(`
                        ${chalk.blue('🔵 NORTH')}
                       The Visionary
                    "Where are we going?"
                             │
                             │
         ${chalk.red('🔴 WEST')} ────────────┼──────────── ${chalk.green('🟢 EAST')}
         The Sage            │            The Challenger
     "What's proven?"        │         "What's emerging?"
                             │
                             │
                        ${chalk.yellow('🟡 SOUTH')}
                      The Pragmatist
                   "What's grounded?"
    `));
}

// Run SPAR command
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
                choices: ['openai', 'anthropic', 'gemini'],
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
    }

    // Get decision if not provided
    if (!decision) {
        const { decisionInput } = await inquirer.prompt([
            {
                type: 'editor',
                name: 'decisionInput',
                message: 'Describe your decision:',
            }
        ]);
        decision = decisionInput;
    }

    if (!decision || !decision.trim()) {
        console.log(chalk.red('❌ No decision provided. Exiting.'));
        process.exit(1);
    }

    printCompass();
    console.log(chalk.bold('\n📋 Decision:\n'));
    console.log(chalk.white(`   ${decision}\n`));
    console.log(chalk.gray('━'.repeat(60)));

    const userMessage = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;

    // Run all personas in parallel
    console.log(chalk.bold('\n⚔️  Round 1: Opening Positions\n'));

    const responses = {};
    const directions = ['north', 'east', 'south', 'west'];
    const spinners = {};

    // Start spinners
    for (const dir of directions) {
        const persona = PERSONAS[dir];
        spinners[dir] = ora({
            text: `${persona.icon} ${persona.direction} — ${persona.name}`,
            color: dir === 'north' ? 'blue' : dir === 'east' ? 'green' : dir === 'south' ? 'yellow' : 'red'
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
        const colorFn = dir === 'north' ? chalk.blue : dir === 'east' ? chalk.green : dir === 'south' ? chalk.yellow : chalk.red;

        console.log(colorFn(`\n${persona.icon} ${persona.direction.toUpperCase()} — ${persona.name}`));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.white(responses[dir]));
    }

    // Generate synthesis
    console.log(chalk.bold('\n\n📊 Synthesis\n'));
    console.log(chalk.gray('─'.repeat(50)));

    const synthesisSpinner = ora('Generating synthesis...').start();

    try {
        const synthesisPrompt = `You are a neutral MODERATOR synthesizing a SPAR debate.

The decision was: ${decision}

POSITIONS:
North (Visionary): ${responses.north}
East (Challenger): ${responses.east}
South (Pragmatist): ${responses.south}
West (Sage): ${responses.west}

Provide a brief synthesis:
1. KEY TENSIONS: Where do they disagree?
2. CONVERGENCES: Where do they agree?
3. INSIGHTS: What emerged that wasn't obvious?
4. OPEN QUESTIONS: What remains unresolved?

Be concise (under 300 words).`;

        const synthesis = await callAI(provider, apiKey, 'You are a neutral debate moderator.', synthesisPrompt);
        synthesisSpinner.succeed('Synthesis complete');
        console.log(chalk.white('\n' + synthesis));
    } catch (error) {
        synthesisSpinner.fail('Synthesis failed');
        console.log(chalk.red(error.message));
    }

    // Export option
    console.log(chalk.gray('\n━'.repeat(60)));

    const { exportSession } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'exportSession',
            message: 'Export this session to Markdown?',
            default: false
        }
    ]);

    if (exportSession) {
        const date = new Date().toISOString().split('T')[0];
        const filename = `spar-session-${date}-${Date.now()}.md`;

        const md = `# SPAR Session

**Date**: ${new Date().toISOString()}
**Provider**: ${provider}

---

## Decision

${decision}

---

## Round 1: Opening Positions

### 🔵 North — The Visionary
${responses.north}

### 🟢 East — The Challenger
${responses.east}

### 🟡 South — The Pragmatist
${responses.south}

### 🔴 West — The Sage
${responses.west}

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு.**
> *Four voices, four directions, one decision.*

Generated by [SPAR Kit](https://github.com/synthanai/spar-kit)
`;

        writeFileSync(filename, md);
        console.log(chalk.green(`\n✓ Exported to ${filename}`));
    }

    console.log(chalk.magenta('\n🥊 Don\'t deliberate alone. SPAR.\n'));
}

// Setup command
async function setupCredentials() {
    printBanner();

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'provider',
            message: 'Select AI provider:',
            choices: ['openai', 'anthropic', 'gemini']
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

// CLI setup
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
    • North ↔ South: Vision vs. Reality
    • East ↔ West: Innovation vs. Tradition

    When all four directions engage, no blind spot survives.
        `));
    });

// Default action (no command)
program
    .action(() => {
        runSpar(null, {});
    });

program.parse();
