# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.1] - 2026-01-14

### Fixed

- **Gemini API Model Deprecation** — `gemini-1.5-flash` was deprecated. Now uses dynamic model discovery to automatically fetch available models from the Gemini API and select the latest fast model (e.g., `gemini-2.0-flash`, `gemini-2.5-flash`). Falls back gracefully if the API call fails.
- **Compass Idle State Visual** — Enhanced the N-E-W-S compass to look polished before SPAR initiation with:
  - Added subtle breathing animation (`compassIdle`) with staggered delays per direction
  - Enhanced glow effects with inner shadows for more depth
  - Improved hover state that pauses the idle animation

### Changed

- Updated all Gemini model references from deprecated `gemini-1.5-*` to current `gemini-2.0-*` and `gemini-2.5-*` models
- CLI providers now mark Gemini as supporting `dynamicModelDiscovery`

---

## [3.1.0] - 2026-01-14

### Added

#### 🖥️ Mission Control TUI
- **Live Session View** — Real-time debate monitoring (foundation)
- **Settings Editor** — Interactive configuration management
- Launch with `spar tui` or `spar builder`

#### 📋 Template System
- **6 Built-in Templates**:
  - `startup-pivot` — Evaluate major strategic pivots
  - `hiring-decision` — Should you hire this person?
  - `investment-eval` — Evaluate investment opportunities
  - `product-launch` — Product launch readiness
  - `crisis-response` — Emergency response decisions
  - `ethics-dilemma` — Navigate ethical situations
- **Custom Templates** — Create and save your own
- **Variable Substitution** — Templates with placeholders
- New commands: `spar template list|show|use|create|delete`

#### 🔒 Security Layer
- **Input Validation** — XSS, path traversal, SSRF prevention
- **Output Sanitization** — Safe terminal and export output
- **API Key Masking** — Sensitive data protection in logs
- **Session Integrity** — Validation on load/save

#### 🧪 Comprehensive Test Suite
- **Security Tests** — Validation and sanitization coverage
- **Unit Tests** — Store operations and session management
- **Performance Tests** — Benchmarks for large session counts
- **API Tests** — Public API contract testing
- New commands: `npm run test:security|unit|performance|api`

#### 📡 Programmatic API
- Public API for integrations and CI/CD
- Methods: `createSession`, `getSession`, `listSessions`, `exportSession`, `deleteSession`, `cloneSession`, `getStats`, `getConfig`
- Import with: `import sparkit from 'sparkit/api'`

### Changed
- Version bump to 3.1.0
- Improved persona list display (now shows 108 personas)
- Enhanced session auto-save with more metadata

### Technical
- Added Ink (React for CLI) for TUI
- Added Zustand for state management
- New directory structure: `cli/tui/`, `cli/security/`, `cli/api/`

---

## [3.0.0] - 2026-01-13

### Added
- **Full SPAR Methodology Implementation**
- **SPARKIT Protocol** — 7-step debate process
- **SPARK Principles** — 5 foundational checks
- **ASPIRES Framework** — 7 advanced patterns
- **108 Personas** across 7 archetypes
- **Local LLM Support** — Ollama integration
- **Preset Packs** — news, startup, corporate, crisis, innovation, ethics
- **Session Auto-Save** — All debates saved to `~/.spar/sessions/`
- **Markdown Export** — Export debates to markdown files

### Changed
- Renamed package from `spar-kit` to `sparkit`
- Updated CLI to use `spar` and `sparkit` commands
- Improved error handling and validation

---

## [2.7.0] - 2026-01-10

### Added
- Initial public release
- Basic debate engine
- OpenAI, Anthropic, Gemini support
- Web playground

---

*🥊 Don't deliberate alone. SPAR.*
