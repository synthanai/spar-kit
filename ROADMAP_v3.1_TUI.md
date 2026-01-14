# SPAR-Kit v3.1 TUI Mission Control — Implementation Roadmap

**Version**: 3.1.0  
**Codename**: Mission Control  
**Created**: 2026-01-14  
**Status**: 🚧 In Progress

---

## 🎯 Vision

Transform `sparkit status` from a static printout into an **interactive terminal dashboard** where users can browse, inspect, resume, restart, and manage all SPAR sessions.

---

## 📋 Master Task List

### Phase 1: Foundation (v3.1.0)

#### 1.1 Project Setup
- [ ] **TASK-001**: Add Ink and React dependencies to package.json
- [ ] **TASK-002**: Create TUI directory structure (`cli/tui/`)
- [ ] **TASK-003**: Set up TUI entry point (`cli/tui/index.js`)
- [ ] **TASK-004**: Create shared component library (`cli/tui/components/`)

#### 1.2 Core TUI Components
- [ ] **TASK-005**: Create `<Dashboard>` main screen component
- [ ] **TASK-006**: Create `<SessionList>` with keyboard navigation
- [ ] **TASK-007**: Create `<SessionDetail>` view component
- [ ] **TASK-008**: Create `<PhaseView>` drill-down component
- [ ] **TASK-009**: Create `<StatusBar>` footer component
- [ ] **TASK-010**: Create `<Header>` banner component

#### 1.3 State Management
- [ ] **TASK-011**: Create session store (`cli/tui/store/sessions.js`)
- [ ] **TASK-012**: Create config store (`cli/tui/store/config.js`)
- [ ] **TASK-013**: Create navigation store (`cli/tui/store/navigation.js`)

---

### Phase 2: Session Management (v3.2.0)

#### 2.1 Enhanced Session Schema
- [ ] **TASK-014**: Extend session JSON with checkpoint data
- [ ] **TASK-015**: Add session state machine (running/paused/completed/aborted)
- [ ] **TASK-016**: Add metrics tracking (tokens, duration, LLM calls)

#### 2.2 Session Operations
- [ ] **TASK-017**: Implement pause/resume capability
- [ ] **TASK-018**: Implement session cancellation with cleanup
- [ ] **TASK-019**: Implement "Clone & Re-run" feature
- [ ] **TASK-020**: Implement session deletion with confirmation
- [ ] **TASK-021**: Implement session export (MD, JSON, TXT)

#### 2.3 Non-Interactive CLI Commands
- [ ] **TASK-022**: Add `sparkit list --json` for scripting
- [ ] **TASK-023**: Add `sparkit show <id>` session details
- [ ] **TASK-024**: Add `sparkit resume <id>` command
- [ ] **TASK-025**: Add `sparkit cancel <id>` command
- [ ] **TASK-026**: Add `sparkit export <id> --output=file` command

---

### Phase 3: Live Monitoring (v3.3.0)

#### 3.1 Real-Time Features
- [ ] **TASK-027**: Create `<LiveSession>` streaming component
- [ ] **TASK-028**: Implement progress bar for debate phases
- [ ] **TASK-029**: Add "Skip to Synthesis" emergency action
- [ ] **TASK-030**: Implement background mode with status polling

#### 3.2 Notifications
- [ ] **TASK-031**: Add terminal bell notifications
- [ ] **TASK-032**: Add desktop notifications (optional)
- [ ] **TASK-033**: Create completion summary screen

---

### Phase 4: Testing Suite

#### 4.1 Unit Tests (`__tests__/unit/`)
- [ ] **TASK-034**: Test session store operations
- [ ] **TASK-035**: Test config store operations
- [ ] **TASK-036**: Test state machine transitions
- [ ] **TASK-037**: Test session schema validation
- [ ] **TASK-038**: Test export functions (MD, JSON, TXT)
- [ ] **TASK-039**: Test checkpoint serialization/deserialization

#### 4.2 Component Tests (`__tests__/components/`)
- [ ] **TASK-040**: Test `<Dashboard>` rendering
- [ ] **TASK-041**: Test `<SessionList>` keyboard navigation
- [ ] **TASK-042**: Test `<SessionDetail>` phase display
- [ ] **TASK-043**: Test `<LiveSession>` streaming updates

#### 4.3 Integration Tests (`__tests__/integration/`)
- [ ] **TASK-044**: Test full debate flow (start → complete)
- [ ] **TASK-045**: Test pause/resume flow
- [ ] **TASK-046**: Test clone & re-run flow
- [ ] **TASK-047**: Test CLI command output format
- [ ] **TASK-048**: Test session persistence across restarts

#### 4.4 End-to-End Tests (`__tests__/e2e/`)
- [ ] **TASK-049**: E2E: New debate with Ollama
- [ ] **TASK-050**: E2E: TUI navigation and selection
- [ ] **TASK-051**: E2E: Export and file verification
- [ ] **TASK-052**: E2E: Error recovery scenarios

---

### Phase 5: Security & Validation

#### 5.1 Input Validation (`cli/security/`)
- [ ] **TASK-053**: Validate decision text (XSS prevention)
- [ ] **TASK-054**: Validate persona IDs (injection prevention)
- [ ] **TASK-055**: Validate file paths (path traversal prevention)
- [ ] **TASK-056**: Validate session IDs (UUID format)
- [ ] **TASK-057**: Sanitize LLM responses before display

#### 5.2 Configuration Security
- [ ] **TASK-058**: Validate API keys format (never log/display)
- [ ] **TASK-059**: Validate base URLs (whitelist patterns)
- [ ] **TASK-060**: Validate model names (alphanumeric + allowed chars)
- [ ] **TASK-061**: Add config file permissions check (warn if world-readable)

