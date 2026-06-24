# Feedback Resolution Protocol

*How to handle disagreements between personas and between the synthesis and reality.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

When personas disagree during RUMBLE, or when a verdict proves wrong in practice, the Feedback Resolution Protocol provides structured escalation and disposition rules, preventing debates from cycling endlessly and ensuring that failed predictions update the system.

---

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| **S1: Cosmetic** | Style/wording disagreement | Resolve in current round |
| **S2: Substantive** | Factual disagreement with evidence | Add RUMBLE round |
| **S3: Structural** | Different problem framing | Return to ABSTRACT |
| **S4: Foundational** | Incompatible values or assumptions | Preserve as dissent |

---

## Disposition Types

| Disposition | Meaning | When |
|-------------|---------|------|
| **RESOLVED** | Tension settled through evidence or synthesis | Agreement reached |
| **PRESERVED** | Genuine disagreement, both positions valid | Record in TRANSMIT dissent |
| **DEFERRED** | Cannot resolve with current information | Queue for future research |
| **ESCALATED** | Exceeds current RAMP level | Upgrade depth mode or add experts |

---

## Resolution Flow

```
Disagreement Detected
│
├── Is it about wording/style? → S1 → RESOLVE in current round
│
├── Is there contrary evidence? → S2 → Add RUMBLE round
│   └── Still unresolved? → PRESERVE as dissent
│
├── Are they framing the problem differently? → S3 → Return to ABSTRACT
│   └── Reframe changes the question? → New SCOPE
│
└── Are their values incompatible? → S4 → PRESERVE as foundational dissent
    └── Identity stakes? → Centre (Behavioral Analyst) mediates
```

---

## Exit Conditions

A feedback loop resolves when ANY of these conditions are met:

| Exit Condition | Description |
|----------------|-------------|
| **Evidence settles it** | One position has materially stronger evidence |
| **3 rounds elapsed** | Maximum rounds for a single feedback cycle |
| **Both sides acknowledged** | Each persona confirms the other's position is understood |
| **PROBE declares undecidable** | The disagreement is genuinely irresolvable with current info |
| **Decision owner intervenes** | Human says "I've heard enough" |

---

## Post-Decision Feedback

When reality proves a verdict wrong:

```
FEEDBACK ENTRY:
  SPAR Reference: [Session ID]
  Verdict: [What was decided]
  Actual Outcome: [What happened]
  Delta: [Where the prediction failed]
  Root Cause: [Which persona's blind spot?]
  Update: [What should change in future SPARs?]
```

This feeds the 6R Engine's REVIEW stage, improving future debates.

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [6R_ENGINE.md](./6R_ENGINE.md) | [LOOP_GOVERNANCE.md](./LOOP_GOVERNANCE.md)*
