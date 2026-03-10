# The 6R Engine (Backstage Cognition)

*A recursive cognitive loop that prevents context drift during deliberation.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

The 6R Engine is a backstage cognitive process that runs implicitly during the RUMBLE phase. It ensures that multi-round debates stay grounded, claims are tracked, and new insights are properly integrated. In user-facing protocols, the 6R is merged into the SPARKIT steps (e.g., Rethink maps to INTERROGATE).

> "The 6R Engine is the methodology's own immune system: it detects drift before it becomes disease."

---

## The Six Stages

| Stage | Action | Question | Maps To |
|-------|--------|----------|---------|
| **Reduce** | Extract atomic claims | "What exactly is being claimed?" | SCOPE refinement |
| **Reflect** | Find supporting evidence | "What evidence backs this claim?" | Knowledge retrieval |
| **Reweave** | Update the relation map | "How does this change the picture?" | ABSTRACT refresh |
| **Recite** | Challenge descriptions | "Can I state this without jargon?" | Clarity check |
| **Review** | Audit for context drift | "Are we still answering the NOOL?" | NOOL alignment |
| **Rethink** | Inject counter-theses | "What would PROBE say about this?" | INTERROGATE prep |

---

## How It Works in Practice

### Round 1 (Reduce & Reflect)

After opening stances, reduce each position to its core claim:

```
REDUCE:
- North claims: [Atomic claim]
- South claims: [Atomic claim]
- East claims: [Atomic claim]
- West claims: [Atomic claim]

REFLECT:
- North's claim is supported by: [Evidence/reasoning]
- South's claim is grounded in: [Evidence/reasoning]
- Ungrounded claims: [Any position without evidence]
```

### Round 2 (Recite & Review)

After the clash, audit for drift:

```
RECITE:
- Can each position be restated without domain jargon? [Yes/No]
- Plain language versions: [...]

REVIEW:
- Original NOOL intent: [...]
- Current debate direction: [...]
- Drift detected: [Yes/No, describe]
- Context cost of drift: [Low/Medium/High]
```

### Round 3 (Reweave & Rethink)

Before final positions, update the shared map and inject challenge:

```
REWEAVE:
- New relations discovered: [e.g., Factor A now BLOCKS Factor C]
- Updated abstraction map: [Delta from original ABSTRACT]

RETHINK (PROBE injection):
- Counter-thesis: "What if the opposite of the emerging consensus is true?"
- Knowledge graph update: [Any new concepts or connections]
```

---

## When the 6R Engine Flags a Problem

| Signal | Meaning | Action |
|--------|---------|--------|
| **Ungrounded claim persists** | A claim has survived 2 rounds without evidence | Flag in KNIT synthesis |
| **NOOL drift > 40%** | Debate has diverged significantly from original intent | PROBE calls "NOOL check" |
| **Relation map changed > 50%** | Original ABSTRACT was wrong or incomplete | Pause for ABSTRACT refresh |
| **Recite fails** | Positions rely on jargon, not substance | Request plain-language restatement |

---

## Integration with Other Components

```
SCOPE → POPULATE → ABSTRACT → ANNOUNCE → RUMBLE ←── 6R Engine runs here
                                              │
                                              ├── Reduce: atomic claims
                                              ├── Reflect: evidence check
                                              ├── Reweave: update map
                                              ├── Recite: clarity check
                                              ├── Review: NOOL alignment
                                              └── Rethink: counter-thesis
                                              │
                                         KNIT ←── Receives 6R annotations
                                              │
                                    INTERROGATE ←── PROBE uses Rethink output
```

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [ABSTRACT.md](./ABSTRACT.md) | [DEPTH_MODES.md](./DEPTH_MODES.md)*
