/**
 * SPAR-Kit Bias Detection Module
 * 
 * Identifies potential biases in AI outputs and persona responses.
 * Provides warnings and mitigation suggestions.
 */

/**
 * Bias Categories
 */
export const BiasCategories = {
    CONFIRMATION: {
        id: 'confirmation',
        name: 'Confirmation Bias',
        description: 'Favoring information that confirms existing beliefs',
        icon: '🔄'
    },
    AUTHORITY: {
        id: 'authority',
        name: 'Authority Bias',
        description: 'Over-weighting opinions based on perceived authority',
        icon: '👔'
    },
    RECENCY: {
        id: 'recency',
        name: 'Recency Bias',
        description: 'Over-emphasizing recent events or information',
        icon: '⏰'
    },
    ANCHORING: {
        id: 'anchoring',
        name: 'Anchoring Bias',
        description: 'Over-relying on first piece of information received',
        icon: '⚓'
    },
    GROUPTHINK: {
        id: 'groupthink',
        name: 'Groupthink',
        description: 'Convergence without genuine exploration of alternatives',
        icon: '🐑'
    },
    SUNK_COST: {
        id: 'sunk_cost',
        name: 'Sunk Cost Fallacy',
        description: 'Continuing due to past investment rather than future value',
        icon: '💸'
    },
    AVAILABILITY: {
        id: 'availability',
        name: 'Availability Heuristic',
        description: 'Overweighting easily recalled examples',
        icon: '💭'
    },
    OPTIMISM: {
        id: 'optimism',
        name: 'Optimism Bias',
        description: 'Underestimating risks and negative outcomes',
        icon: '🌈'
    },
    PESSIMISM: {
        id: 'pessimism',
        name: 'Pessimism Bias',
        description: 'Overweighting negative outcomes',
        icon: '🌧️'
    }
};

/**
 * Bias Detection Patterns
 */
const biasPatterns = {
    confirmation: [
        /this confirms (that|what|our)/gi,
        /as (we|I) expected/gi,
        /clearly (shows|demonstrates|proves)/gi,
        /obviously/gi,
        /no doubt/gi
    ],
    authority: [
        /experts (say|agree|believe)/gi,
        /according to (the|leading|top)/gi,
        /industry leaders/gi,
        /(harvard|stanford|mit|mckinsey|gartner) (says|recommends|suggests)/gi
    ],
    recency: [
        /recently/gi,
        /just (last|this) (week|month|year)/gi,
        /the latest/gi,
        /current trend/gi,
        /right now/gi
    ],
    anchoring: [
        /starting (point|from)/gi,
        /initially/gi,
        /the first/gi,
        /baseline/gi
    ],
    groupthink: [
        /everyone agrees/gi,
        /unanimous/gi,
        /no one disagrees/gi,
        /we all (think|believe|agree)/gi,
        /obvious choice/gi
    ],
    sunk_cost: [
        /already invested/gi,
        /too far to (stop|turn back)/gi,
        /can't waste/gi,
        /we've come this far/gi
    ],
    availability: [
        /remember when/gi,
        /like (that|the) time/gi,
        /happened before/gi,
        /classic example/gi
    ],
    optimism: [
        /nothing can go wrong/gi,
        /guaranteed success/gi,
        /no downside/gi,
        /risk-free/gi,
        /cannot fail/gi
    ],
    pessimism: [
        /doomed to fail/gi,
        /impossible/gi,
        /never work/gi,
        /catastrophic/gi,
        /disaster waiting/gi
    ]
};

/**
 * Detect biases in text content
 */
export function detectBiases(content) {
    if (!content || typeof content !== 'string') {
        return { biases: [], score: 1.0 };
    }

    const detectedBiases = [];
    const text = content.toLowerCase();

    for (const [biasType, patterns] of Object.entries(biasPatterns)) {
        for (const pattern of patterns) {
            const matches = content.match(pattern);
            if (matches && matches.length > 0) {
                const category = BiasCategories[biasType.toUpperCase()];
                if (category && !detectedBiases.find(b => b.id === biasType)) {
                    detectedBiases.push({
                        ...category,
                        matches: matches,
                        severity: matches.length > 2 ? 'high' : matches.length > 1 ? 'medium' : 'low'
                    });
                }
            }
        }
    }

    // Calculate bias-free score (1.0 = no bias detected, 0.0 = heavily biased)
    const biasScore = Math.max(0, 1 - (detectedBiases.length * 0.15));

    return {
        biases: detectedBiases,
        score: Math.round(biasScore * 100) / 100,
        hasBias: detectedBiases.length > 0
    };
}

/**
 * Analyze persona diversity for groupthink risk
 */
