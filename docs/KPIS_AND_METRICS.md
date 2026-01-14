# Ultrathink KPIs and Metrics

**Document**: TASK-112, TASK-114, TASK-115  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Establish measurable KPIs for ultrathink capabilities

---

## 🎯 KPI Framework

### Tier 1: Outcome Metrics (What matters most)

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| **Decision Quality Score** | ≥80% | 30-day outcome survey | Per session |
| **User Satisfaction** | ≥4.5/5.0 | Post-session rating | Per session |
| **Recommendation Actionability** | ≥80% | "Would you act on this?" | Per session |
| **Decision Regret Rate** | ≤10% | 30-day follow-up | Monthly |

### Tier 2: Process Metrics (How we get there)

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| **Confidence Accuracy** | ±15% | Actual vs. predicted outcomes | Quarterly |
| **Override Rate** | 10-30% | Healthy challenge indicator | Per session |
| **Review Completion** | 100% | Human review before export | Per session |
| **Bias Detection Rate** | Track | Biases caught per session | Per session |

### Tier 3: Operational Metrics (System health)

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| **Session Completion Rate** | ≥95% | Completed / Started | Daily |
| **Average Session Time** | 3-10 min | Clock time | Per session |
| **Error Rate** | ≤1% | Failed sessions | Daily |
| **Ultrathink Adoption** | ≥50% | Ultrathink / Total sessions | Weekly |

---

## 📊 User Satisfaction Methodology (TASK-114)

### Post-Session Survey

Displayed after every session completion:

```
┌─────────────────────────────────────────────────────────────┐
│           SESSION FEEDBACK (30 seconds)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Overall satisfaction with this session?                  │
│     ⭐⭐⭐⭐⭐ (1-5 stars)                                   │
│                                                              │
│  2. Was the recommendation actionable?                       │
│     ○ Yes, I can act on this                                │
│     ○ Partially, needs more context                         │
│     ○ No, not useful                                        │
│                                                              │
│  3. Did ultrathink reasoning help you understand?            │
│     ○ Yes, very helpful                                     │
│     ○ Somewhat helpful                                      │
│     ○ Did not use / Not helpful                             │
│                                                              │
│  [Skip] [Submit]                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 30-Day Follow-Up (Optional)

For users who opt in:

1. **Did you act on the recommendation?** (Yes/No/Partially)
2. **How would you rate the outcome?** (1-5)
3. **Would you have decided differently without SPAR-Kit?** (Yes/No)
4. **Any regrets about this decision?** (Yes/No)

### NPS Survey (Quarterly)

```
"How likely are you to recommend SPAR-Kit to a colleague?"
0 ─────────────────────────────────────────────── 10
Not at all likely                          Extremely likely
```

---

## 📈 Outcome Tracking System (TASK-115)

### Decision Outcome Schema

```json
{
  "session_id": "spar-20260114-abc123",
  "decision": "Should we expand into market X?",
  "recommendation": "Proceed with pilot",
  "confidence": 0.72,
  "override": {
    "applied": true,
    "modification": "Extended pilot to 6 months"
  },
  "outcome": {
    "tracked_at": "2026-02-14T10:00:00Z",
    "status": "successful",
    "rating": 4,
    "notes": "Pilot exceeded expectations",
    "would_repeat": true
  }
}
```

### Outcome Categories

| Status | Definition |
|--------|------------|
| **Successful** | Decision achieved intended goals |
| **Partially Successful** | Some goals met, some missed |
| **Unsuccessful** | Did not achieve goals |
| **Pending** | Outcome not yet determinable |
| **Reversed** | Decision was reversed/undone |

### Confidence Calibration

Compare predicted vs actual:

```
Session Confidence: 72% (High)
Actual Outcome: Successful

Calibration: ACCURATE (confidence matched outcome)
```

Aggregate over time to measure confidence accuracy.

---

## 🎯 Benchmark Suite (TASK-113)

### Comparison Categories

| Category | Benchmark Against |
|----------|-------------------|
| Time to decision | Manual process |
| Perspective coverage | Single-advisor model |
| Cognitive bias reduction | Unstructured decisions |
| Documentation quality | Ad-hoc notes |
| Outcome tracking | No tracking |

### Benchmark Methodology

1. **Baseline**: Document current decision process metrics
2. **Parallel run**: Same decisions with and without SPAR-Kit
3. **A/B testing**: Random assignment to SPAR-Kit vs. manual
4. **Outcome comparison**: Track both at 30/60/90 days

### Target Improvements

| Metric | Baseline | Target | Improvement |
|--------|----------|--------|-------------|
| Time to deliberation | 4 hours | 30 min | 8x faster |
| Perspectives considered | 2-3 | 4+ | 2x more |
| Documented reasoning | 20% | 100% | 5x more |
| Outcome tracking | 10% | 100% | 10x more |

---

## 📊 Dashboard Metrics Display

### Real-Time Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│              ULTRATHINK METRICS DASHBOARD                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TODAY                    THIS WEEK          THIS MONTH      │
│  ├── Sessions: 12         ├── Sessions: 47   ├── Sessions: 156│
│  ├── Avg Sat: 4.3⭐       ├── Avg Sat: 4.4⭐ ├── Avg Sat: 4.3⭐│
│  └── Override: 23%        └── Override: 21%  └── Override: 24%│
│                                                              │
│  CONFIDENCE CALIBRATION                                      │
│  └── Accuracy: 78% (within ±15% of actual)                   │
│                                                              │
│  OUTCOME TRACKING                                            │
│  └── 30-day success rate: 82%                                │
│                                                              │
│  ALERTS                                                      │
│  └── ⚠️ Override rate below 10% for user X (automation bias?)│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

*SPAR-Kit KPIs and Metrics v1.0.0 — TASK-112, 114, 115 — 2026-01-14*
