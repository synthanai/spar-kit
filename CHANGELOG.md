# SPAR-Kit Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.0.0-methodology] - 2026-03-10

### 🚀 Highlights

- **8-Step Protocol (v8.0)**: ABSTRACT elevated from POPULATE sub-activity to dedicated Step 3
- **TESSERACT Configuration System**: 504 possible debate configurations across 4 axes
- **Reasoning Depth Modes**: 6 calibrated modes from Show Me to Ultra
- **NOOL Integration**: IoT-AoT-CoT three-layer reasoning stack as Step 0

### Added

#### New Methodology Documents
- `methodology/ABSTRACT.md` - Full AoT v2.0 specification (Type 1-3 abstraction)
- `methodology/TESSERACT.md` - 4-axis configuration system (504 combos)
- `methodology/DEPTH_MODES.md` - 6 reasoning depth modes with selection guide
- `methodology/CENTRE.md` - Centre Behavioral Analyst (always-on, Human 5 Whats)
- `methodology/6R_ENGINE.md` - Backstage cognition loop
- `methodology/SPARED.md` - Coaching cycle (5 phases)
- `methodology/RAMP_LEVELS.md` - Decision gravity assessment (5 levels)
- `methodology/ARENA_MITOSIS.md` - Recursive arena spawning (3 modes)
- `methodology/COMMIT_DEPTH.md` - Graduated autonomy (4 levels)
- `methodology/DOORS.md` - Decision exit framework
- `methodology/FEEDBACK_RESOLUTION.md` - Disagreement disposition protocol
- `methodology/LOOP_GOVERNANCE.md` - Hard limits and circuit breakers
- `methodology/DEBATE_LINEAGE.md` - Session relationship tracking

#### Protocol Enhancements
- Step 0: NOOL (State deliberation intent before scoping)
- Step 3: ABSTRACT (Construct cognitive map before debate)
- GRACE check integrated into RUMBLE rounds
- 6R Engine backstage cognition loop
- Checkpoint decision tables for all transitions
- TRANSMIT now includes Dissent Record and Conditions

### Changed

- **Protocol**: 7-step → 8-step (SCOPE, POPULATE, **ABSTRACT**, ANNOUNCE → RUMBLE renamed to step 5)
- **NOOL.md**: Updated to v0.3 reflecting 8-step protocol
- **README.md**: Updated core concepts, added TESSERACT and depth modes

### Important

> **CLI Implementation**: The CLI remains at v4.1.0 and implements the 7-step protocol. The methodology documentation reflects v8.0. See [ROADMAP.md](./ROADMAP.md) for CLI v5.0 plans.

---

## [4.1.0] - 2026-01-15

### 🚀 Highlights

- **OpenRouter FREE-Optimal Integration**: Production-validated multi-model debates at $0.00/run
- **Tiered Dialectic Architecture (TDA)**: Empirically proven optimal allocation pattern
- **65-Run Research Validation**: Comprehensive hypothesis testing with publication-ready claims

### Added

#### OpenRouter Integration
- `docs/OPENROUTER_INTEGRATION.md` - Complete integration guide
- FREE model registry with 26 models across 3 tiers
- Token tier system: Compact → Cosy → Comprehensive → Ultra
- Rate limit mitigation with exponential backoff
- Fallback API key support for resilience

#### Validated Configurations
- **FREE-Optimal**: Gemini Flash + DeepSeek R1 + Llama 70B
  - 100% success rate
  - 42s average synthesis time
  - $0.00 per run
  - ~95% quality vs premium tier

#### Research Documentation
- `research/MULTI_MODEL_VALIDATION.md` - Full 65-run research protocol
- TDA architecture documentation
- Publication-ready claims with confidence levels

### Changed

- OpenRouter now recommended as primary provider
- README updated with validated metrics
- Default configuration: FREE-Optimal with Comprehensive token tier

### Research Findings

| Finding | Evidence | Confidence |
|---------|----------|------------|
| Arbiter quality is critical | Inverse config failed 40% | 95% |
| FREE models are production-viable | 100% success @ $0.00 | 90% |
| SPAR protocol adds +53% quality | Multi-model beats single premium | 88% |

---

## [4.0.0] - 2026-01-14

### 🚀 Highlights

- **Ultrathink Enhancement**: Model-agnostic reasoning modes (Standard, Ultrathink, Maximum)
- **Complete Testing Suite**: 140+ tests across unit, component, integration, E2E, security, and performance
- **Security Hardening**: Full input validation, session integrity, and sanitization
- **Programmatic API**: Full-featured API with JSDoc documentation

### Added

