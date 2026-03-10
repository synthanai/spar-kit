# Debate Lineage

*Every SPAR has a history. Track the family tree.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

Debate Lineage tracks relationships between SPAR sessions: parent/child (via Arena Mitosis), predecessor/successor (same topic revisited), and citation (one SPAR references another's findings). This creates an auditable decision graph.

---

## Lineage Types

| Type | Relationship | Example |
|------|-------------|---------|
| **PARENT → CHILD** | Arena Mitosis spawned a sub-debate | SPAR-042 spawned SPAR-042a for finance analysis |
| **PREDECESSOR → SUCCESSOR** | Same decision revisited with new information | SPAR-023 (Q1) → SPAR-037 (Q2 revisit) |
| **CITATION** | One SPAR references another's verdict | SPAR-045 cites SPAR-023's finding on market risk |
| **CONTRADICTION** | New SPAR contradicts a previous verdict | SPAR-051 overrides SPAR-023's recommendation |

---

## Lineage Metadata

Each SPAR session stores:

```yaml
lineage:
  session_id: SPAR-2026-0045
  parent: null  # or SPAR-2026-0042 if Arena Mitosis child
  predecessors: [SPAR-2026-0023]
  citations: [SPAR-2026-0037, SPAR-2025-0098]
  contradictions: []
  children: []  # populated if this SPAR spawns children
  topic_hash: "market-expansion-singapore"  # for finding related SPARs
```

---

## When to Record Lineage

| Event | Lineage Action |
|-------|---------------|
| Arena Mitosis triggers | Auto-link parent ↔ child |
| SCOPE references a previous SPAR | Add CITATION link |
| TRANSMIT overrides a previous verdict | Add CONTRADICTION link |
| Same topic revisited (topic_hash match) | Add PREDECESSOR link |

---

## Querying Lineage

Questions you can answer with lineage data:

| Question | Query |
|----------|-------|
| "What did we decide about X last time?" | Find by topic_hash |
| "Has this verdict ever been contradicted?" | Check contradictions list |
| "What sub-debates fed into this decision?" | Traverse children |
| "How has our thinking on X evolved?" | Walk predecessor chain |

---

## Lineage Visualization

```
SPAR-023 (Q1: Should we enter Singapore?)
│
├── CITATION ← SPAR-012 (Market research findings)
│
├── CHILD: SPAR-023a (Finance deep-dive) [DELEGATED]
├── CHILD: SPAR-023b (Regulatory analysis) [REVIEWED]
│
├── SUCCESSOR: SPAR-037 (Q2 revisit with new data)
│   └── CONTRADICTION: Original verdict reversed
│
└── CITATION → SPAR-045 (Referenced in APAC strategy debate)
```

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [ARENA_MITOSIS.md](./ARENA_MITOSIS.md) | [LOOP_GOVERNANCE.md](./LOOP_GOVERNANCE.md)*
