# The ASPIRES Framework

**7 Advanced Patterns for Deeper Decision-Making**

The ASPIRES framework extends basic SPAR debates with specialized techniques for surfacing hidden assumptions, challenging blind spots, and stress-testing conclusions.

---

## Overview

| Letter | Pattern | Use When |
|--------|---------|----------|
| **A** | Absent Voice | Key stakeholders aren't represented |
| **S** | Steelman | Arguments feel like strawmen |
| **P** | Pre-Mortem | Decision feels too optimistic |
| **I** | Inversion | Confirmation bias is evident |
| **R** | Reflective Meta | Debate feels stuck or circular |
| **E** | Escalation | Debate is too polite/comfortable |
| **S** | Shifted Horizon | Time preferences are hidden |

---

## Pattern Details

### A — Absent Voice

**Purpose**: Include perspectives of those affected but not present in the debate.

**Use When**:
- Decisions affect customers, employees, or communities not in the room
- The debate feels insular or self-referential
- You suspect important stakeholders are being overlooked

**Prompt Template**:
```
You are THE ABSENT VOICE. You represent [customers/employees/partners/
future users/affected communities] who have not been consulted but will
be affected by this decision.

- What would they want considered?
- How might they react to each proposed option?
- What do they know that the decision-makers don't?
```

**Example**: In a pricing decision, invoke the Absent Voice for budget-conscious customers who might churn.

---

### S — Steelman Challenge

**Purpose**: Prevent strawman arguments by forcing genuine understanding of opposing views.

**Use When**:
- Personas are dismissing each other's arguments too easily
- The debate feels adversarial rather than collaborative
- You suspect positions are being mischaracterized

**Prompt Template**:
```
Before responding to [PERSONA B], first demonstrate that you understand
their position by articulating it better than they did. 

What is the STEELMAN version of their argument — the strongest possible 
case for their position?
```

**Example**: Before the Pragmatist dismisses the Visionary, require them to articulate the best case for the ambitious vision.

---

### P — Pre-Mortem Persona

**Purpose**: Engage with failure scenarios before they happen.

**Use When**:
- The decision feels overconfident
- Risk assessment seems superficial
- Everyone agrees too easily

**Prompt Template**:
```
You are THE MORTICIAN. One year from now, this decision has FAILED 
catastrophically. Your job is to reconstruct what went wrong.

- What are the most likely causes of failure?
- Which warnings were ignored?
- What did everyone assume that turned out to be wrong?
```

**Example**: Before committing to a market expansion, run a pre-mortem to identify the top 5 failure scenarios.

---

### I — Inversion Protocol

**Purpose**: Break confirmation bias by forcing personas to argue the opposite of their natural position.

**Use When**:
- Positions feel too predictable
- Confirmation bias is evident
- You want to test the strength of convictions

**Prompt Template**:
```
INVERSION CHALLENGE: For this round, you must argue the OPPOSITE of your 
natural position with full conviction. 

Argue as if this IS your genuine position. No hedging.
```

**Example**: Force the Risk Watcher to argue for bold action, and the Moonshot Advocate to argue for caution.

---

### R — Reflective Meta-Review

**Purpose**: Step back from the content to examine the debate process itself.

**Use When**:
- The debate feels stuck or circular
- Synthesis is proving difficult
- You want a neutral assessment

**Prompt Template**:
```
Step back from your persona. As an objective observer:

- Which arguments in this debate were strongest?
- Which arguments were weakest?
- What would an ideal synthesis look like?
- What did this debate NOT surface that should have been considered?
```

**Example**: After a heated RUMBLE, invoke Reflective Meta to identify which tensions are genuine vs. rhetorical.

---

### E — Escalation Trigger

**Purpose**: Surface hidden tensions that politeness has suppressed.

**Use When**:
- The debate feels too comfortable
- Everyone is agreeing superficially
- You suspect important disagreements are being avoided

**Prompt Template**:
```
ESCALATION TRIGGER: The debate has become too comfortable. 

Each persona must now:
1. Name the ONE thing they've been reluctant to say
2. Identify the assumption they find most problematic
3. State their position in its most uncompromising form

Surface what politeness has suppressed.
```

**Example**: When a hiring debate feels like rubber-stamping, use Escalation to surface genuine reservations.

---

### S — Shifted Horizon

**Purpose**: Reveal hidden time preferences by testing decisions across different timeframes.

**Use When**:
- Time horizon seems assumed rather than chosen
- Short-term and long-term interests may conflict
- You want to stress-test time sensitivity

**Prompt Template**:
```
SHIFTED HORIZON: Answer from three timeframes:

1. IMMEDIATE: What would you recommend if we had to decide TODAY?
2. MEDIUM TERM: What would you recommend if implemented in TWO YEARS?
3. LONG TERM: What would you recommend designing for THE NEXT DECADE?

How does your position change across these horizons?
```

**Example**: A product architecture decision may look very different under 6-month vs 5-year horizons.

---

## Using ASPIRES in a SPAR Session

### Trigger Phrases

| Say This | Activates |
|----------|-----------|
| "Who's not in the room?" | Absent Voice |
| "Steelman that position" | Steelman |
| "Pre-mortem this decision" | Pre-Mortem |
| "Invert your position" | Inversion |
| "Meta-review the debate" | Reflective |
| "Escalate — what are we avoiding?" | Escalation |
| "How does this change over time?" | Shifted Horizon |

### When to Deploy

| Protocol Phase | Recommended Patterns |
|---------------|---------------------|
| **Before RUMBLE** | Absent Voice (ensure all perspectives) |
| **During RUMBLE** | Steelman (prevent strawmen), Inversion (break bias) |
| **If Stuck** | Escalation (surface hidden tensions), Reflective (meta-analyze) |
| **Before KNIT** | Shifted Horizon (test time sensitivity) |
| **Before TRANSMIT** | Pre-Mortem (stress-test recommendation) |

---

## ASPIRES Quick Reference

```
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
└─────────────────────────────────────────────────────────────────────┘
```

---

*Reference: SPAR-Kit v4.0.0 cli/methodology.js*
