/**
 * SPAR Kit - Debate Configuration v4.0
 * 
 * Production-validated debate architecture:
 * - Staged Token Budgeting (per-phase limits)
 * - Role-Based Model Tiering (Supervisors vs Debaters)
 * - 3-Round Rumble Standard
 * - Checkpoint/Resume Support
 * - Escalation Protocol
 * 
 * @version 4.0.0
 */

// ============================================
// STAGED TOKEN BUDGETING
// ============================================

/**
 * Token limits per debate phase.
 * These are MAX limits - prompts should aim for ~2/3 capacity.
 */
export const TOKEN_BUDGETS = {
    // Rumble Phase (Debaters)
    round1_opening: {
        maxTokens: 1500,
        targetWords: { min: 500, max: 800 },
        promptGuidance: "MAX 1500 tokens. Focus on unique perspective."
    },
    round2_response: {
        maxTokens: 1200,
        targetWords: { min: 400, max: 600 },
        promptGuidance: "MAX 1200 tokens. Be direct, challenge others."
    },
    round3_final: {
        maxTokens: 1000,
        targetWords: { min: 300, max: 500 },
        promptGuidance: "MAX 1000 tokens. Updated position only."
    },

    // Synthesis Phase (Supervisor/Moderator)
    knit_synthesis: {
        maxTokens: 21000,
        targetWords: { min: 1500, max: 3000 },
        promptGuidance: "Exhaustive synthesis. Map all tensions."
    },

    // Interrogation Phase (Debaters)
    interrogate: {
        maxTokens: 1200,
        targetWords: { min: 400, max: 600 },
        promptGuidance: "MAX 1200 tokens. Stress-test the synthesis."
    },

    // Transmit Phase (Supervisor)
    transmit: {
        maxTokens: 3000,
        targetWords: { min: 500, max: 1000 },
        promptGuidance: "Actionable recommendations with conditions."
    }
};

// ============================================
// ROLE-BASED MODEL TIERING
// ============================================

/**
 * Quality tiers for different roles in the debate.
 * Supervisors (Moderator) get deeper reasoning; Debaters get speed.
 */
export const MODEL_TIERS = {
    fast: {
        name: 'Fast',
        description: 'Quick responses, suitable for multiple concurrent debaters',
        icon: '🟢',
        ollamaModel: 'mistral:latest',
        openaiModel: 'gpt-3.5-turbo',
        anthropicModel: 'claude-3-haiku-20240307',
        geminiModel: 'gemini-1.5-flash'
    },
    balanced: {
        name: 'Balanced',
        description: 'Good reasoning depth for important debates',
        icon: '🟡',
        ollamaModel: 'qwen2.5:7b',
        openaiModel: 'gpt-4o-mini',
        anthropicModel: 'claude-3-5-sonnet-20241022',
        geminiModel: 'gemini-1.5-pro'
    },
    high: {
        name: 'High',
        description: 'Deep reasoning for complex debates',
        icon: '🟠',
        ollamaModel: 'deepseek-r1:7b',
        openaiModel: 'gpt-4',
        anthropicModel: 'claude-3-5-sonnet-20241022',
        geminiModel: 'gemini-1.5-pro'
    },
    ultra: {
        name: 'Ultra',
        description: 'Maximum reasoning for synthesis and moderation',
        icon: '🔴',
        ollamaModel: 'deepseek-r1:14b',
        openaiModel: 'gpt-4o',
        anthropicModel: 'claude-3-opus-20240229',
        geminiModel: 'gemini-2.0-flash-thinking-exp'
    }
};

/**
 * Role-to-tier mapping.
 * Debaters get Fast/Balanced; Supervisors get High/Ultra.
 */
