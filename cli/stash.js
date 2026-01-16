/**
 * STASH Framework - The Five Modes of SPAR
 * Solo Human | Team Human | AI-Persona | Solo AI | Hybrid
 * 
 * MVS (Minimum Viable SPAR) - 30-minute rapid protocol
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import chalk from 'chalk';

// ============================================
// STASH MODES DEFINITION
// ============================================

export const STASH_MODES = {
    'solo-human': {
        id: 'solo-human',
        short: 'sh',
        letter: 'S',
        name: 'Solo Human',
        icon: '🧘',
        description: 'One person inhabits multiple mental frames',
        players: 'One person',
        strengths: 'Always available, private, builds cognitive muscles',
        limitations: 'Limited by your blindspots',
        timing: { min: 30, max: 45, unit: 'min' },
        aiExecutable: false,
        bestFor: ['Personal decisions', 'Deep reflection', 'Self-coaching'],
        technique: 'Chair Technique (physical anchoring)'
    },
    'team-human': {
        id: 'team-human',
        short: 'th',
        letter: 'T',
        name: 'Team Human',
        icon: '👥',
        description: 'Team members embody assigned, mismatched personas',
        players: 'Multiple humans',
        strengths: 'Genuine diversity, psychological safety',
        limitations: 'Coordination costs, politics',
        timing: { min: 45, max: 60, unit: 'min' },
        aiExecutable: false,
        bestFor: ['Team alignment', 'High-stakes decisions', 'Surfacing hidden dissent'],
        technique: 'Mismatch Assignment + Protective Cover'
    },
    'ai-persona': {
        id: 'ai-persona',
        short: 'ap',
        letter: 'A',
        name: 'AI-Persona',
        icon: '🤖',
        description: 'Multiple LLM instances argue with each other',
        players: 'AI as personas (4+ instances)',
        strengths: 'Tireless, fast, no ego, parallel execution',
        limitations: 'One model underneath risks coherence',
        timing: { min: 2, max: 15, unit: 'min' },
        aiExecutable: true,
        bestFor: ['Rapid iteration', '24/7 strategic availability', 'Deep exploration'],
        technique: 'Multi-Agent Decoupling'
    },
    'solo-ai': {
        id: 'solo-ai',
        short: 'sa',
        letter: 'S',
        name: 'Solo AI',
        icon: '⚡',
        description: 'One LLM role-plays multiple personas sequentially',
        players: 'Fully automated (1 instance)',
        strengths: 'Fastest output, minimal setup',
        limitations: 'Maximum abstraction, thin perspectives',
        timing: { min: 2, max: 10, unit: 'min' },
        aiExecutable: true,
        bestFor: ['Quick unblocking', 'Low-stakes exploration', 'Idea generation'],
        technique: 'Sequential Prompting'
    },
    'hybrid': {
        id: 'hybrid',
        short: 'hy',
        letter: 'H',
        name: 'Hybrid',
        icon: '🔮',
        description: 'Mix of AI personas and human participants',
        players: 'Humans + AI',
        strengths: 'Depth plus breadth, augmented wisdom',
        limitations: 'Complex facilitation',
        timing: { min: 30, max: 45, unit: 'min' },
        aiExecutable: 'partial',
        bestFor: ['High-stakes decisions', 'Filling demographic gaps', 'Augmented teams'],
        technique: 'AI Goes First Protocol'
    }
};

// ============================================
// MVS PROTOCOL TIMINGS
// ============================================

export const MVS_PROTOCOL = {
    name: 'Minimum Viable SPAR',
    acronym: 'MVS',
    version: '1.0',
    tagline: 'Four perspectives. Five minutes each. One synthesis.',
    phases: {
        scope: { humanTime: 3, aiTime: 0.5, description: 'Define the question' },
        populate: { humanTime: 2, aiTime: 0.5, description: 'Select/instantiate personas' },
        rumble: { humanTime: 20, aiTime: 5, description: '5 min per cardinal direction' },
        knit: { humanTime: 5, aiTime: 2, description: 'Synthesize tensions' }
    },
    cardinalFour: ['north', 'east', 'south', 'west'],
    totalTime: {
        human: 30,
        ai: 8,
        unit: 'min'
    }
};

// ============================================
// MODE RESOLUTION
// ============================================

/**
 * Resolve mode from string input (full name, short code, or letter)
 */
export function resolveMode(input) {
    if (!input) return null;
    const normalized = input.toLowerCase().trim();

    // Direct match by id
    if (STASH_MODES[normalized]) return STASH_MODES[normalized];

    // Match by short code
    for (const mode of Object.values(STASH_MODES)) {
        if (mode.short === normalized) return mode;
    }

    // Match by letter (ambiguous: S could be Solo Human or Solo AI)
    // Prefer Solo AI for 'S' since it's the fast default
    if (normalized === 's') return STASH_MODES['solo-ai'];
    if (normalized === 't') return STASH_MODES['team-human'];
    if (normalized === 'a') return STASH_MODES['ai-persona'];
    if (normalized === 'h') return STASH_MODES['hybrid'];

    return null;
}

