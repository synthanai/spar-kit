# Loop Governance

*Rules for preventing infinite debate loops and managing escalation.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

Without governance, multi-round debates can cycle indefinitely. Loop Governance defines hard limits, escalation triggers, and circuit breakers that keep SPAR debates productive.

---

## Hard Limits

| Parameter | Limit | Rationale |
|-----------|-------|-----------|
| Maximum RUMBLE rounds | 7 (Ultra), 5 (Deep), 3 (all others) | Diminishing returns after these thresholds |
| Maximum Arena Mitosis depth | 3 levels | Complexity exceeds human comprehension beyond this |
| Maximum concurrent child arenas | 4 | Token budget fragmentation becomes unmanageable |
| Maximum feedback resolution cycles | 3 per disagreement | Forces disposition after 3 attempts |
| Maximum ABSTRACT iterations (Ultra) | 2 | Recursive abstraction rarely needs more |

---

## Escalation Triggers

When a debate hits a governance boundary:

| Trigger | Condition | Action |
|---------|-----------|--------|
| **Round limit reached** | RUMBLE rounds exhausted | Force KNIT. Unresolved tensions become "Undecidable Core." |
| **No convergence** | 0 convergence points after 3 rounds | PROBE escalation: "Is this the right question?" |
| **Token budget exhausted** | < 10% budget remaining | Emergency KNIT with available positions |
| **Confidence below threshold** | Synthesis confidence < 40% | Flag as low-confidence. Recommend more research. |
| **NOOL drift** | 6R Review detects > 50% drift from original intent | Pause. NOOL check. Decide: reframe or restart. |

---

## Circuit Breakers

Safety mechanisms that halt a debate:

| Breaker | Trigger | Effect |
|---------|---------|--------|
| **Dead Loop** | Same arguments repeated verbatim for 2 rounds | Force KNIT with "positions hardened" note |
| **Scope Explosion** | ABSTRACT tree exceeds depth 3, breadth 7 | Trigger Arena Mitosis or "declare scope too broad" |
| **Token Bankruptcy** | Budget reaches 0 during RUMBLE | Freeze debate. Export current state. Resume later. |
| **Human Override** | Decision-maker says "stop" | Immediate TRANSMIT with current best synthesis |

---

## Checkpoint/Resume

Long debates can be paused and resumed:

```yaml
checkpoint:
  session_id: SPAR-2026-0042
  phase: RUMBLE
  round: 4/7
  personas_active: [north, east, south, west, centre, probe]
  token_budget_remaining: 12,400
  convergences: 3
  open_tensions: 2
  nool_drift: 12%
  saved_at: 2026-03-10T22:45:00Z
```

**Resume rules:**
- All persona positions are restored from the checkpoint
- If > 24 hours have passed, run a NOOL check before continuing
- New information since the checkpoint should be injected as ANNOUNCE addendum

---

## Governance by Depth Mode

| Depth | Max Rounds | Checkpoint? | Arena Mitosis? | Circuit Breakers? |
|-------|-----------|-------------|----------------|-------------------|
| 👀 Show Me | 1 | No | No | No |
| ⚡ Quick | 3 | No | No | Dead Loop only |
| ⚖️ Basic | 3 | Yes | No | Dead Loop + Token |
| 💣 Stress Test | 3 | Yes | Advisory only | All |
| 🧠 Deep | 5 | Yes | All modes | All |
| 🤯 Ultra | 7 | Yes | All modes | All |

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [ARENA_MITOSIS.md](./ARENA_MITOSIS.md) | [FEEDBACK_RESOLUTION.md](./FEEDBACK_RESOLUTION.md)*