export const ROLE_TIERS = {
    debater: {
        defaultTier: 'balanced',
        phases: {
            round1_opening: 'balanced',
            round2_response: 'balanced',
            round3_final: 'balanced',
            interrogate: 'balanced'
        }
    },
    supervisor: {
        defaultTier: 'high',
        phases: {
            knit_synthesis: 'ultra',
            transmit: 'high'
        }
    }
};

// ============================================
// 3-ROUND RUMBLE STANDARD
// ============================================

export const RUMBLE_CONFIG = {
    defaultRounds: 3,
    metaDebateRounds: 5,  // For self-referential/meta debates

    rounds: {
        1: {
            name: 'Opening Statements',
            focus: 'What do you see that others might miss?',
            tokenBudget: TOKEN_BUDGETS.round1_opening
        },
        2: {
            name: 'The Clash',
            focus: 'Where do you agree/disagree? What\'s at stake?',
            tokenBudget: TOKEN_BUDGETS.round2_response
        },
        3: {
            name: 'Final Positions',
            focus: 'Has anything changed your view? Final verdict?',
            tokenBudget: TOKEN_BUDGETS.round3_final
        }
    },

    // Signs to stop early
    earlyStopCriteria: [
        'Positions hardening without new insight',
        'Same arguments repeating',
        'Key tensions clearly visible'
    ],

    // Signs another round is needed
    continueSignals: [
        'Major point hasn\'t been addressed',
        'Personas talking past each other',
        'New information changes landscape'
    ]
};

// ============================================
// DEBATE CONFIGURATION
// ============================================

export const DEFAULT_DEBATE_CONFIG = {
    // Protocol settings
    protocol: 'SPARKIT',
    rumbleRounds: RUMBLE_CONFIG.defaultRounds,

    // Model tiering
    debaterTier: 'balanced',
    supervisorTier: 'high',
    ultrathinkSynthesis: true,  // Use ultra tier for synthesis

    // Token governance
    tokenBudgets: TOKEN_BUDGETS,

    // Context window (for local models)
    contextWindow: 32768,

    // Checkpoint settings
    checkpointEnabled: true,
    checkpointDir: '.spar/checkpoints',

    // Output formatting
    outputFormat: {
        showThinking: true,  // Show reasoning blocks if available
        showTokenCount: false,
        timestampResponses: true
    }
};

// ============================================
// CHECKPOINT RESUME PROTOCOL
// ============================================

export const CHECKPOINT_PHASES = {
    SCOPE: { order: 1, name: 'Scope', completed: false },
    POPULATE: { order: 2, name: 'Populate', completed: false },
    ANNOUNCE: { order: 3, name: 'Announce', completed: false },
    RUMBLE_R1: { order: 4, name: 'Rumble R1', completed: false },
    RUMBLE_R2: { order: 5, name: 'Rumble R2', completed: false },
    RUMBLE_R3: { order: 6, name: 'Rumble R3', completed: false },
    KNIT: { order: 7, name: 'Knit', completed: false },
    INTERROGATE: { order: 8, name: 'Interrogate', completed: false },
    TRANSMIT: { order: 9, name: 'Transmit', completed: false }
};

/**
 * Create a checkpoint object for saving/resuming debates.
 */
export function createCheckpoint(session, phase, metadata = {}) {
    return {
        sessionId: session.id || generateSessionId(),
        phase,
        phaseOrder: CHECKPOINT_PHASES[phase]?.order || 0,
        timestamp: new Date().toISOString(),
        decision: session.decision,
        personas: session.personas,
        responses: session.responses,
        synthesis: session.synthesis,
        interrogation: session.interrogation,
        config: session.config || DEFAULT_DEBATE_CONFIG,
        metadata: {
            ...metadata,
            wasCheckpointed: true
        }
    };
}

/**
 * Determine the next phase to resume from.
 */
export function getNextPhase(checkpoint) {
    const currentOrder = checkpoint.phaseOrder || 0;
    const phases = Object.entries(CHECKPOINT_PHASES)
        .sort((a, b) => a[1].order - b[1].order);

    for (const [key, value] of phases) {
        if (value.order > currentOrder) {
            return key;
        }
    }
    return 'COMPLETE';
}

