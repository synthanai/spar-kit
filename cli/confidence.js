/**
 * SPAR-Kit Confidence Scoring Module
 * 
 * Provides confidence metrics for AI-generated recommendations based on:
 * - Debate convergence (how much personas agreed)
 * - Evidence quality (data points cited)
 * - Reasoning depth (thinking chain length)
 * - Position stability (final positions vs. opening)
 */

/**
 * Confidence Levels
 */
export const ConfidenceLevels = {
    VERY_HIGH: { min: 0.85, label: 'Very High', icon: '🟢', color: 'green', description: 'Strong consensus with robust reasoning' },
    HIGH: { min: 0.70, label: 'High', icon: '🟢', color: 'green', description: 'Good agreement with solid evidence' },
    MODERATE: { min: 0.50, label: 'Moderate', icon: '🟡', color: 'yellow', description: 'Mixed perspectives, conditional recommendation' },
    LOW: { min: 0.30, label: 'Low', icon: '🟠', color: 'yellow', description: 'Significant disagreement, proceed with caution' },
    VERY_LOW: { min: 0, label: 'Very Low', icon: '🔴', color: 'red', description: 'Insufficient consensus, more analysis needed' }
};

/**
 * Get confidence level from score
 */
export function getConfidenceLevel(score) {
    if (score >= ConfidenceLevels.VERY_HIGH.min) return ConfidenceLevels.VERY_HIGH;
    if (score >= ConfidenceLevels.HIGH.min) return ConfidenceLevels.HIGH;
    if (score >= ConfidenceLevels.MODERATE.min) return ConfidenceLevels.MODERATE;
    if (score >= ConfidenceLevels.LOW.min) return ConfidenceLevels.LOW;
    return ConfidenceLevels.VERY_LOW;
}

/**
 * Calculate convergence score from debate positions
 * Measures how much personas moved toward consensus
 */
export function calculateConvergence(positions) {
    if (!positions || positions.length < 2) return 0.5;

    // Check for explicit agreement statements
    const agreementPhrases = [
        'i agree', 'we agree', 'consensus', 'all agree', 'unanimous',
        'converged', 'aligned', 'in agreement', 'shared view'
    ];

    // Check for disagreement statements
    const disagreementPhrases = [
        'fundamentally disagree', 'cannot agree', 'irreconcilable',
        'deeply divided', 'opposing views', 'no consensus'
    ];

    let agreementScore = 0;
    let totalPositions = positions.length;

    positions.forEach(pos => {
        const text = (pos.content || pos).toLowerCase();
        const hasAgreement = agreementPhrases.some(p => text.includes(p));
        const hasDisagreement = disagreementPhrases.some(p => text.includes(p));

        if (hasAgreement && !hasDisagreement) agreementScore += 1;
        else if (!hasAgreement && hasDisagreement) agreementScore -= 0.5;
        else agreementScore += 0.3; // Neutral
    });

    return Math.max(0, Math.min(1, agreementScore / totalPositions));
}

/**
 * Calculate reasoning depth score from thinking content
 */
export function calculateReasoningDepth(thinkingContent) {
    if (!thinkingContent) return 0.3; // No thinking = baseline

    const wordCount = thinkingContent.split(/\s+/).length;

    // Thinking patterns that indicate depth
    const depthPatterns = [
        /let me (consider|think|analyze|examine)/gi,
        /on the other hand/gi,
        /however,? /gi,
        /alternatively/gi,
        /weighing/gi,
        /trade-off/gi,
        /implications/gi,
        /if we assume/gi,
        /this suggests/gi,
        /therefore/gi
    ];

    let depthScore = 0;
    depthPatterns.forEach(pattern => {
        const matches = thinkingContent.match(pattern);
        if (matches) depthScore += matches.length * 0.05;
    });

    // Word count bonus (deeper thinking = more words)
    const wordBonus = Math.min(0.3, wordCount / 1000);

    return Math.min(1, 0.4 + depthScore + wordBonus);
}

/**
 * Calculate evidence quality score
 */
export function calculateEvidenceQuality(content) {
    if (!content) return 0.3;

    const evidencePatterns = [
        /research (shows|indicates|suggests)/gi,
        /according to/gi,
        /studies (show|indicate|suggest)/gi,
        /data (shows|indicates|suggests)/gi,
        /evidence (shows|indicates|suggests)/gi,
        /for example/gi,
        /specifically,?/gi,
        /\d+%/gi, // Percentages
        /in \d{4}/gi, // Years
        /case study/gi
    ];

    let evidenceScore = 0.3; // Baseline
    evidencePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) evidenceScore += matches.length * 0.05;
    });

    return Math.min(1, evidenceScore);
}

/**
 * Calculate overall confidence score for a synthesis
 */
export function calculateConfidenceScore(synthesis) {
    const {
        positions = [],
        thinking = '',
        content = '',
        convergence: explicitConvergence
    } = synthesis;

    // Individual component scores
    const convergence = explicitConvergence ?? calculateConvergence(positions);
    const reasoningDepth = calculateReasoningDepth(thinking);
    const evidenceQuality = calculateEvidenceQuality(content);

    // Weighted average (convergence matters most for recommendations)
    const weights = {
        convergence: 0.45,
        reasoningDepth: 0.30,
        evidenceQuality: 0.25
    };

    const score =
        convergence * weights.convergence +
        reasoningDepth * weights.reasoningDepth +
        evidenceQuality * weights.evidenceQuality;

    return {
        score: Math.round(score * 100) / 100,
        level: getConfidenceLevel(score),
        breakdown: {
            convergence: Math.round(convergence * 100),
            reasoningDepth: Math.round(reasoningDepth * 100),
            evidenceQuality: Math.round(evidenceQuality * 100)
        }
    };
}

/**
 * Format confidence display for CLI/TUI
 */
export function formatConfidenceDisplay(confidence) {
    const { score, level, breakdown } = confidence;
    const percentage = Math.round(score * 100);

    return {
        summary: `${level.icon} ${percentage}% ${level.label}`,
        description: level.description,
        bar: generateConfidenceBar(score),
        details: [
            `Convergence: ${breakdown.convergence}%`,
            `Reasoning: ${breakdown.reasoningDepth}%`,
            `Evidence: ${breakdown.evidenceQuality}%`
        ]
    };
}

/**
 * Generate visual confidence bar
 */
function generateConfidenceBar(score, width = 20) {
    const filled = Math.round(score * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Add confidence warnings based on score
 */
export function getConfidenceWarnings(confidence) {
    const warnings = [];
    const { score, breakdown } = confidence;

    if (score < 0.5) {
        warnings.push({
            severity: 'high',
            message: 'Low confidence — recommendation should be validated with additional analysis'
        });
    }

    if (breakdown.convergence < 40) {
        warnings.push({
            severity: 'medium',
            message: 'Significant persona disagreement — consider reviewing minority positions'
        });
    }

    if (breakdown.reasoningDepth < 30) {
        warnings.push({
            severity: 'low',
            message: 'Limited reasoning depth — consider using Ultrathink mode for deeper analysis'
        });
    }

    if (breakdown.evidenceQuality < 40) {
        warnings.push({
            severity: 'medium',
            message: 'Low evidence citation — recommendation may benefit from more data'
        });
    }

    return warnings;
}

export default {
    ConfidenceLevels,
    getConfidenceLevel,
    calculateConvergence,
    calculateReasoningDepth,
    calculateEvidenceQuality,
    calculateConfidenceScore,
    formatConfidenceDisplay,
    getConfidenceWarnings
};
