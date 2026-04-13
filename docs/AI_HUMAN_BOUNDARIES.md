# AI vs. Human Decision Boundaries

**Document**: TASK-121  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Establish clear boundaries for AI vs. human decision-making domains

---

## 🎯 Core Premise

> **AI provides synthesis. Humans provide judgment.**

SPAR-Kit is designed to enhance human decision-making, not replace it. This document codifies the specific boundary between what AI should do and what humans must do.

---

## 📊 The AI-Human Decision Matrix

### What AI Does (Synthesis)

| AI Responsibility | Description | Example |
|-------------------|-------------|---------|
| **Aggregate perspectives** | Collect and organize viewpoints | "Here are 4 persona positions on this decision" |
| **Surface tensions** | Identify where views conflict | "The Pragmatist and Visionary disagree on timeline" |
| **Generate options** | Present alternatives discovered | "Three paths emerged from the debate" |
| **Highlight risks** | Flag potential failure modes | "INTERROGATE found 5 watch-outs" |
| **Synthesize themes** | Find convergence patterns | "All personas agree on X, diverge on Y" |
| **Provide confidence** | Indicate certainty levels | "65% confidence based on convergence/reasoning/evidence" |

### What Humans Do (Judgment)

| Human Responsibility | Description | Example |
|---------------------|-------------|---------|
| **Frame the question** | Define what decision matters | "Should we enter market X?" |
| **Select perspectives** | Choose which personas debate | "Include Ethics + Innovation" |
| **Weight priorities** | Decide what matters most | "Security > speed for this decision" |
| **Resolve tensions** | Choose when views conflict | "I side with the Pragmatist here" |
| **Accept or override** | Final approval of recommendations | "Modify: add 3-month pilot phase" |
| **Take accountability** | Own the decision outcome | "I decided to proceed" |
| **Execute action** | Implement the decision | "Team, we're moving forward with X" |

---

## 🚦 The Decision Traffic Light Model

```
┌───────────────────────────────────────────────────────────────┐
│              DECISION TRAFFIC LIGHT                            │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  🟢 GREEN, AI-Assisted, Human Approved                       │
│  ├── High confidence (≥70%)                                   │
│  ├── Good persona convergence                                 │
│  ├── INTERROGATE phase completed                              │
│  └── Human has reviewed and approved                          │
│      → ACTION: Proceed with documented approval               │
│                                                                │
│  🟡 YELLOW, Enhanced Review Required                         │
│  ├── Moderate confidence (50-69%)                             │
│  ├── OR: Significant persona disagreement                     │
│  ├── OR: Bias detected in synthesis                           │
│  └── Human must add additional analysis                       │
│      → ACTION: Seek second opinion before proceeding          │
│                                                                │
│  🔴 RED, Human Authority Required                            │
│  ├── Low confidence (<50%)                                    │
│  ├── OR: High-stakes decision domains                         │
│  ├── OR: Ethical concerns flagged                             │
│  ├── OR: INTERROGATE phase skipped                            │
│  └── AI recommendation is advisory only                       │
│      → ACTION: Do NOT proceed without additional validation   │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 🛑 Absolute Boundaries

### AI Will NEVER:

1. **Make final decisions** without human approval
2. **Execute actions** on behalf of users
3. **Hide uncertainty** from users
4. **Suppress minority viewpoints** from synthesis
5. **Store or transmit sensitive data** beyond session scope
6. **Claim certainty** when data is insufficient
7. **Override human judgment** even when confidence is high

### Humans MUST Always:

1. **Review every recommendation** before acting
2. **Apply contextual judgment** AI cannot access
3. **Consider ethical implications** beyond AI analysis
4. **Accept accountability** for decisions made
5. **Validate assumptions** AI has made
6. **Check for missing perspectives** AI may not represent
7. **Document their reasoning** when overriding AI

---

## 📋 Decision Domain Classification

### 🟢 AI Can Recommend (Human Approves)

| Domain | Why AI Helps | Human Role |
|--------|-------------|------------|
| Strategic planning | Aggregates perspectives | Final direction |
| Product roadmaps | Surfaces trade-offs | Priority decisions |
| Team structure | Explores options | Fit/culture judgment |
| Investment priorities | Risk analysis | Risk appetite decision |
| Tech stack choices | Technical comparison | Context + legacy |

### 🟡 AI Assists (Human Leads)

| Domain | Why AI Helps | Human Role |
|--------|-------------|------------|
| Hiring decisions | Reduce bias, surface candidates | Cultural fit, potential |
| Performance reviews | Data aggregation | Relationship context |
| Partnership choices | Due diligence support | Trust judgment |
| Pricing decisions | Market analysis | Brand positioning |

### 🔴 AI Provides Context (Human Decides)

| Domain | Why AI is Limited | Human Role |
|--------|------------------|------------|
| Medical treatment | Liability, individualization | Doctor's clinical judgment |
| Legal strategy | Professional responsibility | Attorney's expertise |
| Safety-critical systems | Failure consequences | Engineer's certification |
| Vulnerable populations | Power dynamics | Ethical oversight |
| Crisis management | Real-time context | Executive authority |

---

## 🔄 The Boundary Enforcement Loop

```
┌─────────────────────────────────────────────────────────────┐
│                 BOUNDARY ENFORCEMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   1. DECISION INPUT                                          │
│      └── User frames question                                │
│          └── [BOUNDARY] Domain classification triggered      │
│                                                              │
│   2. AI SYNTHESIS                                            │
│      └── SPAR debate runs                                    │
│          └── [BOUNDARY] AI generates, never decides          │
│                                                              │
│   3. CONFIDENCE SCORING                                      │
│      └── System rates recommendation                         │
│          └── [BOUNDARY] Low scores trigger warnings          │
│                                                              │
│   4. BIAS CHECK                                              │
│      └── System analyzes for bias                            │
│          └── [BOUNDARY] Bias detection = yellow light        │
│                                                              │
│   5. HUMAN REVIEW                                            │
│      └── User sees recommendation                            │
│          └── [BOUNDARY] Override panel required              │
│                                                              │
│   6. HUMAN ACTION                                            │
│      └── Accept / Modify / Reject                            │
│          └── [BOUNDARY] All actions logged to audit trail    │
│                                                              │
│   7. EXPORT / EXECUTION                                      │
│      └── Recommendation becomes action                       │
│          └── [BOUNDARY] Human accountability recorded        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Implementation Checklist

### Already Implemented ✅

- [x] **Confidence scoring** — `cli/confidence.js`
- [x] **Transparency indicators** — `ThinkingBlock` component
- [x] **Override mechanisms** — `OverridePanel.js`
- [x] **Ethical guardrails** — `docs/ETHICAL_FRAMEWORK.md`
- [x] **Audit trail** — `cli/audit.js`
- [x] **Bias detection** — `cli/bias.js`

### To Be Implemented 🔲

- [ ] Domain classification warning system
- [ ] Automatic traffic light assignment
- [ ] Real-time boundary alerts during debate
- [ ] Post-decision follow-up survey

---

## 📚 References

- [Ethical Framework](./ETHICAL_FRAMEWORK.md)
- [Success Metrics](./SUCCESS_METRICS.md)
- [SPAR STASH Modes](https://github.com/synthanai/spar/blob/main/docs/STASH_MODES.md)

---

*SPAR-Kit AI-Human Boundaries v1.0.0, TASK-121, 2026-01-14*
