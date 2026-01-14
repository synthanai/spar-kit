/**
 * SPAR Kit - Methodology Module v3.0
 * SPARKIT Protocol, SPARK Principles, ASPIRES Framework
 */

// =============================================================================
// SPARKIT PROTOCOL (7 Steps)
// =============================================================================

export const SPARKIT_PROTOCOL = {
    S: {
        step: 1, letter: 'S', name: 'SCOPE',
        description: 'Define the strategic question, constraints, and decision context',
        prompt: `Before debating, let's define the scope:

QUESTION: [State the core decision in one sentence]

CONSTRAINTS:
- Time: When must this be decided?
- Resources: Budget, team, capacity limits
- Political: Stakeholders, power dynamics

UNCERTAINTY:
- What don't we know that matters?
- What information would change the decision?

CURRENT LEAN: [Tentative direction, or "No current lean"]`
    },
    P: {
        step: 2, letter: 'P', name: 'POPULATE',
        description: 'Instantiate diverse personas with coherent, clashing worldviews',
        prompt: `Instantiate each persona with:

You are [PERSONA NAME], a strategic advisor with a distinctive worldview.

YOUR CORE PRIORITY: [What matters most to this persona]
YOUR FUNDAMENTAL FEAR: [What outcome this persona most wants to avoid]
YOUR REASONING STYLE: [How this persona approaches problems]

When engaging with problems, you instinctively ask: "[Challenge Frame question]"

You will argue your perspective vigorously. You are not here to find balance.
When you disagree, say so directly and explain why.`
    },
    A: {
        step: 3, letter: 'A', name: 'ANNOUNCE',
        description: 'Present the challenge equally to all personas',
        prompt: `THE DECISION:
[State the decision clearly in one paragraph]

THE CONTEXT:
[Background: constraints, stakeholders, timeline, what's been tried, uncertainties]

THE CURRENT LEAN:
[Tentative direction, or "No current lean"]

YOUR TASK:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your initial position, and why?
- What would change your mind?`
    },
    R: {
        step: 4, letter: 'R', name: 'RUMBLE',
        description: 'Run the dialectic — let personas argue, critique, and stress-test',
        prompt: `[PERSONA A] has argued: [Summary of position]
[PERSONA B] has argued: [Summary of position]
[PERSONA C] has argued: [Summary of position]

Now engage with these positions directly:
- Where do you agree, and why does that agreement matter?
- Where do you disagree, and what's at stake in that disagreement?
- What are the other personas missing or underweighting?
- Has anything they said caused you to update your view?`
    },
    K: {
        step: 5, letter: 'K', name: 'KNIT',
        description: 'Moderator synthesizes tensions, convergences, and blind spots',
        prompt: `## MODERATOR SYNTHESIS

I've observed the following tensions in this debate:

TENSION 1: [A claims X, while B claims Y. These appear incompatible because...]
TENSION 2: [C's framework would require Z, but this contradicts...]

CONVERGENCE: [Where multiple personas surprisingly agree...]

UNEXAMINED: [What has NOT been addressed by any participant...]

DRAFT SYNTHESIS: [Attempt to honor valid concerns from all sides]`
    },
    I: {
        step: 6, letter: 'I', name: 'INTERROGATE',
        description: 'Stress-test the synthesis — probe assumptions, find gaps',
        prompt: `## INTERROGATION PHASE

The moderator has proposed this synthesis:
[Insert moderator's draft synthesis]

Each persona, evaluate this synthesis:
- What does it get RIGHT about your concerns?
- What does it MISS or underweight?
- What ASSUMPTIONS is it making that could be wrong?
- What RISKS does this synthesis create?
- What would make this synthesis FAIL?`
    },
    T: {
        step: 7, letter: 'T', name: 'TRANSMIT',
        description: 'Extract concrete, actionable recommendations',
        prompt: `The synthesis has been stress-tested. From your perspective:
- What synthesis would you propose that honors the valid concerns raised?
- What would you NOT be willing to compromise, even in synthesis?
- What remains genuinely unresolved that the decision-maker must weigh?
- What is your specific, actionable recommendation?`
    }
};