// ============================================
// ESCALATION PROTOCOL
// ============================================

export const ESCALATION_PROTOCOL = {
    enabled: true,

    // Quality checks that trigger escalation
    checks: {
        wordCountMin: 200,  // Minimum words in response
        completionMarker: true,  // Must have [END OF STATEMENT] or equivalent
        reasoningDepth: true  // Check for substantive arguments
    },

    // Escalation path
    path: ['fast', 'balanced', 'high', 'ultra'],

    // Max retries per tier
    maxRetries: 2
};

/**
 * Determine if a response needs escalation.
 */
export function needsEscalation(response, config = ESCALATION_PROTOCOL) {
    if (!config.enabled) return { escalate: false };

    const wordCount = response.split(/\s+/).length;

    // Check word count
    if (wordCount < config.checks.wordCountMin) {
        return {
            escalate: true,
            reason: `Response too short (${wordCount} words < ${config.checks.wordCountMin})`
        };
    }

    // Check for truncation (missing end marker)
    const hasEndMarker = response.includes('[END') ||
        response.includes('In conclusion') ||
        response.includes('recommendation');

    if (config.checks.completionMarker && !hasEndMarker && wordCount < 400) {
        return {
            escalate: true,
            reason: 'Response may be truncated (no completion marker)'
        };
    }

    return { escalate: false };
}

/**
 * Get the next tier in escalation path.
 */
export function getNextTier(currentTier) {
    const idx = ESCALATION_PROTOCOL.path.indexOf(currentTier);
    if (idx === -1 || idx >= ESCALATION_PROTOCOL.path.length - 1) {
        return null;  // Already at max or unknown tier
    }
    return ESCALATION_PROTOCOL.path[idx + 1];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateSessionId() {
    return `spar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get token budget for a specific phase.
 */
export function getTokenBudget(phase) {
    return TOKEN_BUDGETS[phase] || TOKEN_BUDGETS.round1_opening;
}

/**
 * Get model for a specific role and provider.
 */
export function getModelForRole(role, provider, tier = null) {
    const roleTier = tier || ROLE_TIERS[role]?.defaultTier || 'balanced';
    const tierConfig = MODEL_TIERS[roleTier];

    const providerKey = `${provider}Model`;
    return tierConfig[providerKey] || tierConfig.ollamaModel;
}

/**
 * Format a debate configuration summary.
 */
export function formatConfigSummary(config = DEFAULT_DEBATE_CONFIG) {
    return `
┌─────────────────────────────────────────────────────────────┐
│ SPAR Debate Configuration                                   │
├─────────────────────────────────────────────────────────────┤
│ Rumble Rounds:      ${config.rumbleRounds}                                       │
│ Debater Tier:       ${MODEL_TIERS[config.debaterTier]?.icon} ${config.debaterTier.padEnd(10)}                       │
│ Supervisor Tier:    ${MODEL_TIERS[config.supervisorTier]?.icon} ${config.supervisorTier.padEnd(10)}                       │
│ Ultrathink Synth:   ${config.ultrathinkSynthesis ? '✅ Yes' : '❌ No'}                               │
│ Checkpoint:         ${config.checkpointEnabled ? '✅ Enabled' : '❌ Disabled'}                           │
└─────────────────────────────────────────────────────────────┘`;
}

export default {
    TOKEN_BUDGETS,
    MODEL_TIERS,
    ROLE_TIERS,
    RUMBLE_CONFIG,
    DEFAULT_DEBATE_CONFIG,
    CHECKPOINT_PHASES,
    ESCALATION_PROTOCOL,
    createCheckpoint,
    getNextPhase,
    needsEscalation,
    getNextTier,
    getTokenBudget,
    getModelForRole,
    formatConfigSummary
};
