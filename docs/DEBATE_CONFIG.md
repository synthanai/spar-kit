# SPAR Kit — Advanced Debate Configuration

*Production-validated multi-agent debate architecture for structured reasoning.*

---

## Overview

SPAR Kit v4.0 introduces advanced debate configuration options based on real-world production experience with multi-agent dialectic systems. These features provide:

- **Consistent output quality** through staged token budgeting
- **Optimal resource usage** via role-based model tiering
- **Reliable results** with the 3-round rumble standard
- **Fault tolerance** through checkpoint/resume support
- **Automatic quality control** via escalation protocol

---

## 🎯 The 3-Round Rumble Standard

The Rumble phase (Step 4 in SPARKIT) follows a structured 3-round protocol:

```
┌─────────────────────────────────────────────────────────────────┐
│                   RUMBLE PHASE BREAKDOWN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ROUND 1: OPENING STATEMENTS                                     │
│ ├─ Each persona presents initial position                       │
│ ├─ Token Budget: 1,500 tokens (~500-800 words)                  │
│ └─ Focus: "What do you see that others might miss?"             │
│                                                                 │
│ ROUND 2: THE CLASH (Responses)                                  │
│ ├─ Personas engage with each other's arguments                  │
│ ├─ Token Budget: 1,200 tokens (~400-600 words)                  │
│ └─ Focus: "Where do you agree/disagree? What's at stake?"       │
│                                                                 │
│ ROUND 3: FINAL POSITIONS                                        │
│ ├─ Updated positions after hearing counterarguments             │
│ ├─ Token Budget: 1,000 tokens (~300-500 words)                  │
│ └─ Focus: "Has anything changed your view? Final verdict?"      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why 3 Rounds?

Based on extensive testing:
- **Round 1** surfaces initial positions and assumptions
- **Round 2** creates genuine dialectic friction
- **Round 3** allows perspective updates after challenge
- **More than 3** rarely adds value — positions harden without new insight
- **Operational**: 3 rounds fits within 32k context window limits

### Exception: 5 Rounds
For meta-debates (debates about the debate process itself), use 5 rounds to ensure adequate depth.

---

## 📊 Staged Token Budgeting

Explicit token limits per phase prevent runaway outputs and ensure consistent quality:

| Phase | Role | Max Tokens | Target Words |
|-------|------|------------|--------------|
| **R1: Opening** | Debater | 1,500 | 500-800 |
| **R2: Response** | Debater | 1,200 | 400-600 |
| **R3: Final** | Debater | 1,000 | 300-500 |
| **Knit: Synthesis** | Moderator | 21,000 | 1,500-3,000 |
| **Interrogate** | Debater | 1,200 | 400-600 |
| **Transmit** | Moderator | 3,000 | 500-1,000 |

### Usage

```javascript
import { TOKEN_BUDGETS, getTokenBudget } from './cli/debate-config.js';

// Get budget for a specific phase
const openingBudget = getTokenBudget('round1_opening');
// { maxTokens: 1500, targetWords: { min: 500, max: 800 }, promptGuidance: "..." }
```

---

## 🎭 Role-Based Model Tiering

Different roles in the debate use different model tiers:

| Role | Default Tier | Rationale |
|------|--------------|-----------|
| **Debaters (4 Personas)** | Balanced | Volume requirement; multiple concurrent |
| **Moderator (Synthesizer)** | Ultra | Heavy semantic lifting, conflict resolution |
| **Interrogator** | Balanced | Stress-testing requires moderate depth |

### Available Tiers

| Tier | Icon | Ollama | OpenAI | Description |
|------|------|--------|--------|-------------|
| **Fast** | 🟢 | mistral:latest | gpt-3.5-turbo | Quick responses |
| **Balanced** | 🟡 | qwen2.5:7b | gpt-4o-mini | Good reasoning |
| **High** | 🟠 | deepseek-r1:7b | gpt-4 | Deep reasoning |
| **Ultra** | 🔴 | deepseek-r1:14b | gpt-4o | Maximum quality |

### Usage

```javascript
import { getModelForRole, MODEL_TIERS } from './cli/debate-config.js';