#### Phase 4: Testing Suite (100%)
- Unit tests: session store, config, export, providers, bias, confidence, **checkpoint serialization**
- Component tests: Dashboard, SessionList, SessionDetail, LiveSession
- Integration tests: debate flow, pause/resume, clone
- E2E tests: Ollama debates, TUI navigation, export verification, error recovery
- Security tests: XSS, path traversal, session validation, API key masking, SSRF prevention
- Performance tests: session loading, rendering, TUI startup, memory usage, streaming

#### Phase 5: Security (100%)
- `checkConfigPermissions()` - Warn if config is world-readable
- `computeSessionHash()` - SHA-256 session integrity verification
- `verifySessionIntegrity()` - Verify session hasn't been tampered
- `sanitizeSessionForExport()` - Remove sensitive data before export
- `generateSecureSessionId()` - Cryptographically secure UUIDs

#### Phase 6: Performance (100%)
- Load tests: concurrent sessions, rapid navigation, file I/O, memory leaks
- Performance optimizations: lazy loading, session indexing, virtual scrolling, response caching

#### Phase 7: API (100%)
- Complete programmatic API (`cli/api/index.js`)
- API tests with full coverage
- Usage examples documentation (`docs/API_EXAMPLES.md`)

#### Documentation
- `docs/TUI_GUIDE.md` - Complete TUI usage guide
- `docs/KEYBOARD_SHORTCUTS.md` - Full keyboard reference
- `docs/API_EXAMPLES.md` - Programmatic API examples
- `docs/INTEGRATION_TESTING.md` - Testing plan

### Changed

- **Ultrathink is now model-agnostic**: Works with any provider, not just specific models
- **Reasoning modes**: Standard, Ultrathink, Maximum - user chooses depth
- **Provider flexibility**: Users select provider and model independently

### Fixed

- Dynamic persona summary in web UI (was hardcoded)
- Persona selection now shows actual selected names

### 🥊 3-Round Rumble Protocol (NEW)

- **Debates now run 3 rounds by default**: Opening → Clash → Final Positions
- **Staged Token Budgets**:
  - Round 1 Opening: 1,500 tokens
  - Round 2 Clash: 1,200 tokens
  - Round 3 Final: 1,000 tokens
  - Knit Synthesis: 21,000 tokens
- **Role-Based Model Tiering**: Debaters (Balanced) vs Supervisors (High/Ultra)
- **Checkpoint/Resume Foundation**: Phase tracking with `createCheckpoint()`
- **Escalation Protocol**: Auto-escalate on quality failures
- **New Module**: `cli/debate-config.js` with production-validated settings
- **New Docs**: `docs/DEBATE_CONFIG.md` with full API reference

---

## [3.3.0] - 2026-01-13

### Added

- **Ultrathink Enhancement Phase** (Phase 9)
  - Feasibility study and infrastructure assessment
  - Provider strategy documentation
  - Risk profile analysis
  - Adaptive learning design
  - Success metrics and monitoring

### Changed

- Refactored `providers.js` to make Ultrathink a reasoning mode setting
- Removed hardcoded model suggestions
- Deprecated tier-based functions

---

## [3.2.0] - 2026-01-12

### Added

- TUI Mission Control
  - Dashboard with session list
  - Session detail view with phase breakdown
  - Live session monitoring
  - Completion summary
- Session management
  - Pause/resume/cancel/clone
  - Auto-save and recovery
  - Metrics tracking (duration, tokens, LLM calls)
- SPARKIT Protocol wizard
  - Sequential step-by-step flow
  - Persona browser with 109 personas
  - Preset packs for common scenarios

---

## [3.1.0] - 2026-01-10

### Added

- Template system
  - `sparkit template list/show/use/create/delete`
  - Built-in templates for common decisions
- Non-interactive session commands
- Tamil language support (i18n)

---

## [3.0.0] - 2026-01-08

### Added

- Complete rewrite with modular architecture
- TUI foundation using Ink/React
- State management with Zustand
- Provider abstraction layer
- 108-persona library

### Breaking Changes

- CLI commands restructured to `resource-action` pattern
- Configuration moved to `~/.spar/`
- Package renamed to `sparkit`

---

## [2.7.0] - 2025-12-15

### Added

- SPARKIT 7-step protocol
- ASPIRES advanced patterns
- Persona presets

---

## [2.0.0] - 2025-11-01

### Added

- Web interface (single-file HTML)
- Multiple provider support (OpenAI, Anthropic, Gemini)
- N-E-W-S compass visualization

---

## [1.0.0] - 2025-10-01

### Added

- Initial release
- Basic CLI debate flow
- Four default personas (Visionary, Challenger, Pragmatist, Sage)
- Markdown export

---

*SPAR-Kit is part of the [SPAR Methodology](https://github.com/synthanai/spar)*
