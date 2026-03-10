# Arena Mitosis: Recursive Arena Spawning

*When a debate needs to split, it splits.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

Arena Mitosis allows a parent SPAR debate to spawn autonomous child arenas when the debate encounters scope explosion, depth requirements, or irreconcilable disagreement. Instead of forcing a single arena to handle unbounded complexity, the system divides and conquers.

> "Like cell division in a living organism, Arena Mitosis is how SPAR grows to meet the complexity of the decision."

---

## When to Trigger Mitosis

| Signal | Description |
|--------|-------------|
| **Scope explosion** | ABSTRACT reveals > 5 independent dimensions |
| **Depth requirement** | A sub-question needs its own full SPAR cycle |
| **Disagreement deadlock** | 3+ RUMBLE rounds with no convergence on a key tension |
| **PROBE escalation** | PROBE flags that a sub-topic is distorting the main debate |

---

## Mitosis Modes

| Mode | Verdict Handling | When to Use |
|------|-----------------|-------------|
| **DELEGATED** | Child verdict is trusted, feeds directly into parent KNIT | Low-stakes sub-questions, clear delegation |
| **REVIEWED** | Child outcome triggers a checkpoint for human approval | Medium-stakes, where the sub-verdict matters |
| **ADVISORY** | Child provides context/insights but doesn't dictate the verdict | Exploratory sub-questions, brainstorming |

---

## Structural Rules

### 1. Functional Autonomy
Children reach independent conclusions without parent interference. The parent arena pauses its RUMBLE phase while children execute.

### 2. Memory Isolation
Child debate history (RUMBLE rounds, persona positions) remains separate from the parent to prevent context drift. Only the TRANSMIT output flows back.

### 3. Resource Governance
Children inherit a "Trust Fund" of tokens from the parent:
- **Default allocation**: 25% of parent's remaining token budget
- **Siblings can borrow**: If one child completes under budget, another can use the remainder
- **Maximum depth**: 3 levels of recursion (parent → child → grandchild)

### 4. NOOL Inheritance
Children inherit the parent's NOOL intent but may refine the Abstraction and Chain layers for their specific sub-question.

---

## Mitosis Flow

```
PARENT ARENA
│
├── SCOPE → POPULATE → ABSTRACT → ANNOUNCE → RUMBLE (Round 2)
│                                                │
│                                    PROBE flags: "Dimension C needs
│                                    its own full analysis"
│                                                │
│                                    ┌───── MITOSIS ─────┐
│                                    │                    │
│                               CHILD ARENA A        CHILD ARENA B
│                               (Dimension C)        (Dimension D)
│                                    │                    │
│                               Full SPARKIT          Full SPARKIT
│                               (SCOPE → TRANSMIT)    (SCOPE → TRANSMIT)
│                                    │                    │
│                                    └────── MERGE ───────┘
│                                                │
│                                    Child verdicts fed into
│                                    parent KNIT phase
│
├── KNIT (incorporates child verdicts)
├── INTERROGATE
└── TRANSMIT
```

---

## Notation in TRANSMIT

When a parent arena uses Arena Mitosis, the TRANSMIT output notes:

```
MITOSIS RECORD:
- Child Arena A (Dimension C): [DELEGATED] Verdict: [summary]
- Child Arena B (Dimension D): [ADVISORY] Insight: [summary]
- Token budget used: [parent] + [child A] + [child B] = [total]
```

---

## Constraints

| Rule | Limit |
|------|-------|
| Maximum recursion depth | 3 levels |
| Maximum concurrent children | 4 |
| Minimum token budget for child | 10% of parent's total |
| Child NOOL must reference parent NOOL | Mandatory |

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [DEPTH_MODES.md](./DEPTH_MODES.md) | [LOOP_GOVERNANCE.md](./LOOP_GOVERNANCE.md)*
