# Step 3: ABSTRACT — Abstraction of Thought (AoT)

*Construct a cognitive map before deliberation begins.*

> **Version**: 2.0 (Protocol v8.0)
> **Inspired by**: Benny Cheung's "[Abstraction of Thought Makes AI Better Reasoners](https://bennycheung.github.io/abstraction-of-thought-makes-ai-better-reasoners)"

---

## Why ABSTRACT?

Humans think in abstractions: we decompose complexity into diagrams, mental maps, and conceptual relationships before processing details. LLMs default to linear, left-to-right token generation. ABSTRACT forces structured abstraction *before* detailed reasoning, improving synthesis quality by ~40% in validated experiments.

> "Abstraction is the GPS for cognition: it answers 'Where am I?' and 'Where do I want to go?' BEFORE calculating the route."

---

## Position in the 8-Step Protocol

```
1. SCOPE → 2. POPULATE → ★ 3. ABSTRACT → 4. ANNOUNCE → 5. RUMBLE → 6. KNIT → 7. INTERROGATE → 8. TRANSMIT
```

ABSTRACT sits between POPULATE and ANNOUNCE. Personas are selected but have not yet begun debating. The abstraction map gives all participants a shared cognitive scaffold.

---

## The Three Types

### Type 1: Problem Decomposition

Break the decision into 3-5 key dimensions with sub-factors:

```
DECISION: "Should we pivot from B2B to B2C?"

DECOMPOSITION:
├── Revenue implications
│   ├── Current B2B revenue at risk
│   └── Projected B2C revenue potential
├── Capability implications
│   ├── Skills we have
│   └── Skills we'd need
├── Timeline implications
│   ├── Runway remaining
│   └── Time to B2C traction
└── Identity implications
    ├── Brand perception shift
    └── Team culture impact
```

**Constraints**: Max 4 branches, 2 levels deep. Broader is better than deeper.

### Type 2: Relational Structure

Map the connections between dimensions:

```
    Revenue ──────→ Timeline
       │              │
       ▼              ▼
  Capability ←───→ Identity
```

**Relation types**:
- `ENABLES` / `BLOCKS`
- `CONTRADICTS` / `SUPPORTS`
- `REQUIRES` / `UNLOCKS`
- `AMPLIFIES` / `DAMPENS`

**Constraints**: Max 6 edges. Name each relation type explicitly.

### Type 3: Abstraction Statement

Reframe the problem to prevent false-frame debates:

> "This is a **[PROBLEM TYPE]** decision, not a **[FALSE FRAME]** decision."
> "The real question is: **[REFRAME]**."

**Problem types**: `SEQUENCING` | `TRADEOFF` | `RESOURCE_ALLOCATION` | `ROOT_CAUSE` | `DESIGN` | `PREDICTION`

---

## Example ABSTRACT Output

```yaml
decision: "Should we adopt Kubernetes for our infrastructure?"

decomposition:
  - branch: Technical Fit
    leaves: [Current stack compatibility, Team expertise, Migration effort]
  - branch: Business Value
    leaves: [Scalability needs, Cost impact, Time to value]
  - branch: Risk Profile
    leaves: [Operational complexity, Vendor lock-in, Security posture]
  - branch: Strategic Alignment
    leaves: [Cloud-native vision, Hiring implications, Partner ecosystem]

relations:
  - Technical Fit → Risk Profile (complexity)
  - Business Value ↔ Technical Fit (ROI)
  - Strategic Alignment → Business Value (justification)
  - Risk Profile → Strategic Alignment (constraints)

abstraction_level: "Infrastructure platform selection (not implementation details)"

abstraction_statement: >
  This is a DESIGN decision, not a RESOURCE_ALLOCATION decision.
  The real question is: Does Kubernetes align with our 3-year infrastructure vision,
  or are we solving a scaling problem that doesn't exist yet?
```

---

## When to Use AoT

| Depth Mode | AoT Required? | Types Applied |
|------------|---------------|---------------|
| 👀 Show Me | ❌ No | Skip |
| ⚡ Quick | 🟡 Optional | Type 1 only |
| ⚖️ Basic | ✅ Yes | Types 1-2 |
| 💣 Stress Test | ✅ Yes | Types 1-3 |
| 🧠 Deep | ✅ Yes | Types 1-3, multi-level |
| 🤯 Ultra | ✅ Yes | Full + recursive iteration |

---

## How It Changes the Debate

**Without ABSTRACT**: Personas argue from their own frames. North talks vision, South talks constraints, but they never share a map. The debate feels productive but misses structural connections.

**With ABSTRACT**: All personas receive the decomposition tree and relation map. Arguments reference shared dimensions. Clashes happen at the *relation* level ("You say Revenue ENABLES Timeline, I say it BLOCKS it"), producing sharper, more actionable synthesis.

---

## Quick Reference

```
ABSTRACT Phase Checklist:
[ ] Decomposition tree: 3-5 branches, max 2 levels
[ ] Relation map: max 6 edges, named types
[ ] Abstraction statement: problem type + reframe
[ ] All personas receive the map before ANNOUNCE
```

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [DEPTH_MODES.md](./DEPTH_MODES.md) | [TESSERACT.md](./TESSERACT.md)*
