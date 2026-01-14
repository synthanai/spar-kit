# SPAR-Kit Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
