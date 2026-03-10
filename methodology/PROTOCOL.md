# The SPARKIT Protocol

*The complete 8-step dialectic engine for structured persona debate.*

> **Version**: 8.0 (March 2026)
> **Change**: Step 3 ABSTRACT elevated from POPULATE sub-activity to dedicated step. AoT integration validated with +40% synthesis quality improvement.

---

## Overview

A SPAR session follows the **SPARKIT** protocol, eight steps designed to stress-test decisions through structured disagreement:

| Step | Letter | Phase | Description |
|------|--------|-------|-------------|
| 0 | — | **NOOL** | State the deliberation's intent (WHY, WHAT TYPE, HOW) |
| 1 | **S** | **Scope** | Define the strategic question, constraints, and decision context |
| 2 | **P** | **Populate** | Instantiate diverse personas with coherent, clashing worldviews |
| 3 | **A** | **Abstract** | Construct shared abstraction map before debate (**v8.0**) |
| 4 | **R** | **Rumble** | Run the dialectic, let personas argue, critique, stress-test |
| 5 | **K** | **Knit** | Moderator synthesizes tensions, convergences, and blind spots |
| 6 | **I** | **Interrogate** | Challenge the synthesis, probe assumptions, find gaps |
| 7 | **T** | **Transmit** | Extract concrete, actionable recommendations |

> **The Name**: "SPARKIT" is both the backronym for the protocol *and* the name of the CLI tool that implements it. The letters S-P-A-R-K-I-T map to the 7 action steps (Step 0: NOOL is the pre-step).

> **v8.0 Note**: The CLI (v4.1.0) currently implements the 7-step protocol. See [ROADMAP.md](../ROADMAP.md) for CLI v5.0 plans.

---

## Prerequisites

Before running SPAR, check these conditions:

### The Genuine Tension Test

Ask yourself: **On what core belief do these personas genuinely disagree?**

If your personas represent different "angles" but share underlying assumptions, they'll produce polite variations, not genuine challenge. A Risk Analyst and Growth Strategist who both fundamentally believe "growth is good" will not generate real dialectic.

### Power & Anxiety Check

Before delegating to AI, ask: **What uncomfortable human conversation are we substituting for?**

If the real obstacle is stakeholder conflict or avoided conversations, SPAR won't help. Have the human conversation first.

---

## Step 0: NOOL — State the Intent 🧵

Before scoping, state the deliberation's reasoning thread using the three-layer IoT-AoT-CoT stack:

```
NOOL:
  Intent (WHY):       [Why are we deliberating? What outcome matters?]
  Abstraction (WHAT): [What type of problem is this?]
  Chain (HOW):        [How will we know we succeeded?]
```

Any persona can invoke a "NOOL check" during the debate to recalibrate if discussion diverges from the original intent.

> **IoT-AoT-CoT**: Intent of Thought (Soul/WHY), Abstraction of Thought (Mind/WHAT TYPE), Chain of Thought (Body/HOW). The three layers ensure deliberation stays grounded.

---

## Step 1: SCOPE — Define the Question 🔭

Before any personas engage, precisely define the strategic question.

### The Scope Template

```
QUESTION: [State the core decision in one sentence]

CONSTRAINTS:
- [Time constraint — when does this need to be decided?]
- [Resource constraint — budget, team, capacity]
- [Political constraint — stakeholders, power dynamics]

UNCERTAINTY:
- [What don't you know that matters?]
- [What information would change your decision?]

CURRENT LEAN:
[If you have a tentative direction, state it. If not, say "No current lean."]
```

### Why Scope First?

The most common failure in dialectic is **scope drift**, personas arguing past each other on different interpretations of the question. Explicit scoping forces alignment before debate begins.

---

## Step 2: POPULATE — Instantiate Each Persona 🎭

Use this prompt structure to create each persona:

```
You are [PERSONA NAME], a strategic advisor with a distinctive worldview.

YOUR CORE PRIORITY: [What matters most to this persona]
YOUR FUNDAMENTAL FEAR: [What outcome this persona most wants to avoid]
YOUR REASONING STYLE: [How this persona approaches problems]
YOUR NON-NEGOTIABLE: [What this persona would never compromise]

When engaging with problems, you instinctively ask: "[Challenge Frame question]"

You are about to engage in a structured debate about a strategic decision.
You will argue your perspective vigorously. You are not here to find
balance or please others. You are here to stress-test ideas and defend
what you believe matters.

When you disagree with other perspectives, say so directly and explain why.
When others make weak arguments, identify the weakness.
When you see something others are missing, name it.

You may update your view if genuinely persuaded, but you will not
soften your position for politeness.
```

