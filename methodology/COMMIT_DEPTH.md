# COMMIT Depth: Graduated Autonomy

*How much human oversight does this decision need?*

> **Version**: 1.0 (Protocol v8.0)

---

## Overview

COMMIT Depth defines the level of human involvement in acting on a SPAR verdict. Not every decision needs the same approval workflow. A routine configuration choice can auto-execute; a strategic pivot requires explicit sign-off.

---

## The Four Levels

| Level | Name | Human Involvement | Behavior |
|-------|------|-------------------|----------|
| **SHALLOW** | Full Approval | High | Blocks until human signs off on the verdict |
| **MODERATE** | Guardrail-led | Medium | Auto-approves IF results stay within predefined parameters |
| **DEEP** | Exception-only | Low | Auto-approves; humans review outcomes post-hoc |
| **FULL** | Post-hoc Audit | Minimal | Automated pass-through; audit trail captured for review |

---

## When to Use Each Level

| COMMIT Depth | RAMP Level | Example Decision |
|-------------|------------|-----------------|
| SHALLOW | L4-L5 | "Should we acquire Company X?" |
| MODERATE | L3 | "Should we migrate to the new API?" |
| DEEP | L2 | "Should we use library A or B?" |
| FULL | L1 | "Should we format with tabs or spaces?" |

> **RAMP alignment**: COMMIT Depth should be proportional to [RAMP level](./RAMP_LEVELS.md). Higher RAMP = shallower COMMIT (more human oversight).

---

## Parameters by Level

### SHALLOW
```yaml
commit_depth: SHALLOW
approval_required: true
approver: [decision-maker name]
timeout: none  # blocks indefinitely
escalation: none  # human is in the loop
```

### MODERATE
```yaml
commit_depth: MODERATE
approval_required: conditional
guardrails:
  - budget_impact: < $10,000
  - reversibility: within 7 days
  - team_impact: < 5 people
auto_approve_if: all guardrails satisfied
escalate_to: SHALLOW if any guardrail breached
```

### DEEP
```yaml
commit_depth: DEEP
approval_required: false
post_hoc_review: required within 30 days
alert_on: confidence < 65% or dissent > 2 personas
escalate_to: MODERATE on alert
```

### FULL
```yaml
commit_depth: FULL
approval_required: false
post_hoc_review: optional
audit_trail: captured automatically
escalate_to: DEEP if PROBE flags systematic bias
```

---

## Integration with TRANSMIT

The verdict in TRANSMIT includes the recommended COMMIT Depth:

```
RECOMMENDATION: [Action]
CONFIDENCE: 82%
RAMP LEVEL: L3
RECOMMENDED COMMIT DEPTH: MODERATE
GUARDRAILS: Budget < $10K, reversible within 7 days
```

The decision-maker can override the recommended depth (always in the direction of more oversight, never less).

---

## The Trust Ladder

COMMIT Depth is designed to evolve over time. As a team builds trust with SPAR:

```
First SPAR → SHALLOW (everything gets explicit approval)
After 5 SPARs → MODERATE (guardrails handle routine decisions)
After 20 SPARs → DEEP (override only on exceptions)
Mature org → FULL for L1 decisions (audit trail is sufficient)
```

---

> *See also: [PROTOCOL.md](./PROTOCOL.md) | [RAMP_LEVELS.md](./RAMP_LEVELS.md) | [LOOP_GOVERNANCE.md](./LOOP_GOVERNANCE.md)*
