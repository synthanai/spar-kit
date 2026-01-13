# Changelog

All notable changes to SPAR Kit will be documented in this file.

## [2.7.0] - 2026-01-14

### Added
- 🧪 **Comprehensive Test Suite** — 102 tests across 4 test files
  - `cli.test.js` — CLI configuration, personas, providers, validation
  - `spar.test.js` — HTML structure, accessibility, JavaScript engine
  - `style.test.js` — CSS variables, layout, components, syntax validation
  - `integration.test.js` — Full debate flow, cross-component consistency
- 🔧 **Jest Configuration** — ES modules support with coverage reporting
- 📦 **DevDependencies** — jest, jsdom, @testing-library/dom

### Changed
- 📋 `package.json` updated with test scripts and Jest config
- 🏷️ Version bumped to 2.7.0

### Test Coverage
- HTML structure and SEO attributes
- Persona definitions and consistency
- API provider configuration
- Input validation
- Markdown export format
- State management
- Parallel execution
- Error handling
- Tamil phrase consistency

---

## [2.6.0] - 2026-01-14

### Added
- 🎯 **SPARKIT Protocol** — Documentation for the 7-step dialectic engine
  - The tool name `spar-kit` now aligns with the `SPARKIT` backronym
  - Protocol reference added to README

### Philosophy
- **spar-kit** implements the **SPARKIT** protocol — *the tool embodies the method*

---

## [1.0.0] - 2026-01-13

### Added
- 🥊 Initial release of SPAR Kit
- 🧭 Four Directions compass UI (N-E-W-S personas)
- 🔌 Multi-provider support (OpenAI, Anthropic, Gemini)
- ⚡ Parallel API execution for all 4 personas
- ⚔️ Two-round debate structure (positions + clash)
- 📊 Auto-synthesis with AI moderator
- 📄 Markdown export for sessions
- 🌙 Dark mode design
- 📱 Responsive layout
- 🔒 Privacy-first (no backend, keys stay local)

### CLI
- 💻 Full command-line interface (`npx spar-kit` or `spar run`)
- 🔧 Interactive setup wizard
- 💾 Local credential storage (`~/.spar-kit.json`)
- 📤 Markdown session export
- 🏢 Enterprise-ready (no browser required)

### Tamil Wisdom Anchor
- நாலு பேரு நாலு விதமா பேசுவாங்க
- நாலு பேரு, நாலு திசை, ஒரு முடிவு

---

## [Unreleased]

### Planned
- Light mode toggle
- LocalStorage for saving sessions
- Additional AI providers
- PWA support for offline use
- Keyboard shortcuts