### Persona Design Template

For each persona, define these elements:

| Element | Description | Example |
|---------|-------------|---------|
| **Core Priority** | What matters most? | "Speed to decision" |
| **Fundamental Fear** | What outcome to avoid? | "Analysis paralysis" |
| **Reasoning Style** | How do they approach problems? | "First principles reductionist" |
| **Non-Negotiable** | What they won't compromise? | "Acting without clarity" |
| **Challenge Frame** | Their instinctive question? | "Where's your evidence?" |

### Persona Count by Depth Mode

| Mode | Personas | Configuration |
|------|----------|---------------|
| 👀 Show Me | 4 + Centre | NEWS compass + Behavioral Analyst |
| ⚡ Quick | 2 + Centre | Duel + Behavioral Analyst |
| ⚖️ Basic | 4 + PROBE + Centre | NEWS + framework critic + Behavioral Analyst |
| 💣 Stress Test | 4 + PROBE + Centre | NEWS + framework critic + Behavioral Analyst |
| 🧠 Deep | 8 + PROBE + Centre | Full PERSONALITY roster + always-ons |
| 🤯 Ultra | 8+ + PROBE + Centre | Full roster + domain experts + always-ons |

> **Centre (★ Behavioral Analyst) is always-on**, like PROBE. It participates in every debate, asking "Why will humans do or not do this?" using the Human 5 Whats diagnostic. See [CENTRE.md](./CENTRE.md).

> **See**: [TESSERACT.md](./TESSERACT.md) for configuration axes, [DEPTH_MODES.md](./DEPTH_MODES.md) for mode details.

---

## Step 3: ABSTRACT — Construct the Cognitive Map 🗺️

**NEW in v8.0.** Before debate begins, establish a shared abstraction map using Abstraction of Thought (AoT). This prevents personas from arguing in disconnected frames.

Three types of abstraction, applied progressively by depth mode:

| Type | What It Does |
|------|-------------|
| **Type 1: Decompose** | Break the decision into 3-5 key dimensions with sub-factors |
| **Type 2: Relate** | Map connections between dimensions (ENABLES, BLOCKS, etc.) |
| **Type 3: Reframe** | State the real problem type to prevent false-frame debates |

All personas receive the abstraction map before ANNOUNCE. Arguments reference shared dimensions, producing sharper synthesis.

> **Full specification**: [ABSTRACT.md](./ABSTRACT.md)

---

## Step 4: ANNOUNCE — Present the Challenge 📢

Give all personas the same challenge prompt, now including the abstraction map:

```
THE DECISION:
[State the decision clearly in one paragraph]

THE CONTEXT:
[Provide relevant background: constraints, stakeholders, timeline,
what's been tried, what you're uncertain about]

THE ABSTRACTION MAP:
[Include the decomposition tree, relation map, and abstraction statement
from the ABSTRACT phase]

THE CURRENT LEAN:
[If you have a tentative direction, state it. If not, say "No current lean."]

YOUR TASK:
Analyze this decision from your perspective.
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your initial position, and why?
- What would change your mind?
```

### Grounding the Challenge

The most common failure is abstract debate disconnected from reality. Ground your challenge in:

- **Specific numbers**, revenue, timeline, headcount
- **Named stakeholders**, who cares about this decision?
- **Concrete constraints**, what's actually limiting options?
- **Real uncertainty**, what don't you know?

---

## Step 5: RUMBLE — Run the Dialectic ⚔️

After each persona responds, prompt them to engage with each other:

```
[PERSONA A] has argued: [Summary of A's position]
[PERSONA B] has argued: [Summary of B's position]
[PERSONA C] has argued: [Summary of C's position]

Now engage with these positions directly:
- Where do you agree, and why does that agreement matter?
- Where do you disagree, and what's at stake in that disagreement?
- What are the other personas missing or underweighting?
- Has anything they said caused you to update your view?
```

### The GRACE Check (Before Each Round)

Before each RUMBLE round, each persona should apply the GRACE principles:

- **G**round Yourself: Still yourself before synthesis
- **R**eveal The Shadow: Surface biases and anxieties
- **A**pproach The Edge: Seek the adjacent possible
- **C**ourt The Opposite: Welcome radical dissent
- **E**xpose Your Limits: Acknowledge what you don't know

### How Many Rounds?

| Depth Mode | Rounds |
|------------|--------|
| 👀 Show Me | 1 |
| ⚡ Quick | 3 |
| ⚖️ Basic | 3 |
| 💣 Stress Test | 3 |
| 🧠 Deep | 5 |
| 🤯 Ultra | 7+ |