export function analyzePersonaDiversity(personas) {
    if (!personas || personas.length < 2) {
        return { diversity: 0, risk: 'high', message: 'Insufficient perspectives' };
    }

    // Check for archetype diversity (from NEWS compass)
    const archetypes = new Set(personas.map(p => p.archetype || 'unknown'));
    const directions = new Set(personas.map(p => p.direction || 'unknown'));

    const archetypeDiversity = archetypes.size / Math.min(7, personas.length);
    const directionDiversity = directions.size / 4; // NEWS = 4 directions

    const overallDiversity = (archetypeDiversity + directionDiversity) / 2;

    let risk = 'low';
    let message = 'Good perspective diversity';

    if (overallDiversity < 0.3) {
        risk = 'high';
        message = 'Limited diversity — high groupthink risk';
    } else if (overallDiversity < 0.6) {
        risk = 'medium';
        message = 'Moderate diversity — consider adding opposing views';
    }

    return {
        diversity: Math.round(overallDiversity * 100) / 100,
        risk,
        message,
        archetypes: [...archetypes],
        directions: [...directions]
    };
}

/**
 * Generate mitigation suggestions for detected biases
 */
export function getMitigationSuggestions(biases) {
    const suggestions = [];

    for (const bias of biases) {
        switch (bias.id) {
            case 'confirmation':
                suggestions.push({
                    bias: bias.name,
                    action: 'Actively seek disconfirming evidence',
                    prompt: 'What evidence would prove this recommendation WRONG?'
                });
                break;
            case 'authority':
                suggestions.push({
                    bias: bias.name,
                    action: 'Question credentials and conflicts of interest',
                    prompt: 'Do these experts have any incentive to recommend this?'
                });
                break;
            case 'recency':
                suggestions.push({
                    bias: bias.name,
                    action: 'Consider historical patterns and long-term trends',
                    prompt: 'What does the 5-year or 10-year view look like?'
                });
                break;
            case 'groupthink':
                suggestions.push({
                    bias: bias.name,
                    action: 'Introduce a designated devil\'s advocate',
                    prompt: 'If you HAD to argue against this, what would you say?'
                });
                break;
            case 'sunk_cost':
                suggestions.push({
                    bias: bias.name,
                    action: 'Evaluate based on future value only',
                    prompt: 'If starting fresh today, would you still choose this path?'
                });
                break;
            case 'optimism':
                suggestions.push({
                    bias: bias.name,
                    action: 'Conduct pre-mortem analysis',
                    prompt: 'Imagine this failed spectacularly. What went wrong?'
                });
                break;
            case 'pessimism':
                suggestions.push({
                    bias: bias.name,
                    action: 'Identify specific risks vs. general anxiety',
                    prompt: 'What specific, measurable risks concern you most?'
                });
                break;
            default:
                suggestions.push({
                    bias: bias.name,
                    action: 'Seek additional perspectives',
                    prompt: 'Who else should weigh in on this decision?'
                });
        }
    }

    return suggestions;
}

/**
 * Analyze debate for balanced perspective coverage
 */
export function analyzeDebateBalance(positions) {
    if (!positions || positions.length === 0) {
        return { balanced: false, analysis: 'No positions to analyze' };
    }

    // Check for presence of supporting and opposing views
    const supportPatterns = [/support/gi, /agree/gi, /recommend/gi, /should/gi, /must/gi];
    const opposePatterns = [/oppose/gi, /disagree/gi, /shouldn't/gi, /risk/gi, /concern/gi];

    let supportCount = 0;
    let opposeCount = 0;

    for (const pos of positions) {
        const text = pos.content || pos;
        const hasSupport = supportPatterns.some(p => p.test(text));
        const hasOppose = opposePatterns.some(p => p.test(text));

        if (hasSupport) supportCount++;
        if (hasOppose) opposeCount++;
    }

    const total = positions.length;
    const balance = Math.min(supportCount, opposeCount) / Math.max(supportCount, opposeCount, 1);

    return {
        balanced: balance >= 0.5,
        balance: Math.round(balance * 100) / 100,
        supportingViews: supportCount,
        opposingViews: opposeCount,
        analysis: balance >= 0.5
            ? 'Good balance of perspectives'
            : supportCount > opposeCount
                ? 'Debate skews supportive — challenge assumptions'
                : 'Debate skews critical — explore opportunities'
    };
}

/**
 * Full bias analysis for a debate session
 */
export function analyzeSessionBias(session) {
    const results = {
        contentBias: { biases: [], score: 1.0 },
        personaDiversity: { diversity: 0, risk: 'unknown' },
        debateBalance: { balanced: false },
        mitigations: [],
        overallScore: 1.0
    };

    // Analyze synthesis content
    if (session.synthesis?.content) {
        results.contentBias = detectBiases(session.synthesis.content);
        if (results.contentBias.biases.length > 0) {
            results.mitigations = getMitigationSuggestions(results.contentBias.biases);
        }
    }

    // Analyze persona diversity
    if (session.personas) {
        results.personaDiversity = analyzePersonaDiversity(session.personas);
    }

    // Analyze debate balance
    if (session.positions) {
        results.debateBalance = analyzeDebateBalance(session.positions);
    }

    // Calculate overall bias-aware score
    results.overallScore = Math.round(
        (results.contentBias.score * 0.4 +
            results.personaDiversity.diversity * 0.3 +
            (results.debateBalance.balanced ? 1 : 0.5) * 0.3) * 100
    ) / 100;

    return results;
}

export default {
    BiasCategories,
    detectBiases,
    analyzePersonaDiversity,
    getMitigationSuggestions,
    analyzeDebateBalance,
    analyzeSessionBias
};
