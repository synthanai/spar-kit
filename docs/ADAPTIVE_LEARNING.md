# Adaptive AI Learning from Human Feedback

**Document**: TASK-120  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Design feedback loops for continuous AI improvement

---

## 🎯 Overview

SPAR-Kit can improve over time by learning from human feedback. This document describes how user actions inform system improvement **without** training on user data.

**Key Principle**: We learn from *patterns*, not *content*.

---

## 📊 Feedback Sources

### 1. Explicit Feedback

| Source | Data Captured | Use |
|--------|--------------|-----|
| Session ratings | 1-5 stars | Overall quality signal |
| Actionability response | Yes/No/Partial | Recommendation usefulness |
| Override actions | Accept/Modify/Reject | AI-human alignment |
| Rejection reasons | Categorized | Improvement areas |
| 30-day outcomes | Success/Failure | Long-term calibration |

### 2. Implicit Feedback

| Signal | Interpretation |
|--------|---------------|
| Review time | Longer = more complex or unclear |
| Override rate | 10-30% = healthy; <5% = automation bias |
| ThinkingBlock expansion | Interest in reasoning |
| Session abandonment | UX or quality issue |
| Persona selection patterns | Which perspectives valued |

---

## 🔄 Learning Loops

### Loop 1: Persona Effectiveness

**What we learn**: Which personas are most helpful for which decision types.

```
┌─────────────────────────────────────────────────────────────┐
│              PERSONA EFFECTIVENESS LOOP                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User selects personas for decision                       │
│  2. Debate runs, synthesis generated                         │
│  3. User rates session                                       │
│  4. System records: {decision_type, personas, rating}        │
│  5. Over time: "Strategist + Skeptic = higher ratings        │
│                 for expansion decisions"                     │
│  6. System suggests: "For expansion decisions, consider      │
│                       Strategist + Skeptic"                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Loop 2: Confidence Calibration

**What we learn**: How accurate our confidence scores are.

```
Predicted Confidence: 72% (High)
30-day Outcome: Successful

Learning: Confidence was accurate for this decision type

Aggregate: Over 100 sessions, 72% confidence → 75% success rate
Calibration: Slightly under-confident → adjust thresholds
```

### Loop 3: Override Pattern Learning

**What we learn**: When humans disagree with AI and why.

| Override Pattern | Learning | Adaptation |
|------------------|----------|------------|
| Consistent rejection of Optimist persona | Optimist prompts may be too bullish | Review prompt balance |
| Modifications add "pilot phase" | Users prefer risk mitigation | Suggestions could include pilots |
| High override rate for legal decisions | AI limited in legal domain | Stronger warnings for legal |

### Loop 4: Bias Detection Improvement

**What we learn**: Which bias patterns lead to poor outcomes.

```
Session had: CONFIRMATION_BIAS detected
User action: Rejected recommendation
30-day outcome: User's alternative succeeded

Learning: Bias detection was valuable signal
Action: Increase visibility of bias warnings
```

---

## 🛡️ Privacy-Preserving Learning

### What We DO Collect (Aggregated)

- Decision type categories (not actual text)
- Persona combinations used
- Rating distributions
- Override rates by category
- Outcome success rates

### What We NEVER Collect

- Actual decision content
- User identities
- Recommendation text
- Session transcripts
- Personal information

### Aggregation Thresholds

| Metric | Minimum Sample |
|--------|---------------|
| Persona effectiveness | 50 sessions |
| Confidence calibration | 100 sessions |
| Decision type patterns | 25 sessions per type |

---

## 📈 Improvement Actions

### Automatic Adjustments

| Signal | Automatic Action |
|--------|-----------------|
| Persona consistently rated low | Reduce default suggestions |
| Confidence consistently off | Adjust calibration formula |
| Decision type → persona correlation | Suggest proven combinations |

### Manual Review Triggers

| Signal | Action |
|--------|--------|
| Bias detection → successful override | Review persona prompts |
| New decision type emerging | Consider new personas |
| Systematic rejection pattern | Investigate root cause |

---

## 📋 Implementation Status

### Implemented ✅

- Session ratings collection
- Override action recording
- Audit trail with outcomes
- Feedback survey UI

### Planned 🔲

- Aggregated pattern analysis
- Persona suggestion engine
- Confidence auto-calibration
- Bias detection refinement

---

## 🔮 Future Considerations

### Organizational Learning

For teams/organizations:
- Shared persona effectiveness data
- Organization-specific calibration
- Custom persona recommendations

### Model Fine-Tuning (If Requested)

With explicit user consent:
- Anonymous decision → outcome pairs
- Persona prompt optimization
- Organization-specific model variants

---

*SPAR-Kit Adaptive Learning v1.0.0, TASK-120, 2026-01-14*