// =============================================================================
// SPARK PRINCIPLES (5 Non-Negotiables)
// =============================================================================

export const SPARK_PRINCIPLES = {
    S: {
        letter: 'S', name: 'Stillness Before Synthesis',
        question: 'Have we paused before acting?',
        description: 'Build pauses into the urgency of action.',
        timing: 'After Debate',
        check: "What surprised us? What are we not ready to decide?",
        warning: 'Immediately moving to action items without pause'
    },
    P: {
        letter: 'P', name: 'Power & Anxiety Honesty',
        question: 'What human conversation are we avoiding?',
        description: 'Address human tensions before delegating to process.',
        timing: 'Before SPAR',
        check: 'What uncomfortable human conversation are we substituting for?',
        warning: 'The SPAR feels "safe" because it avoids naming the real tension'
    },
    A: {
        letter: 'A', name: 'Adjacent Possible',
        question: 'What feels too radical to consider?',
        description: 'Force consideration of options that feel "too far."',
        timing: 'During SPAR',
        check: 'What option feels too radical to consider seriously?',
        warning: 'All options feel like variations on the status quo'
    },
    R: {
        letter: 'R', name: 'Radical Dissent',
        question: 'Is the contrarian voice protected?',
        description: 'Protect the contrarian voice structurally.',
        timing: 'During SPAR',
        check: "What's the strongest case against what we're about to decide?",
        warning: 'Everyone agrees enthusiastically. No one is uncomfortable.'
    },
    K: {
        letter: 'K', name: 'Knowing Transparency',
        question: 'From whose perspective is this conclusion drawn?',
        description: 'Acknowledge the perspective from which every conclusion is drawn.',
        timing: 'After Synthesis',
        check: 'What did we NOT consider? What perspectives were missing?',
        warning: 'The synthesis claims objectivity. It sounds like "the answer."'
    }
};

// =============================================================================
// ASPIRES FRAMEWORK (7 Advanced Patterns)
// =============================================================================