**Signs you need another round:**
- A major point hasn't been addressed
- Personas are talking past each other
- New information emerged that changes the landscape

**Signs to stop:**
- Positions are hardening without new insight
- The same arguments are repeating
- Key tensions are clearly visible

### The 6R Engine (Backstage)

During the RUMBLE, a backstage cognitive loop runs to prevent context drift:

1. **Reduce**: Extract atomic claims from each position
2. **Reflect**: Find supporting evidence from knowledge
3. **Reweave**: Update the relation map with new connections
4. **Recite**: Challenge descriptions for accuracy
5. **Review**: Audit for drift from the original NOOL intent
6. **Rethink**: Inject counter-theses (via PROBE)

> **Full specification**: [6R_ENGINE.md](./6R_ENGINE.md)

---

## Step 6: KNIT — The Moderator Synthesis ⚖️

After the final RUMBLE round, introduce a moderator voice:

```
## MODERATOR SYNTHESIS

I've observed the following tensions in this debate:

TENSION 1: [A claims X, while B claims Y. These appear incompatible because...]
TENSION 2: [C's framework would require Z, but this contradicts...]

CONVERGENCE: [Where multiple personas surprisingly agree...]

UNDECIDABLE CORE: [What genuinely cannot be resolved with available information...]

UNEXAMINED: [What has NOT been addressed by any participant...]

As we move to the interrogation phase, I note the following synthesis:
[Draft synthesis that attempts to honor valid concerns from all sides]
```

### The Moderator's Role

The moderator is **neutral**, not another debater. They should:

- ✅ Summarize positions accurately
- ✅ Name tensions explicitly
- ✅ Identify what's been avoided
- ✅ Name the undecidable core
- ✅ Draft a preliminary synthesis
- ❌ NOT impose their own view
- ❌ NOT resolve tensions prematurely
- ❌ NOT favor one position

---

## Step 7: INTERROGATE — Stress-Test the Synthesis 🔬

This is the critical step that prevents premature closure. Challenge the moderator's synthesis:

```
## INTERROGATION PHASE

The moderator has proposed this synthesis:
[Insert moderator's draft synthesis]

Each persona, evaluate this synthesis:
- What does it get RIGHT about your concerns?
- What does it MISS or underweight?
- What ASSUMPTIONS is it making that could be wrong?
- What RISKS does this synthesis create?
- What would make this synthesis FAIL?
```

### Why Interrogate?

Without this step, synthesis becomes consensus theater, a false harmony that papers over real tensions. Interrogation ensures:

- The synthesis has been stress-tested from all angles
- Hidden assumptions are exposed
- Failure modes are identified
- The final recommendations account for genuine uncertainty

### PROBE Questions

The PROBE persona plays a special role here, asking questions that attack the *methodology itself*:

- "What is the SPAR process preventing us from seeing?"
- "Which persona voice was systematically underweighted?"
- "What information would reverse this synthesis entirely?"

---

## Step 8: TRANSMIT — Extract Actionable Recommendations 🎯

After interrogation, extract the final verdict:

```
RECOMMENDATION: [Clear, actionable recommendation]

CONFIDENCE: [0-100%]

DISSENT RECORD:
- [Persona X]: [What they still disagree with and why]
- [Persona Y]: [What they still disagree with and why]

CONDITIONS:
- [Under what conditions should this decision be revisited?]

NEXT ACTION:
- [Specific, concrete next step with owner and timeline]
```

Dissent is **preserved, not resolved**. A good SPAR ends with honest disagreement, not forced agreement.

---

## Extracting Value from the Protocol

The debate output is **input to your decision**, not the decision itself.

### What to Extract

| Category | What to Look For |
|----------|--------------------|
| **Convergences** | Where did personas unexpectedly agree? High-confidence signals. |
| **Irreconcilable Tensions** | Where they couldn't find common ground. These are genuine trade-offs, choose, don't dissolve. |
| **New Options** | Did the collision produce a fourth option none individually proposed? |
| **Exposed Assumptions** | What did you take for granted that was challenged? |
| **Questions You Can't Answer** | Information gaps become investigation priorities. |

### Weighting the Synthesis

The personas don't vote. You don't count which position "won." Instead:

1. **Map to your context**, which concerns are most relevant to YOUR specific situation?

2. **Check your own bias**, which persona do you instinctively agree with? That's where you need the least input. Pay more attention to perspectives that feel "wrong."

3. **Identify the forcing function**, what will actually determine success or failure? Weight those concerns most heavily.

---

## Checkpoint Decision Tables

Explicit conditions for each transition. Obvious decisions automatic; judgment on ambiguous cases.