/**
 * Get mode-aware defaults for debate configuration
 */
export function getModeDefaults(mode) {
    const m = typeof mode === 'string' ? resolveMode(mode) : mode;
    if (!m) return null;

    const defaults = {
        mode: m.id,
        modeName: m.name,
        icon: m.icon,
        aiExecutable: m.aiExecutable,
        estimatedTime: m.timing,
        technique: m.technique
    };

    // Mode-specific defaults
    switch (m.id) {
        case 'solo-ai':
            return {
                ...defaults,
                rounds: 1,
                personas: MVS_PROTOCOL.cardinalFour,
                tokenLimit: 'short',
                parallel: false, // Sequential for solo
                maxTokensPerPersona: 500
            };
        case 'ai-persona':
            return {
                ...defaults,
                rounds: 1, // MVS default, can override to 3
                personas: MVS_PROTOCOL.cardinalFour,
                tokenLimit: 'medium',
                parallel: true, // Parallel execution
                maxTokensPerPersona: 800
            };
        case 'solo-human':
            return {
                ...defaults,
                rounds: 1,
                personas: MVS_PROTOCOL.cardinalFour,
                facilitation: true,
                chairTechnique: true
            };
        case 'team-human':
            return {
                ...defaults,
                rounds: 1,
                personas: MVS_PROTOCOL.cardinalFour,
                facilitation: true,
                mismatchAssignment: true
            };
        case 'hybrid':
            return {
                ...defaults,
                rounds: 1,
                personas: MVS_PROTOCOL.cardinalFour,
                humanPersonas: 2,
                aiPersonas: 2,
                aiGoesFirst: true
            };
        default:
            return defaults;
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

/**
 * Format STASH quick reference
 */
export function formatStashQuickRef() {
    return `
┌───────────────────────────────────────────────────────────────────────┐
│  STASH — The Five Modes of SPAR                                       │
├───────┬───────────────┬───────────────────┬───────────────────────────┤
│ Mode  │ Players       │ Timing            │ Best For                  │
├───────┼───────────────┼───────────────────┼───────────────────────────┤
│ 🧘 S  │ Solo Human    │ 30 min            │ Personal reflection       │
│ 👥 T  │ Team Human    │ 45 min            │ Team alignment            │
│ 🤖 A  │ AI-Persona    │ 2-15 min          │ Rapid exploration         │
│ ⚡ S  │ Solo AI       │ 2-10 min          │ Quick unblocking          │
│ 🔮 H  │ Hybrid        │ 30 min            │ Augmented wisdom          │
└───────┴───────────────┴───────────────────┴───────────────────────────┘`;
}

/**
 * Format MVS quick reference
 */
export function formatMvsQuickRef() {
    return `
┌───────────────────────────────────────────────────────────────────────┐
│  MVS — Minimum Viable SPAR (30-Minute Protocol)                       │
├───────────────────────────────────────────────────────────────────────┤
│  "Four perspectives. Five minutes each. One synthesis."               │
├───────────────────────────────────────────────────────────────────────┤
│  PHASE          │ HUMAN TIME    │ AI TIME       │ ACTION              │
├─────────────────┼───────────────┼───────────────┼─────────────────────┤
│  1. SCOPE       │ 3 min         │ 30 sec        │ Define question     │
│  2. POPULATE    │ 2 min         │ 30 sec        │ Cardinal Four       │
│  3. RUMBLE      │ 20 min        │ 1-10 min      │ 5 min/direction     │
│  4. KNIT        │ 5 min         │ 1-3 min       │ Synthesize          │
├─────────────────┼───────────────┼───────────────┼─────────────────────┤
│  TOTAL          │ 30 min        │ 2-15 min      │ 80% decision value  │
└─────────────────┴───────────────┴───────────────┴─────────────────────┘`;
}

/**
 * Show STASH modes in detail
 */
export function showStashModes() {
    console.log(chalk.bold.cyan('\n🏛️  STASH — The Five Modes of SPAR\n'));
    console.log(formatStashQuickRef());
    console.log('\n');

    Object.values(STASH_MODES).forEach(mode => {
        console.log(chalk.bold(`  ${mode.icon} ${mode.name} (--mode ${mode.id} | ${mode.short})`));
        console.log(chalk.gray(`      ${mode.description}`));
        console.log(chalk.white(`      Timing: ${mode.timing.min}-${mode.timing.max} ${mode.timing.unit}`));
        console.log(chalk.green(`      Best for: ${mode.bestFor.join(', ')}`));
        console.log(chalk.yellow(`      Technique: ${mode.technique}\n`));
    });
}

/**
 * Show MVS protocol
 */
export function showMvsProtocol() {
    console.log(chalk.bold.yellow('\n⚡ MVS — Minimum Viable SPAR\n'));
    console.log(formatMvsQuickRef());
    console.log(chalk.italic.gray(`\n   ${MVS_PROTOCOL.tagline}\n`));
}

/**
 * Format facilitation guide for human modes
 */
export function formatFacilitationGuide(mode) {
    const m = typeof mode === 'string' ? resolveMode(mode) : mode;
    if (!m || m.aiExecutable === true) {
        return null; // No facilitation needed for pure AI modes
    }

    let guide = chalk.bold.cyan(`\n📋 Facilitation Guide: ${m.name}\n\n`);

    if (m.id === 'solo-human') {
        guide += chalk.white(`The Chair Technique:\n`);
        guide += chalk.gray(`
              🔵 NORTH (Standing, looking up)
                    │
        🔴 WEST ────┼──── 🟢 EAST
        (Desk)      │     (Whiteboard)
                    │
              🟡 SOUTH (Floor/low stool)
`);
        guide += chalk.white(`\nPhase Script:\n`);
        guide += chalk.gray(`  1. SCOPE (3 min): Write the question on paper\n`);
        guide += chalk.gray(`  2. POPULATE (2 min): Set up 4 physical stations\n`);
        guide += chalk.gray(`  3. RUMBLE (20 min): 5 min per direction, MOVE to each\n`);
        guide += chalk.gray(`  4. KNIT (5 min): Stand in center, synthesize\n`);
        guide += chalk.yellow(`\n💡 Critical Rule: Never stay seated. Physical movement forces perspective shift.\n`);
    } else if (m.id === 'team-human') {
        guide += chalk.white(`Mismatch Assignments:\n`);
        guide += chalk.gray(`  • The Optimist → South (Pragmatist)\n`);
        guide += chalk.gray(`  • The Critic → North (Visionary)\n`);
        guide += chalk.gray(`  • The Detail-Obsessed → East (Explorer)\n`);
        guide += chalk.gray(`  • The Risk-Averse → East (Disruptor)\n`);
        guide += chalk.white(`\nFacilitator Script:\n`);
        guide += chalk.gray(`  "Sarah, you're now the Pragmatist. Your JOB for the next\n`);
        guide += chalk.gray(`   5 minutes is to find everything that could go wrong.\n`);
        guide += chalk.gray(`   No 'buts' — pure critique."\n`);
        guide += chalk.yellow(`\n💡 Protective Cover: "I'm not being negative — it's my assignment."\n`);
    } else if (m.id === 'hybrid') {
        guide += chalk.white(`The "AI Goes First" Protocol:\n`);
        guide += chalk.gray(`  1. AI persona speaks first in each round\n`);
        guide += chalk.gray(`  2. Breaks the ice on difficult truths\n`);
        guide += chalk.gray(`  3. Gives humans "permission" to agree with machine\n`);
        guide += chalk.gray(`  4. Externalizes critique away from any human\n`);
        guide += chalk.white(`\nAugmentation Matrix:\n`);
        guide += chalk.gray(`  • All visionaries? → AI plays Pragmatist\n`);
        guide += chalk.gray(`  • All engineers? → AI plays Explorer\n`);
        guide += chalk.gray(`  • Young team? → AI plays Sage\n`);
        guide += chalk.gray(`  • Homogeneous? → AI plays diverse lens\n`);
    }

    return guide;
}

// ============================================
// MODE SELECTION LOGIC
// ============================================

/**
 * Suggest optimal mode based on context
 */
export function suggestMode(context = {}) {
    const { timeMinutes, stakes, politicalSensitivity, teamSize } = context;

    // Time-based heuristic
    if (timeMinutes && timeMinutes <= 5) {
        return STASH_MODES['solo-ai'];
    }
    if (timeMinutes && timeMinutes <= 15) {
        return STASH_MODES['ai-persona'];
    }

    // Stakes-based
    if (stakes === 'high') {
        if (teamSize && teamSize > 1) {
            return STASH_MODES['hybrid'];
        }
        return STASH_MODES['team-human'];
    }

    // Political sensitivity
    if (politicalSensitivity === 'high') {
        return STASH_MODES['ai-persona']; // Externalize to machine
    }

    // Default to AI-Persona for speed
    return STASH_MODES['ai-persona'];
}

// ============================================
// EXPORTS
// ============================================

export default {
    STASH_MODES,
    MVS_PROTOCOL,
    resolveMode,
    getModeDefaults,
    showStashModes,
    showMvsProtocol,
    formatStashQuickRef,
    formatMvsQuickRef,
    formatFacilitationGuide,
    suggestMode
};
