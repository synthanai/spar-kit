# TESSERACT Configuration

*504 possible configurations for SPAR debates. Four axes, each independently selectable.*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

TESSERACT is the configuration system for SPAR debates. By combining four independent axes (Depth, Pattern, Style, Horizon), practitioners can tune the debate format to match the decision context. The total configuration space is 3 × 6 × 7 × 4 = **504 unique combinations**.

Most users never touch TESSERACT directly. The 5 presets cover 90% of use cases.

---

## The Four Axes

### 1. Depth — How many voices?

Controls the number and diversity of personas in the arena.

| Setting | Agents | Description |
|---------|--------|-------------|
| `clash` *(default, minimum)* | 4 + PROBE | NEWS compass (North, East, South, West) + framework critic. |
| `rumble` | 8+ | Full PERSONALITY roster + PROBE. Strategic pivots. |
| `domain` | 4+N | Clash + domain/MBS/governance experts. |

### 2. Pattern — How do they interact?

Determines the conversation structure between personas.

| Pattern | Description | Cultural Alias |
|---------|-------------|----------------|
| `sequential` | Each speaks in turn, building on previous | Circle, Ubuntu |
| `freeflow` | Unstructured, interrupt-driven | — |
| `binary` | Two sides, structured clash | Oxford |
| `dialectic` *(default)* | Thesis-antithesis-synthesis cycle | Lincoln |
| `inquisition` | One defends, others attack | Scholastic |
| `emergence` | Consensus-seeking through iterative refinement | Nemawashi |

### 3. Style — What's the tone?

Sets the argumentative posture of the debate.

| Style | Description |
|-------|-------------|
| `balanced` *(default)* | Even-handed exploration |
| `adversarial` | Attack the position. Find weaknesses. |
| `steelman` | Each persona must strengthen the opposing argument before attacking |
| `consensus` | Build agreement progressively |
| `premortem` | Assume the decision failed. Work backwards to find why. |
| `escalation` | Start mild, increase pressure each round |
| `inversion` | Argue the opposite of what you believe |

### 4. Horizon — What timeframe?

Anchors the debate to a specific temporal lens.

| Horizon | Timeframe | Question |
|---------|-----------|----------|
| `now` | Days to weeks | "What do we do Monday?" |
| `cycle` *(default)* | Quarter to year | "What's the right call this cycle?" |
| `legacy` | Multi-year | "How does this look in 5 years?" |
| `shifted` | Radically different future | "If everything changed, would this still hold?" |

### 5. Width — How deep per response? *(token-based SPARs only)*

Controls the token budget per persona per round. Applies only to LLM-executed SPARs, not human facilitation.

| Width | Tokens/response | Use Case |
|-------|----------------|----------|
| `quick` | ~200-400 | Fast signal, rapid iteration. Headlines only. |
| `standard` *(default)* | ~600-1000 | Balanced depth. Evidence + reasoning. |
| `ultra` | ~1500-2500 | Full analysis. Citations, worked examples, deep chains. |

> **Note:** Width does not multiply the 504 base configurations. It is a runtime parameter, not a design axis. The 504 count (3 × 6 × 7 × 4) covers the four design axes: Depth × Pattern × Style × Horizon.

---

## Presets

Presets are curated TESSERACT configurations for common scenarios.

| Preset | Depth | Pattern | Style | Horizon | Width | Use Case |
|--------|-------|---------|-------|---------|-------|----------|
| *(default)* | clash | dialectic | balanced | cycle | standard | General decision-making |
| ⚡ `quick` | clash | binary | balanced | now | quick | Fast yes/no decisions |
| 🔮 `deep` | rumble | dialectic | steelman | legacy | ultra | Strategic pivots, M&A |
| 🚨 `crisis` | clash | freeflow | escalation | now | standard | Surface hidden issues fast |
| 🤝 `align` | clash | sequential | consensus | cycle | standard | Build team agreement |
| 🎯 `challenge` | clash | binary | adversarial | now | standard | Stress-test a specific idea |

---

## Agent Roster

### Clash (4 + Centre)

| Agent | Direction | Element | Core Question |
|-------|-----------|---------|---------------|
| 💨 **Visionary** | North | Air | "Where are we going?" |
| 🔥 **Challenger** | East | Fire | "What's emerging?" |
| 🌍 **Pragmatist** | South | Earth | "What's grounded?" |
| 💧 **Sage** | West | Water | "What has history taught?" |
| 👁️ **Observer** | Centre-OUTER | Soul | "Why will humans do or not do this?" |
| 🔍 **PROBE** | Centre-INNER | Soul | "Is the way we're reasoning flawed?" |

> **Centre is always-on.** OUTER (Observer, Human 5 Whats) looks at human behavior. INNER (PROBE, 5-point critique) looks at the methodology. Both run in every debate. See [CENTRE.md](./CENTRE.md).

### Rumble adds (8+)

The PERSONALITY framework provides 11 additional archetypes:

| Letter | Archetype | Core Question |
|--------|-----------|---------------|
| **P** | Protector | "What could go wrong?" |
| **E** | Explorer | "What's possible?" |
| **R** | Realist | "What's feasible?" |
| **S** | Strategist | "What are the ripples?" |
| **O** | Observer | "What's the pattern?" |
| **N** | Navigator | "Where should we head?" |
| **A** | Advocate | "Who's not being heard?" |
| **L** | Literary | "What does wisdom say?" |
| **I** | Integrator | "How do we synthesize this?" |
| **T** | Timekeeper | "What does the timeline tell us?" |
| **Y** | Yielder | "What should we let go?" |

---

## Combining Axes

You can mix any combination:

```bash
# Steelman debate with 8 agents, looking at multi-year impact
sparkit --rumble --style=steelman --horizon=legacy "Should we open-source our core engine?"

# Quick adversarial check on a tactical decision
sparkit --style=adversarial --horizon=now "Should we ship this feature Friday?"

# Consensus-building with the full team
sparkit --pattern=sequential --style=consensus "What should our Q2 priorities be?"
```

---

## Choosing Your Configuration

```
                 ┌─────────────────────────────────────────┐
                 │ What kind of decision is this?          │
                 └─────────────┬───────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         Quick call?      Strategic?       Team alignment?
              │                │                │
         ⚡ --quick       🔮 --deep         🤝 --align
              │                │                │
        Need to stress    Crisis mode?    Adversarial test?
        test further?         │                │
              │           🚨 --crisis     🎯 --challenge
         Custom TESSERACT
```

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [DEPTH_MODES.md](./DEPTH_MODES.md) | [PERSONA_LIBRARY.md](./PERSONA_LIBRARY.md)*
