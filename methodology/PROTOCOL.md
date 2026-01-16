# The SPARKIT Protocol

*The complete 7-step dialectic engine for structured persona debate.*

---

## Overview

A SPAR session follows the **SPARKIT** protocol — seven steps designed to stress-test decisions through structured disagreement:

| Step | Letter | Phase | Description |
|------|--------|-------|-------------|
| 1 | **S** | **Scope** | Define the strategic question, constraints, and decision context |
| 2 | **P** | **Populate** | Instantiate diverse personas with coherent, clashing worldviews |
| 3 | **A** | **Announce** | Present the challenge equally to all personas |
| 4 | **R** | **Rumble** | Run the dialectic — let personas argue, critique, and stress-test |
| 5 | **K** | **Knit** | Moderator synthesizes tensions, convergences, and blind spots |
| 6 | **I** | **Interrogate** | Challenge the synthesis — probe assumptions, find gaps |
| 7 | **T** | **Transmit** | Extract concrete, actionable recommendations |

> **The Name**: "SPARKIT" is both the backronym for the 7-step process *and* the name of the CLI tool that implements it. *spar-kit* follows the **SPARKIT** protocol.

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

## Step 1: SCOPE — Define the Question

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

The most common failure in dialectic is **scope drift** — personas arguing past each other on different interpretations of the question. Explicit scoping forces alignment before debate begins.

---

## Step 2: POPULATE — Instantiate Each Persona

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

---

## Step 3: ANNOUNCE — Present the Challenge

Give all personas the same challenge prompt:

```
THE DECISION:
[State the decision clearly in one paragraph]

THE CONTEXT:
[Provide relevant background: constraints, stakeholders, timeline,
what's been tried, what you're uncertain about]

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

- **Specific numbers** — Revenue, timeline, headcount
- **Named stakeholders** — Who cares about this decision?
- **Concrete constraints** — What's actually limiting options?
- **Real uncertainty** — What don't you know?

---

## Step 4: RUMBLE — Run the Dialectic

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

### How Many Rounds?

Run 2-3 rounds of engagement. More rounds rarely add value; the key tensions usually surface quickly.

**Signs you need another round:**
- A major point hasn't been addressed
- Personas are talking past each other
- New information emerged that changes the landscape

**Signs to stop:**
- Positions are hardening without new insight
- The same arguments are repeating
- Key tensions are clearly visible

---

## Step 5: KNIT — The Moderator Synthesis

After Round 2, introduce a moderator voice:

```
## MODERATOR SYNTHESIS

I've observed the following tensions in this debate:

TENSION 1: [A claims X, while B claims Y. These appear incompatible because...]
TENSION 2: [C's framework would require Z, but this contradicts...]

CONVERGENCE: [Where multiple personas surprisingly agree...]

UNEXAMINED: [What has NOT been addressed by any participant...]

As we move to the interrogation phase, I note the following synthesis:
[Draft synthesis that attempts to honor valid concerns from all sides]
```

### The Moderator's Role

The moderator is **neutral**, not another debater. They should:

- ✅ Summarize positions accurately
- ✅ Name tensions explicitly
- ✅ Identify what's been avoided
- ✅ Draft a preliminary synthesis
- ❌ NOT impose their own view
- ❌ NOT resolve tensions prematurely
- ❌ NOT favor one position

---

## Step 6: INTERROGATE — Stress-Test the Synthesis

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

Without this step, synthesis becomes consensus theater — a false harmony that papers over real tensions. Interrogation ensures:

- The synthesis has been stress-tested from all angles
- Hidden assumptions are exposed
- Failure modes are identified
- The final recommendations account for genuine uncertainty

---

## Step 7: TRANSMIT — Request Final Positions

After interrogation, request concrete recommendations:

```
The synthesis has been stress-tested. From your perspective:
- What synthesis would you propose that honors the valid concerns raised?
- What would you NOT be willing to compromise, even in synthesis?
- What remains genuinely unresolved that the decision-maker must weigh?
- What is your specific, actionable recommendation?
```

---

## Extracting Value from the Protocol

The debate output is **input to your decision**, not the decision itself.

### What to Extract

| Category | What to Look For |
|----------|-----------------|
| **Convergences** | Where did personas unexpectedly agree? High-confidence signals. |
| **Irreconcilable Tensions** | Where they couldn't find common ground. These are genuine trade-offs — choose, don't dissolve. |
| **New Options** | Did the collision produce a fourth option none individually proposed? |
| **Exposed Assumptions** | What did you take for granted that was challenged? |
| **Questions You Can't Answer** | Information gaps become investigation priorities. |

### Weighting the Synthesis

The personas don't vote. You don't count which position "won." Instead:

1. **Map to your context** — Which concerns are most relevant to YOUR specific situation?

2. **Check your own bias** — Which persona do you instinctively agree with? That's where you need the least input. Pay more attention to perspectives that feel "wrong."

3. **Identify the forcing function** — What will actually determine success or failure? Weight those concerns most heavily.

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

## Quick Reference: The SPARKIT Protocol

```
S — SCOPE      Define the question precisely
P — POPULATE   Instantiate clashing personas
A — ANNOUNCE   Present the challenge equally
R — RUMBLE     Run the dialectic (2-3 rounds)
K — KNIT       Moderator synthesizes tensions
I — INTERROGATE Stress-test the synthesis
T — TRANSMIT   Extract actionable recommendations
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
What synthesis honors all valid concerns?
What won't you compromise?
What's unresolved?
What's your specific recommendation?
```

---

## Next Steps

- **[SPAR in 5 Minutes](./SPAR_IN_5_MINUTES.md)** — Simplified quick start
- **[ASPIRES Framework](./ADVANCED_PATTERNS.md)** — 7 advanced patterns for experienced practitioners
- **[Persona Library](./PERSONA_LIBRARY.md)** — Ready-to-use persona sets
- **[Example Session](../examples/strategic_expansion.md)** — Full walkthrough

---

> *The debate ends. The decision is yours. It always was.*
