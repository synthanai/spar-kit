# நூல் / NOOL — SPAR-Kit DSR Paper (C1)

> *The Reasoning Thread: a record of INTENT (why), ABSTRACTION (what type), and CHAIN (how).*

---

## நோக்கம் / Intent (Soul: WHY)

### The Problem

1. **Multi-agent AI systems lack deliberation infrastructure.** CrewAI, AutoGen, and LangGraph provide agent orchestration but no formal argumentation protocol. Deliberation is ad hoc.
2. **SPAR methodology (B1) needs an implementation paper.** The method alone is theory. The kit demonstrates feasibility, scalability, and production readiness.
3. **No open-source configurable debate engine exists.** Existing AI debate tools (ChatArena, LMArena) focus on benchmarking, not on structured organizational decision-making.
4. **DSR as a validation approach.** Hevner's design science paradigm (2004) explicitly validates through artifact construction and evaluation, making SPAR-Kit a natural DSR candidate.

### The Purpose

A Design Science Research paper that:
- **Presents** SPAR-Kit as a design artifact: architecture, components, implementation choices
- **Evaluates** the artifact against defined requirements (configurable deliberation, identity grounding, anti-sycophancy, multi-model orchestration)
- **Reports** evaluation results: 165-test validation, quality scores, cost analysis
- **Positions** within DSR methodology (Hevner 2004, Peffers et al. 2007)
- **Targets** DESRIST conference or European Journal of Information Systems

### What We're Avoiding

| Anti-Pattern | Why | How We Prevent It |
|--------------|-----|-------------------|
| **Just a software paper** | DSR is more than code description | Follow Hevner's 7 guidelines explicitly |
| **Duplicate of B1** | B1 = protocol, C1 = artifact | Clear separation: C1 cites B1 for protocol, focuses on implementation |
| **Overclaiming intelligence** | The engine orchestrates, it doesn't think | Frame as "deliberation infrastructure" not "artificial reasoning" |

---

## வடிவம் / Abstraction (Mind: WHAT TYPE)

### Problem Type

**DESIGN SCIENCE**: Build and evaluate an IT artifact (SPAR-Kit) that instantiates the SPAR protocol.

### Key Dimensions

1. **Problem identification**: Gap in configurable multi-agent deliberation tools
2. **Artifact design**: Architecture (MCP, WASM, OpenRouter, CLI)
3. **Demonstration**: Worked examples of SPAR-Kit producing decisions
4. **Evaluation**: Quality scores, cost efficiency, model comparison (165 tests)
5. **Communication**: This paper

### Hevner's 7 Guidelines Mapping

| Guideline | How C1 Addresses It |
|-----------|---------------------|
| 1. Design as Artifact | SPAR-Kit is a working software system |
| 2. Problem Relevance | AI decision-making lacks structured deliberation |
| 3. Design Evaluation | 165-test protocol, 26.5/30 quality benchmark |
| 4. Research Contributions | First configurable deliberation engine with identity-grounded personas |
| 5. Research Rigor | DSR methodology (Peffers et al. 2007) |
| 6. Design as Search | TESSERACT configuration space as solution space exploration |
| 7. Communication | This paper |

---

## சங்கிலி / Chain (Body: HOW)

### Execution Path

| Phase | Task | Priority | Status |
|-------|------|----------|--------|
| 0. Manifesto | Battle cry | P0 | ✅ Complete |
| 1. NOOL | Intent / Abstraction / Chain | P0 | ✅ Complete |
| 2. Research Req | Evidence gaps | P0 | ⬜ |
| 3. Outline | Section skeleton | P0 | ⬜ |
| 4. Write | Section-by-section | P0 | ⬜ |
| 5. Audit | Quality gate | P1 | ⬜ |
| 6. Submit | Venue formatting | P1 | ⬜ |

### Success Criteria

- [ ] Architecture diagram clearly shows all components (MCP, WASM, OpenRouter, Agent Registry)
- [ ] Hevner's 7 guidelines explicitly addressed
- [ ] 165-test evaluation results presented with statistical analysis
- [ ] Cost analysis ($0.00/run free tier vs. paid alternatives)
- [ ] Comparison with existing tools (ChatArena, LMArena, CrewAI)
- [ ] Paper stands alone (cites B1 but readable independently)

---

## Evolution History

| Version | Date | Layer Changed | What Changed |
|---------|------|---------------|--------------|
| v0.1 | 2026-03-15 | All | Initial NOOL from SPAR-2026-03-15-PAPER-HARVEST |

---

> *நூல் (nool): the thread that connects, the text that records, the classic that endures.*