export const ASPIRES_FRAMEWORK = {
    A: {
        letter: 'A', name: 'Absent Voice',
        use: 'Including perspectives not at the table',
        prompt: `You are THE ABSENT VOICE. You represent [customers/employees/partners/
future users/affected communities] who have not been consulted but will
be affected by this decision.

- What would they want considered?
- How might they react to each proposed option?
- What do they know that the decision-makers don't?`
    },
    S1: {
        letter: 'S', name: 'Steelman Challenge',
        use: 'Preventing strawman arguments',
        prompt: `Before responding to [PERSONA B], first demonstrate that you understand
their position by articulating it better than they did. What is the
steelman version of their argument?`
    },
    P: {
        letter: 'P', name: 'Pre-Mortem Persona',
        use: 'Engaging with downside scenarios',
        prompt: `You are THE MORTICIAN. One year from now, this decision has FAILED 
catastrophically. Your job is to reconstruct what went wrong.

- What are the most likely causes of failure?
- Which warnings were ignored?
- What did everyone assume that turned out to be wrong?`
    },
    I: {
        letter: 'I', name: 'Inversion Protocol',
        use: 'Breaking confirmation bias',
        prompt: `INVERSION CHALLENGE: For this round, you must argue the OPPOSITE of your 
natural position with full conviction. 

Argue as if this IS your genuine position. No hedging.`
    },
    R: {
        letter: 'R', name: 'Reflective Meta-Review',
        use: 'Capturing process-level insights',
        prompt: `Step back from your persona. As an objective observer:
- Which arguments in this debate were strongest?
- Which arguments were weakest?
- What would an ideal synthesis look like?
- What did this debate NOT surface that should have been considered?`
    },
    E: {
        letter: 'E', name: 'Escalation Trigger',
        use: 'Surfacing hidden tensions',
        prompt: `ESCALATION TRIGGER: The debate has become too comfortable. 

Each persona must now:
1. Name the ONE thing they've been reluctant to say
2. Identify the assumption they find most problematic
3. State their position in its most uncompromising form

Surface what politeness has suppressed.`
    },
    S2: {
        letter: 'S', name: 'Shifted Horizon',
        use: 'Revealing hidden time preferences',
        prompts: {
            immediate: 'What would you recommend if we had to decide TODAY?',
            medium: 'What would you recommend if implemented IN TWO YEARS?',
            long: 'What would you recommend designing for THE NEXT DECADE?'
        }
    }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get SPARKIT step by letter or number
 */
export function getSparkitStep(key) {
    if (typeof key === 'number') {
        return Object.values(SPARKIT_PROTOCOL).find(s => s.step === key);
    }
    return SPARKIT_PROTOCOL[key.toUpperCase()];
}

/**
 * Get all SPARKIT steps in order
 */
export function getSparkitSequence() {
    return ['S', 'P', 'A', 'R', 'K', 'I', 'T'].map(l => SPARKIT_PROTOCOL[l]);
}

/**
 * Get SPARK principle by letter
 */
export function getSparkPrinciple(letter) {
    return SPARK_PRINCIPLES[letter.toUpperCase()];
}

/**
 * Get ASPIRES pattern by letter
 */
export function getAspiresPattern(letter) {
    return ASPIRES_FRAMEWORK[letter.toUpperCase()] ||
        ASPIRES_FRAMEWORK[letter.toUpperCase() + '1'] ||
        ASPIRES_FRAMEWORK[letter.toUpperCase() + '2'];
}

/**
 * Format SPARKIT quick reference
 */
export function formatSparkitQuickRef() {
    return `
┌─────────────────────────────────────────────────────────────────────┐
│                        S P A R K I T                                │
├─────────────────────────────────────────────────────────────────────┤
│  S  │ SCOPE       │ Define the question precisely                   │
│  P  │ POPULATE    │ Instantiate clashing personas                   │
│  A  │ ANNOUNCE    │ Present the challenge equally                   │
│  R  │ RUMBLE      │ Run the dialectic (2-3 rounds)                  │
│  K  │ KNIT        │ Moderator synthesizes tensions                  │
│  I  │ INTERROGATE │ Stress-test the synthesis                       │
│  T  │ TRANSMIT    │ Extract actionable recommendations              │
└─────────────────────────────────────────────────────────────────────┘`;
}

/**
 * Format SPARK quick reference
 */
export function formatSparkQuickRef() {
    return `
┌─────────────────────────────────────────────────────────────────────┐
│                           S P A R K                                 │
├─────────────────────────────────────────────────────────────────────┤
│  S  │ STILLNESS           │ Have we paused before acting?          │
│  P  │ POWER HONESTY       │ What conversation are we avoiding?     │
│  A  │ ADJACENT POSSIBLE   │ What feels too radical to consider?    │
│  R  │ RADICAL DISSENT     │ Is the contrarian voice protected?     │
│  K  │ KNOWING TRANSPARENCY│ From whose perspective?                │
└─────────────────────────────────────────────────────────────────────┘`;
}

/**
 * Format ASPIRES quick reference
 */
export function formatAspiresQuickRef() {
    return `
┌─────────────────────────────────────────────────────────────────────┐
│                         A S P I R E S                               │
├─────────────────────────────────────────────────────────────────────┤
│  A  │ ABSENT VOICE      │ Whose perspective is missing?            │
│  S  │ STEELMAN          │ Can I argue your position better?        │
│  P  │ PRE-MORTEM        │ How will this fail catastrophically?     │
│  I  │ INVERSION         │ Can I argue the opposite with conviction?│
│  R  │ REFLECTIVE META   │ What did the process itself reveal?      │
│  E  │ ESCALATION        │ What are we too polite to say?           │
│  S  │ SHIFTED HORIZON   │ How does this change over time?          │
└─────────────────────────────────────────────────────────────────────┘`;
}

export default {
    SPARKIT_PROTOCOL,
    SPARK_PRINCIPLES,
    ASPIRES_FRAMEWORK,
    getSparkitStep,
    getSparkitSequence,
    getSparkPrinciple,
    getAspiresPattern,
    formatSparkitQuickRef,
    formatSparkQuickRef,
    formatAspiresQuickRef
};