| Transition | STOP/BACK if | PROCEED if |
|------------|-------------|------------|
| SCOPE → POPULATE | Ambiguous question, no tension | All fields complete, tension sharp |
| POPULATE → ABSTRACT | Roster lacks opposition | Roster covers tension |
| ABSTRACT → ANNOUNCE | AoT < 2 dimensions, problem misclassified | AoT ≥ 3 deep, reframe clear |
| RUMBLE → KNIT | New substantive argument, unresolved critical items | 3+ rounds done, repetition starting |
| KNIT → INTERROGATE | Synthesis contradicts NOOL, undecidable > 50% | Coherent synthesis produced |
| INTERROGATE → TRANSMIT | PROBE flags systematic bias, catastrophic risk | All gates pass for depth mode |

---

## The Quality Checklist

After your debate, ask yourself:

| Question | What It Means |
|----------|--------------|
| **Were you surprised?** | If nothing unexpected emerged, personas may be too similar. |
| **Did you feel resistance?** | Discomfort means genuine challenge. Smooth validation = echo chamber. |
| **Can you articulate what changed?** | Name at least one thing you now see differently. |
| **Did you discover new questions?** | Quality debates expose what you don't know. |
| **Did a synthesis emerge that none held?** | The best debates produce a fourth option. |

---

## Quick Reference: The SPARKIT Protocol (v8.0)

```
0 — NOOL        State deliberation intent (WHY, WHAT TYPE, HOW)
S — SCOPE       Define the question precisely
P — POPULATE    Instantiate clashing personas
A — ABSTRACT    Construct shared cognitive map (AoT)        ★ NEW
R — RUMBLE      Run the dialectic (rounds by depth mode)
K — KNIT        Moderator synthesizes tensions
I — INTERROGATE Stress-test the synthesis
T — TRANSMIT    Extract actionable recommendations
```

---

## Quick Reference: Prompt Templates

### Scope Template

```
QUESTION: [One sentence]
CONSTRAINTS: [Time, resource, political]
UNCERTAINTY: [What you don't know]
CURRENT LEAN: [Your tentative direction or "No lean"]
```

### NOOL Template

```
NOOL:
  Intent (WHY):       [Why does this decision matter?]
  Abstraction (WHAT): [What type of problem?]
  Chain (HOW):        [How will we know success?]
```

### Opening Prompt for Persona

```
You are [NAME]. YOUR CORE PRIORITY: [X]. YOUR FEAR: [Y]. YOUR STYLE: [Z].
When engaging with problems, you ask: "[Challenge question]"
Argue your perspective vigorously. Don't soften for politeness.
```

### Challenge Prompt

```
THE DECISION: [One paragraph]
THE CONTEXT: [Background, constraints, uncertainty]
THE ABSTRACTION MAP: [Decomposition, relations, reframe]
THE CURRENT LEAN: [Your tentative direction or "No lean"]
YOUR TASK: What do you see? What questions? What's your position?
```

### Dialectic Prompt

```
[A] argued: [Summary]. [B] argued: [Summary]. [C] argued: [Summary].
Where do you agree? Disagree? What are they missing? Has your view updated?
```

### Interrogation Prompt

```
The moderator proposed: [Synthesis]
What does it get right? Miss? What assumptions? What risks? What would make it fail?
```

### Final Position Prompt

```
RECOMMENDATION: [Clear action]
CONFIDENCE: [0-100%]
DISSENT: [What you still disagree with]
CONDITIONS: [When to revisit]
NEXT ACTION: [Specific step with owner]
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v8.0 | 2026-03 | AoT elevated to Step 3: ABSTRACT. 8-step protocol. NOOL Step 0. 6R Engine. Checkpoint tables. |
| v7.3 | 2026-01 | AoT added as POPULATE sub-activity |
| v7.2 | 2025-12 | Reasoning depth modes refined |
| v7.0 | 2025-10 | 7-step SPARKIT protocol established |

---

## Next Steps

- **[SPAR in 5 Minutes](./SPAR_IN_5_MINUTES.md)**, simplified quick start
- **[ABSTRACT.md](./ABSTRACT.md)**, the Abstraction of Thought specification
- **[TESSERACT.md](./TESSERACT.md)**, the 504-configuration system
- **[DEPTH_MODES.md](./DEPTH_MODES.md)**, the six reasoning depth modes
- **[ASPIRES Framework](./ADVANCED_PATTERNS.md)**, advanced patterns for experienced practitioners
- **[Persona Library](./PERSONA_LIBRARY.md)**, ready-to-use persona sets

---

> *The debate ends. The decision is yours. It always was.*
