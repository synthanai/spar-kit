# Accountability Chain for AI-Influenced Decisions

**Document**: TASK-128  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Define clear accountability for decisions made with SPAR-Kit assistance

---

## 🎯 Core Principle

> **The human who approves the decision owns the outcome.**

AI tools like SPAR-Kit have no moral agency. They cannot be held accountable. Accountability always rests with humans.

---

## 📊 The Accountability Framework

### Three-Party Model

```
┌─────────────────────────────────────────────────────────────┐
│              ACCOUNTABILITY DISTRIBUTION                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   SPAR-Kit (Tool)        Human User           Organization  │
│   ┌─────────────┐       ┌─────────────┐      ┌─────────────┐│
│   │             │       │             │      │             ││
│   │  🤖          │       │  👤          │      │  🏢          ││
│   │             │       │             │      │             ││
│   │ Provides    │   →   │ Interprets  │  →   │ Executes    ││
│   │ Analysis    │       │ & Approves  │      │ & Owns      ││
│   │             │       │             │      │             ││
│   └─────────────┘       └─────────────┘      └─────────────┘│
│                                                              │
│   Accountability:        Accountability:      Accountability:│
│   0%                     40%                  60%            │
│   (No agency)            (Decision gate)     (Implementation)│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Distribution?

| Party | Accountability | Rationale |
|-------|---------------|-----------|
| **SPAR-Kit** | 0% | Tools have no moral agency; cannot make choices |
| **Human User** | 40% | Chose to approve recommendation; applied judgment |
| **Organization** | 60% | Empowered the process; executes; owns outcomes |

---

## 🔄 The Accountability Chain

### Stage-by-Stage Responsibility

```
┌─────────────────────────────────────────────────────────────┐
│                 DECISION LIFECYCLE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. FRAMING (Human accountable)                              │
│     └── "How do I frame this decision?"                      │
│         └── Accountability: User shapes what AI considers    │
│                                                              │
│  2. PERSONA SELECTION (Human accountable)                    │
│     └── "Which perspectives do I include?"                   │
│         └── Accountability: User chooses viewpoint diversity │
│                                                              │
│  3. DEBATE (Tool operates)                                   │
│     └── SPAR-Kit runs the dialectic                          │
│         └── Accountability: None (mechanical operation)      │
│                                                              │
│  4. SYNTHESIS (Tool operates)                                │
│     └── SPAR-Kit generates recommendation                    │
│         └── Accountability: None (mechanical operation)      │
│                                                              │
│  5. REVIEW (Human accountable)                               │
│     └── "Do I accept, modify, or reject?"                    │
│         └── Accountability: User applies judgment            │
│                                                              │
│  6. APPROVAL (Human accountable)                             │
│     └── User explicitly approves action                      │
│         └── Accountability: User owns decision               │
│                                                              │
│  7. EXECUTION (Organization accountable)                     │
│     └── Decision is implemented                              │
│         └── Accountability: Org owns outcomes                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Accountability Records

### What Gets Recorded

Every SPAR-Kit session creates an accountability record:

```json
{
  "session_id": "spar-20260114-abc123",
  "decision": "Should we expand into market X?",
  "accountability": {
    "framer": {
      "action": "framed_decision",
      "timestamp": "2026-01-14T10:00:00Z"
    },
    "persona_selector": {
      "personas_chosen": ["strategist", "skeptic", "innovator", "ethicist"],
      "rationale": "Balanced strategic and ethical perspectives",
      "timestamp": "2026-01-14T10:02:00Z"
    },
    "reviewer": {
      "action": "reviewed_synthesis",
      "time_spent_seconds": 245,
      "timestamp": "2026-01-14T10:30:00Z"
    },
    "approver": {
      "action": "modified",
      "original_recommendation": "Proceed with expansion",
      "modification": "Proceed with 6-month pilot first",
      "reason": "Risk mitigation based on market volatility",
      "timestamp": "2026-01-14T10:35:00Z"
    }
  },
  "confidence": {
    "score": 0.72,
    "level": "high"
  },
  "audit_hash": "a1b2c3d4..."
}
```

### Audit Trail Integration

All accountability records flow to the audit system:

```
cli/audit.js
├── AuditEventType.HUMAN_APPROVAL
├── AuditEventType.HUMAN_MODIFICATION
├── AuditEventType.HUMAN_REJECTION
└── Full hash-chain integrity
```

---

## 🚨 Accountability Triggers

### When Accountability is Asserted

| Event | Accountability Captured |
|-------|------------------------|
| User frames decision | Framing accountability |
| User selects personas | Selection accountability |
| User reviews synthesis | Review accountability |
| User accepts/modifies/rejects | Decision accountability |
| Session exported | Distribution accountability |

### Accountability Warnings

SPAR-Kit displays accountability reminders:

1. **Before approval**: "You are accountable for this decision"
2. **Low confidence**: "High uncertainty, your judgment is critical"
3. **Override detected**: "Your modification is recorded"
4. **Export**: "You are responsible for how this is used"

---

## 👤 Individual Accountability

### What Users Must Do

1. **Review thoroughly** — Don't rubber-stamp recommendations
2. **Apply context** — Consider factors AI cannot access
3. **Document reasoning** — Explain overrides and modifications
4. **Accept ownership** — Acknowledge decision responsibility
5. **Escalate appropriately** — Flag decisions beyond authority

### Accountability Statement

Every session ends with:

```
┌─────────────────────────────────────────────────────────────┐
│                 ACCOUNTABILITY CONFIRMATION                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  By exporting or implementing this recommendation, you       │
│  acknowledge that:                                           │
│                                                              │
│  ☑ You have reviewed the AI-generated synthesis             │
│  ☑ You have applied your own judgment to this decision      │
│  ☑ You accept responsibility for the decision outcome       │
│  ☑ SPAR-Kit is a tool that assisted, not decided            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 Organizational Accountability

### What Organizations Must Do

1. **Enable informed decisions** — Provide training on SPAR-Kit use
2. **Set appropriate authority levels** — Match decisions to approvers
3. **Maintain audit trails** — Preserve accountability records
4. **Review outcomes** — Learn from decision results
5. **Update processes** — Improve based on experience

### Escalation Matrix

| Decision Type | Required Approver | AI Confidence Threshold |
|---------------|-------------------|------------------------|
| Routine | Individual user | Any |
| Significant | Team lead | ≥50% |
| Strategic | Executive | ≥70% |
| High-stakes | Board/C-suite | ≥80% + external validation |

---

## 📊 Accountability Metrics

### Tracked Indicators

| Metric | Purpose |
|--------|---------|
| Override rate | Healthy challenge of AI |
| Review time | Thoroughness of consideration |
| Confidence at approval | Risk tolerance |
| Modification frequency | Customization of recommendations |
| Escalation rate | Appropriate authority matching |

### Healthy Ranges

| Metric | Healthy Range | Concern Signal |
|--------|--------------|----------------|
| Override rate | 10-30% | <5% (rubber-stamping) or >50% (AI mismatch) |
| Review time | 2-10 min | <30s (insufficient review) |
| Modification rate | 15-40% | <5% (no customization) |

---

## 📚 References

- [Ethical Framework](./ETHICAL_FRAMEWORK.md)
- [AI-Human Boundaries](./AI_HUMAN_BOUNDARIES.md)
- [Audit Trail](../cli/audit.js)

---

*SPAR-Kit Accountability Chain v1.0.0, TASK-128, 2026-01-14*