#### 5.3 Session Security
- [ ] **TASK-062**: Validate session JSON before loading
- [ ] **TASK-063**: Add session file integrity check (optional hash)
- [ ] **TASK-064**: Sanitize session data before export
- [ ] **TASK-065**: Prevent session ID enumeration

#### 5.4 Security Tests (`__tests__/security/`)
- [ ] **TASK-066**: Test XSS payload in decision text
- [ ] **TASK-067**: Test path traversal in export path
- [ ] **TASK-068**: Test malformed session JSON handling
- [ ] **TASK-069**: Test API key masking in logs
- [ ] **TASK-070**: Test SSRF prevention in base URLs

---

### Phase 6: Performance & Load Testing

#### 6.1 Performance Tests (`__tests__/performance/`)
- [ ] **TASK-071**: Benchmark session list loading (1000+ sessions)
- [ ] **TASK-072**: Benchmark session detail rendering
- [ ] **TASK-073**: Benchmark TUI startup time (< 500ms target)
- [ ] **TASK-074**: Benchmark memory usage during long debates
- [ ] **TASK-075**: Profile LLM streaming performance

#### 6.2 Load Tests (`__tests__/load/`)
- [ ] **TASK-076**: Stress test concurrent debate sessions
- [ ] **TASK-077**: Stress test rapid TUI navigation
- [ ] **TASK-078**: Stress test session file I/O
- [ ] **TASK-079**: Memory leak detection during extended sessions

#### 6.3 Performance Optimizations
- [ ] **TASK-080**: Implement lazy loading for session list
- [ ] **TASK-081**: Add session index for fast lookups
- [ ] **TASK-082**: Implement virtual scrolling for large lists
- [ ] **TASK-083**: Add response caching for repeated queries

---

### Phase 7: API & Programmatic Access

#### 7.1 Public API (`cli/api/`)
- [ ] **TASK-084**: Create programmatic API entry point
- [ ] **TASK-085**: Expose `createSession(options)` function
- [ ] **TASK-086**: Expose `getSession(id)` function
- [ ] **TASK-087**: Expose `listSessions(filters)` function
- [ ] **TASK-088**: Expose `exportSession(id, format)` function

#### 7.2 API Tests (`__tests__/api/`)
- [ ] **TASK-089**: Test programmatic session creation
- [ ] **TASK-090**: Test session retrieval
- [ ] **TASK-091**: Test session listing with filters
- [ ] **TASK-092**: Test export formats
- [ ] **TASK-093**: Test error handling and edge cases

#### 7.3 API Documentation
- [ ] **TASK-094**: Create API reference documentation
- [ ] **TASK-095**: Add JSDoc comments to all exports
- [ ] **TASK-096**: Create usage examples

---

### Phase 8: Documentation & Release

#### 8.1 Documentation
- [ ] **TASK-097**: Update README.md with TUI instructions
- [ ] **TASK-098**: Create TUI_GUIDE.md detailed documentation
- [ ] **TASK-099**: Update CHANGELOG.md for v3.1.0
- [ ] **TASK-100**: Create KEYBOARD_SHORTCUTS.md reference

#### 8.2 Release Preparation
- [ ] **TASK-101**: Final test pass on all platforms (macOS, Linux, Windows)
- [ ] **TASK-102**: Update version to 3.1.0
- [ ] **TASK-103**: Create Git tag v3.1.0
- [ ] **TASK-104**: Publish to npm registry
- [ ] **TASK-105**: Announce release

---

## 📁 New Directory Structure

```
spar-kit/
├── cli/
│   ├── index.js              # Existing CLI entry
│   ├── methodology.js        # Existing methodology content
│   ├── personas.js           # Existing persona library
│   ├── providers.js          # Existing LLM providers
│   ├── tui/                   # NEW: TUI components
│   │   ├── index.js          # TUI entry point
│   │   ├── App.js            # Main TUI app
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── SessionList.js
│   │   │   ├── SessionDetail.js
│   │   │   ├── PhaseView.js
│   │   │   ├── LiveSession.js
│   │   │   ├── Header.js
│   │   │   └── StatusBar.js
│   │   └── store/
│   │       ├── sessions.js
│   │       ├── config.js
│   │       └── navigation.js
│   ├── api/                   # NEW: Programmatic API
│   │   └── index.js
│   └── security/              # NEW: Security utilities
│       ├── validation.js
│       └── sanitization.js
├── __tests__/
│   ├── unit/                  # NEW: Unit tests
│   ├── components/            # NEW: Component tests
│   ├── integration/           # Existing + enhanced
│   ├── e2e/                   # NEW: End-to-end tests
│   ├── security/              # NEW: Security tests
│   ├── performance/           # NEW: Performance tests
│   ├── load/                  # NEW: Load tests
│   └── api/                   # NEW: API tests
└── docs/
    ├── TUI_GUIDE.md
    ├── API_REFERENCE.md
    └── KEYBOARD_SHORTCUTS.md
```

---

## 🔧 Dependencies to Add

```json
{
  "dependencies": {
    "ink": "^4.4.1",
    "ink-spinner": "^5.0.0",
    "ink-table": "^3.1.0",
    "ink-text-input": "^5.0.1",
    "ink-select-input": "^5.0.0",
    "react": "^18.2.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "ink-testing-library": "^3.0.0",
    "clinic": "^13.0.0",
    "autocannon": "^7.15.0"
  }
}
```

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| TUI startup time | < 500ms |
| Session list render (1000 items) | < 200ms |
| Test coverage | > 85% |
| Security test pass rate | 100% |
| Memory usage (idle) | < 50MB |
| npm package size | < 500KB |

---

## 🚀 Current Sprint: Foundation

**Active Tasks**: TASK-001 through TASK-013

