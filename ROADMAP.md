# SPAR-Kit Roadmap

> **Last updated**: 2026-03-10

---

## Current State

| Component | Version | Status |
|-----------|---------|--------|
| **Methodology** | v8.0 | ✅ Current (8-step protocol, TESSERACT, depth modes) |
| **CLI** | v4.1.0 | 🟡 Trails methodology (implements 7-step protocol) |
| **Web Showcase** | v4.0 | 🟡 Trails methodology |
| **MCP Server** | v1.0 | ✅ Functional |

> The methodology documentation reflects v8.0. The CLI implements v4.1.0. Both are production-ready for their respective versions.

---

## Planned

### CLI v5.0 (Methodology Alignment)

Align the CLI implementation with the v8.0 methodology:

- [ ] Implement Step 3: ABSTRACT in the debate flow
- [ ] Add NOOL Step 0 to session initialization
- [ ] Integrate TESSERACT axis selection into Builder wizard
- [ ] Add depth mode selector (Show Me to Ultra)
- [ ] Update TUI dashboard with depth mode indicators
- [ ] GRACE check prompts between RUMBLE rounds
- [ ] Checkpoint decision tables for transition validation
- [ ] TRANSMIT with dissent record and conditions

### Methodology Additions

Additional methodology docs arriving in the next sync:

- [ ] 6R Engine specification
- [ ] SPARED coaching cycle
- [ ] RAMP levels specification
- [ ] Arena Mitosis specification
- [ ] COMMIT Depth governance
- [ ] Feedback resolution protocol
- [ ] DOORS framework

### Community

- [ ] Issue templates for persona submissions
- [ ] Contributor guidelines for methodology refinements
- [ ] Example SPAR sessions with annotated commentary

---

## Non-Goals (Castle)

The following will NOT be added to this OSS repository:

- Profiling-to-Reasoning Pipeline (auto-configuration from user profiles)
- Native Python package (hosted service implementation)
- Belt-gated progressive disclosure UX (SaaS product design)
- Hand-crafted canon persona prompts (proprietary IP)

See [OSS_IP_BOUNDARY.md](./OSS_IP_BOUNDARY.md) for the complete boundary policy.

---

> *SPAR-Kit is part of the [SYNTHAI](https://synthai.tech) ecosystem.*