// Get model for a debater using Ollama
const debaterModel = getModelForRole('debater', 'ollama');
// 'qwen2.5:7b'

// Get model for supervisor (synthesis) using OpenAI
const supervisorModel = getModelForRole('supervisor', 'openai', 'ultra');
// 'gpt-4o'
```

---

## 💾 Checkpoint/Resume Protocol

Long-running debates can be saved and resumed:

### Checkpoint Phases

```
SCOPE → POPULATE → ANNOUNCE → RUMBLE_R1 → RUMBLE_R2 → RUMBLE_R3 
     → KNIT → INTERROGATE → TRANSMIT → COMPLETE
```

### Usage

```javascript
import { createCheckpoint, getNextPhase } from './cli/debate-config.js';

// Create a checkpoint after Round 2
const checkpoint = createCheckpoint(session, 'RUMBLE_R2');

// Save checkpoint to file
fs.writeFileSync('.spar/checkpoints/session-123.json', 
    JSON.stringify(checkpoint, null, 2));

// Later: determine where to resume
const nextPhase = getNextPhase(checkpoint);
// 'RUMBLE_R3'
```

### CLI Support (Coming Soon)

```bash
# Resume an incomplete debate
sparkit debate --resume

# List incomplete debates
sparkit debate --list-incomplete

# Force restart
sparkit debate --restart
```

---

## 🔄 Escalation Protocol

Automatic quality control that escalates to higher-tier models if responses are insufficient:

### How It Works

1. **Generate response** with current tier (e.g., Balanced)
2. **Quality check**:
   - Word count ≥ 200?
   - Has completion marker?
   - Contains substantive arguments?
3. **If check fails**: Escalate to next tier and retry

### Escalation Path

```
Fast → Balanced → High → Ultra
```

### Usage

```javascript
import { needsEscalation, getNextTier } from './cli/debate-config.js';

const response = await generateResponse(tier);

const check = needsEscalation(response);
if (check.escalate) {
    console.log(`Escalating: ${check.reason}`);
    const nextTier = getNextTier(currentTier);
    if (nextTier) {
        // Retry with higher tier
    }
}
```

---

## ⚙️ Configuration API

### Default Configuration

```javascript
import { DEFAULT_DEBATE_CONFIG } from './cli/debate-config.js';

// {
//   protocol: 'SPARKIT',
//   rumbleRounds: 3,
//   debaterTier: 'balanced',
//   supervisorTier: 'high',
//   ultrathinkSynthesis: true,
//   tokenBudgets: {...},
//   contextWindow: 32768,
//   checkpointEnabled: true,
//   ...
// }
```

### Display Configuration

```javascript
import { formatConfigSummary } from './cli/debate-config.js';

console.log(formatConfigSummary());
// ┌─────────────────────────────────────────────────────────────┐
// │ SPAR Debate Configuration                                   │
// ├─────────────────────────────────────────────────────────────┤
// │ Rumble Rounds:      3                                       │
// │ Debater Tier:       🟡 balanced                             │
// │ Supervisor Tier:    🟠 high                                 │
// │ Ultrathink Synth:   ✅ Yes                                  │
// │ Checkpoint:         ✅ Enabled                              │
// └─────────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Reference

| Feature | Default | Notes |
|---------|---------|-------|
| Rumble Rounds | 3 | 5 for meta-debates |
| Debater Tier | Balanced | Fast for simple debates |
| Supervisor Tier | High | Ultra for synthesis |
| Token Limit (Opening) | 1,500 | ~500-800 words |
| Token Limit (Synthesis) | 21,000 | ~1,500-3,000 words |
| Context Window | 32,768 | For local models |
| Checkpoint | Enabled | Saves after each phase |

---

## Next Steps

- **[SPARKIT Protocol](PROTOCOL.md)** — Full 7-step protocol
- **[GRACE Principles](GRACE_PRINCIPLES.md)** — 5 epistemological stances
- **[ASPIRES Framework](ADVANCED_PATTERNS.md)** — 7 advanced patterns

---

*SPAR Kit v4.0 — Battle-tested debate configuration for structured reasoning.*
