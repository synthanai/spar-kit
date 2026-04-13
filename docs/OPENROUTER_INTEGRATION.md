# OpenRouter Integration Guide

> **Version**: 4.1.0  
> **Status**: Production-Ready  
> **Default Configuration**: FREE-Optimal ($0.00/run)

---

## Overview

SPAR Kit integrates with [OpenRouter](https://openrouter.ai) to enable multi-model dialectic debates using the **Tiered Dialectic Architecture (TDA)**. This architecture has been empirically validated to achieve 95% of premium model quality at a fraction of the cost, including **zero-cost configurations**.

---

## Quick Start

### 1. Get an OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Create an account
3. Generate an API key
4. Add credits (optional, FREE models are available)

### 2. Configure SPAR Kit

```bash
# Set environment variable
export OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Or add to .env file
echo "OPENROUTER_API_KEY=sk-or-v1-xxxxx" >> .env
```

### 3. Run a Debate

```bash
# Default: FREE-Optimal configuration
sparkit "Should we expand to Singapore?"

# With Ultra token tier for strategic decisions
sparkit "Strategic M&A decision" --ultra
```

---

## Tiered Dialectic Architecture (TDA)

The breakthrough from our 65-run research: **arbiter quality determines output quality**, not debater quality.

```
┌─────────────────────────────────────────────────────────────────┐
│              TIERED DIALECTIC ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   DEBATERS (Commodity Tier)                                     │
│   ├── Fast, diverse, low-cost models                           │
│   ├── Focus: Generate perspectives, not synthesize             │
│   └── Models: Gemini Flash, Kimi, Devstral                     │
│                                                                 │
│   ARBITER (Premium Tier)                                        │
│   ├── Highest-quality reasoning model available                │
│   ├── Focus: Synthesis is the critical bottleneck              │
│   └── Models: DeepSeek R1, Claude Opus, GPT-4o                 │
│                                                                 │
│   CRITIC (Mid Tier)                                             │
│   ├── Balanced quality and speed                               │
│   ├── Focus: Validate synthesis rigor                          │
│   └── Models: Llama 70B, Gemma 27B                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Production Configurations

### FREE-Optimal (Default) ⭐

**Validated Metrics**: 100% success rate, 42s avg synthesis, $0.00/run

| Role | Model | Context |
|------|-------|---------|
| Debaters | `google/gemini-2.0-flash-exp:free` | 1M tokens |
| Arbiter | `deepseek/deepseek-r1-0528:free` | 163K tokens |
| Critic | `meta-llama/llama-3.3-70b-instruct:free` | 131K tokens |

### FREE-Technical (Code/Architecture)

| Role | Model | Context |
|------|-------|---------|
| Debaters | `mistralai/devstral-2512:free` | 262K tokens |
| Arbiter | `qwen/qwen3-coder:free` | 262K tokens |
| Critic | `meta-llama/llama-3.3-70b-instruct:free` | 131K tokens |

### FREE-Scale (Maximum Parameters)

| Role | Model | Context |
|------|-------|---------|
| Debaters | `google/gemini-2.0-flash-exp:free` | 1M tokens |
| Arbiter | `meta-llama/llama-3.1-405b-instruct:free` | 131K tokens |
| Critic | `meta-llama/llama-3.3-70b-instruct:free` | 131K tokens |

### Paid-Opus (Publication-Grade)

| Role | Model | Cost |
|------|-------|------|
| Debaters | `google/gemini-2.0-flash-exp:free` | $0.00 |
| Arbiter | `anthropic/claude-3-opus` | ~$0.50/run |
| Critic | `anthropic/claude-3-sonnet` | ~$0.05/run |

---

## Token Tiers

| Tier | Debaters | Arbiter | Critic | Use Case |
|------|----------|---------|--------|----------|
| **Compact** | 200 | 600 | 150 | Quick tests, iteration |
| **Cosy** | 2,100 | 4,500 | 2,100 | Standard production |
| **Comprehensive** | 2,100 | 9,000 | 2,100 | **Default** — Deep decisions |
| **Ultra** | 4,000 | 16,000 | 4,000 | Publication-grade / Strategic |

**Key Insight**: Arbiter token budget has the highest marginal return. Invest there first.

---

## FREE Model Registry

### Tier 1: Arbiter-Class (Reasoning Models)

These models excel at synthesis, meta-analysis, and final recommendations.

| Model | Context | Notes |
|-------|---------|-------|
| `deepseek/deepseek-r1-0528:free` | 163K | **PRIMARY** — True reasoning model |
| `tngtech/deepseek-r1t-chimera:free` | 163K | R1 variant (TNG tuned) |
| `meta-llama/llama-3.1-405b-instruct:free` | 131K | Largest scale |
| `qwen/qwen3-coder:free` | 262K | 480B MoE - Technical arbiter |

### Tier 2: Critic-Class (Analysis Models)

These models excel at weakness detection and logical rigor.

| Model | Context | Notes |
|-------|---------|-------|
| `meta-llama/llama-3.3-70b-instruct:free` | 131K | **PRIMARY** — Balanced rigor |
| `google/gemma-3-27b-it:free` | 131K | Google quality |
| `openai/gpt-oss-120b:free` | 131K | Large scale |
| `z-ai/glm-4.5-air:free` | 131K | Multilingual |

### Tier 3: Debater-Class (Fast & Diverse)

These models excel at persona agents and multi-perspective generation.

| Model | Context | Notes |
|-------|---------|-------|
| `google/gemini-2.0-flash-exp:free` | 1M | **PRIMARY** — Fastest, massive context |
| `moonshotai/kimi-k2:free` | 32K | Fast, low latency |
| `nvidia/nemotron-3-nano-30b-a3b:free` | 256K | MoE, good quality |
| `xiaomi/mimo-v2-flash:free` | 262K | Speed optimized |
| `mistralai/devstral-2512:free` | 262K | Code-aware |

---

## Rate Limit Mitigation

FREE tier models have stricter rate limits. SPAR Kit implements:

1. **Exponential Backoff**: 2s → 4s → 8s on 429 errors
2. **Sequential Calls**: 0.5s delay between debaters
3. **Extended Timeouts**: 180s for DeepSeek R1 (reasoning model)
4. **Fallback Key**: Set `OPENROUTER_API_KEY_FALLBACK` for burst capacity

```bash
# .env configuration for rate limit resilience
OPENROUTER_API_KEY=sk-or-v1-primary
OPENROUTER_API_KEY_FALLBACK=sk-or-v1-backup
```

---

## Validated Quality Metrics

From 65-run research protocol (January 2026):

| Config | Mean Score | vs Commodity | Cost |
|--------|------------|--------------|------|
| FREE-Optimal (R1 Arbiter) | 27.6/30 | **+73%** | $0.00 |
| FREE-Scale (405B Arbiter) | 26.2/30 | **+64%** | $0.00 |
| Single-Flash (Baseline) | 16.0/30 | — | $0.00 |
| Inverse (Failure Test) | 14.4/30 | **-10%** | $0.00 |

**Publication Claim**: *"FREE-Optimal configuration achieves 100% success rate and 85%+ quality at zero cost."*

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Primary API key |
| `OPENROUTER_API_KEY_FALLBACK` | No | Backup key for rate limit resilience |
| `OPENROUTER_TIMEOUT` | No | Request timeout in seconds (default: 300) |
| `SPAR_TOKEN_TIER` | No | Default token tier (compact/cosy/comprehensive/ultra) |

---

## Troubleshooting

### Rate Limiting (429 Errors)

```
Error: 429 Too Many Requests
```

**Solutions**:
1. Wait a few seconds between runs
2. Add fallback API key
3. Use rate-limited models less frequently
4. Upgrade to OpenRouter paid tier for higher limits

### Synthesis Timeouts

```
Error: Request timeout after 300s
```

**Solutions**:
1. DeepSeek R1 can take 60-120s for complex synthesis, this is normal
2. Increase `OPENROUTER_TIMEOUT` if needed
3. Use smaller token tier for faster responses

### Model Not Available

```
Error: Model not found
```

**Solutions**:
1. Check OpenRouter status at https://openrouter.ai/docs
2. FREE models may have availability limits
3. Try alternative model in same tier

---

## See Also

- [**MULTI_MODEL_VALIDATION.md**](../../spar/research/MULTI_MODEL_VALIDATION.md), Full research documentation
- [**SPARKIT Protocol**](gpts/knowledge/SPARKIT_PROTOCOL.md), 7-step methodology
- [**OpenRouter Docs**](https://openrouter.ai/docs), API reference

---

*Don't deliberate alone. SPAR.* 🥊
