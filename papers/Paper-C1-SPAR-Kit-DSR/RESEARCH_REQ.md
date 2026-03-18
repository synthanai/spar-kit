# RESEARCH REQUIREMENTS: Paper C1 — SPAR-Kit DSR

---

## Evidence Inventory: What We Already Have

| Source | Location | What It Provides | Strength |
|--------|----------|------------------|----------|
| SPAR-Kit implementation | `repos/spar-arena/` | Working code, architecture | ⭐⭐⭐⭐⭐ The artifact |
| OpenRouter tier research | `.agent/skills/sparkit/openrouter_tiers.md` | 165-test validation, model scores | ⭐⭐⭐⭐⭐ Evaluation data |
| WASM kernel spec | KI: `spar_kit_protocol` → `wasm_kernel.md` | Browser-native architecture | ⭐⭐⭐⭐ Design evidence |
| MCP protocol | KI: `spar_kit_protocol` → `technical_specification.md` | IDE integration | ⭐⭐⭐⭐ Design evidence |
| Agent registry (42 agents) | `.agent/skills/agents/profiles/` | Identity-grounded personas | ⭐⭐⭐⭐⭐ Artifact |
| TESSERACT spec | KI: `spar_kit_protocol` → `methodology_master.md` | Configuration space | ⭐⭐⭐⭐⭐ Core novelty |

## Evidence Gaps

### MUST HAVE

| # | Gap | What's Needed | How to Get It |
|---|-----|---------------|---------------|
| G1 | **DSR methodology positioning** | Hevner 2004, Peffers et al. 2007, Gregor & Hevner 2013 (DSR knowledge contribution types) | Perplexity: DSR methodology survey |
| G2 | **Competing tools comparison** | ChatArena, LMArena, Chatbot Arena, CrewAI, AutoGen feature comparison | External search |
| G3 | **Multi-model orchestration literature** | Academic work on routing across LLMs for quality | Perplexity search |

### SHOULD HAVE

| # | Gap | What's Needed | How to Get It |
|---|-----|---------------|---------------|
| G4 | **Software architecture formalization** | Clean architecture diagram (C4 model or equivalent) | Internal: generate from codebase |
| G5 | **Cost analysis benchmark** | What do equivalent commercial deliberation tools cost? | Market research |

---

## External Research Prompts

```
PERPLEXITY PROMPT 1 (DSR Methodology):
───────────────────────────────────────
Survey the Design Science Research methodology for information systems.

Include:
- Hevner et al. 2004 (7 guidelines)
- Peffers et al. 2007 (DSRM process)
- Gregor & Hevner 2013 (knowledge contribution types)
- Recent DSR papers in IS venues (EJIS, JAIS, ISR) from 2020-2026
- Best practices for DSR artifact evaluation

For each: title, authors, year, venue, key contribution.
```

```
PERPLEXITY PROMPT 2 (AI Debate Tools):
───────────────────────────────────────
What open-source and commercial tools exist for
multi-agent AI debate and deliberation?

Include: ChatArena, LMArena, Chatbot Arena, CrewAI debate features,
AutoGen multi-agent conversation, LangGraph agent communication.

For each: (a) purpose, (b) configurable parameters, (c) persona support,
(d) formal protocol, (e) evaluation metrics, (f) limitations.
```
