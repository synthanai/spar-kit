# SPAR-Kit Ethical Framework & Guardrails

**Document**: TASK-126  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Status**: Active

---

## 📋 Purpose

This document establishes ethical guardrails for SPAR-Kit's AI-assisted decision-making capabilities. It ensures that ultrathink-enhanced discussions remain human-centered, transparent, and accountable.

---

## 🎯 Core Principles

### 1. Human Sovereignty

> **AI assists; humans decide.**

- SPAR-Kit is a **decision-support tool**, not a decision-maker
- Every recommendation requires explicit human review before action
- Users maintain full authority to override, reject, or modify AI suggestions
- No autonomous action is taken without human approval

### 2. Transparency First

> **Users must understand how conclusions are reached.**

- All AI reasoning chains are visible in ultrathink mode
- Confidence scores break down contributing factors
- Persona perspectives are clearly attributed
- Limitations and uncertainties are explicitly stated

### 3. Adversarial Validation

> **Every recommendation is stress-tested through opposition.**

- The SPAR methodology ensures multiple perspectives challenge recommendations
- No single AI persona dominates the synthesis
- Minority viewpoints are preserved and documented
- Failure modes are explicitly identified (INTERROGATE phase)

---

## 🛡️ Guardrails

### G1: Decision Domain Boundaries

SPAR-Kit is designed for the following decision types:

| ✅ Appropriate Use | ❌ Not Appropriate |
|-------------------|-------------------|
| Strategic planning | Medical diagnosis |
| Business decisions | Legal judgments |
| Product direction | Financial advice requiring license |
| Team/org priorities | Safety-critical systems |
| Creative exploration | Decisions affecting vulnerable populations without oversight |
| Research prioritization | Automated hiring/firing |

**Implementation**: Warning displayed when decision text matches restricted domain patterns.

### G2: Confidence Thresholds

| Confidence Level | Action Required |
|-----------------|-----------------|
| 🟢 High (≥70%) | Proceed with standard review |
| 🟡 Moderate (50-69%) | Additional human analysis recommended |
| 🔴 Low (<50%) | **Mandatory additional review** before action |

**Implementation**: Low-confidence recommendations display prominent warnings in UI.

### G3: Bias Awareness

SPAR-Kit includes built-in bias awareness through:

1. **Diverse Personas**: 108-persona library spans 7 archetypes to represent varied perspectives
2. **NEWS Compass**: Ensures balanced coverage (Novelty, Expertise, Wisdom, Synthesis)
3. **SPARK Principles**: 
   - **Power & Anxiety Honesty**: Surface hidden interests
   - **Legitimate Dissent**: Protect minority viewpoints
   - **Observer Transparency**: Acknowledge observer biases

**Implementation**: Pre-debate SPARK check prompts users to consider biases.

### G4: Data Privacy

| Data Type | Handling |
|-----------|----------|
| Decision text | Stored locally only (unless user exports) |
| Thinking chains | Visible to user only |
| API keys | Never logged, never transmitted beyond provider |
| Session history | Local-first, user-controlled deletion |
| Persona responses | Ephemeral unless explicitly saved |

**Implementation**: Local-first architecture with Ollama as default provider.

---

## ⚖️ Accountability Chain

### Who is Responsible for AI-Influenced Decisions?

```
┌─────────────────────────────────────────────────────────┐
│                 ACCOUNTABILITY FLOW                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│   │ AI SYSTEM   │ → │ HUMAN USER  │ → │ ORGANIZATION │ │
│   │ (SPAR-Kit)  │    │ (Reviewer)  │    │ (Implementer)│ │
│   └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │          │
│   Provides            Interprets          Executes       │
│   Analysis            & Approves          & Owns         │
│                                                          │
│   Responsibility: 0%    Responsibility: 40%   60%        │
│   (Tool has no         (Gate for action)    (Ultimate    │
│    moral agency)                             authority)  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key**: SPAR-Kit is a tool. It has no moral responsibility. The human reviewer who approves a recommendation and the organization that implements it share accountability.

---

## 🚨 Warning Triggers

SPAR-Kit displays ethical warnings when:

### High-Stakes Detection
- Decision text contains: "hire", "fire", "terminate", "life", "death", "medical", "legal"
- Response: Display warning and suggest human expert review

### Low-Confidence Synthesis
- Confidence score < 50%
- Response: Mandatory warning before export/action

### Persona Divergence
- Final positions show <30% convergence
- Response: "Significant disagreement exists — minority views should be reviewed"

### Time Pressure Detection
- User attempts to skip INTERROGATE phase
- Response: Warning about reduced validation

---

## 📝 Audit Trail

Every SPAR session automatically records:

1. **Decision Context**: Original question, timestamp, user
2. **Personas Used**: Which perspectives were consulted
3. **Reasoning Chain**: Full thinking content (if ultrathink enabled)
4. **Confidence Metrics**: Score breakdown at time of synthesis
5. **Human Override**: If user modified or rejected recommendation
6. **Export Actions**: When and where recommendations were exported

**Retention**: Stored locally in `~/.spar/sessions/` until user deletes.

---

## 🔄 Continuous Improvement

### Feedback Loop
Users can flag:
- Unhelpful recommendations
- Biased perspectives
- Missing viewpoints
- Unclear reasoning

### Review Cadence
- **Monthly**: Review flagged sessions for patterns
- **Quarterly**: Update guardrails based on usage patterns
- **Annually**: Full ethical framework review

---

## 📚 References

- SPAR Methodology: [SPARK Principles](https://github.com/synthanai/spar/blob/main/docs/SPARK_PRINCIPLES.md)
- SPAR Protocol: [SPARKIT 7-Step Protocol](https://github.com/synthanai/spar/blob/main/docs/PROTOCOL.md)
- STASH Modes: [Human-AI Collaboration Modes](https://github.com/synthanai/spar/blob/main/docs/STASH_MODES.md)

---

## ✅ User Acknowledgment

By using SPAR-Kit's ultrathink capabilities, users acknowledge:

1. They are the final decision-maker, not the AI
2. AI recommendations are advisory only
3. They will apply appropriate human judgment before acting
4. They accept responsibility for decisions made using SPAR-Kit outputs

---

*SPAR-Kit Ethical Framework v1.0.0 — TASK-126 — 2026-01-14*
