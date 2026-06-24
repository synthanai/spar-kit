# SPAR-Kit TUI Guide

The interactive Terminal User Interface (TUI) for SPAR-Kit provides a visual, keyboard-driven experience for managing debates.

## Quick Start

```bash
# Launch TUI
spar tui

# Or use npx
npx sparkit tui
```

---

## Navigation

### Global Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Move selection |
| `Enter` | Select / Confirm |
| `←` / `Esc` | Go back |
| `Q` | Quit |
| `?` | Help |

### Dashboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New debate (Builder wizard) |
| `T` | Browse templates |
| `R` | Refresh session list |
| `S` | Open settings |

### Session View Shortcuts

| Key | Action |
|-----|--------|
| `E` | Export to Markdown |
| `C` | Clone session |
| `D` | Delete session |

---

## Views

### 📊 Dashboard

The main view showing:
- **Session Statistics** — Total, completed, running, failed counts
- **Recent Sessions** — Last 5 sessions with status
- **Quick Actions** — New debate, templates, settings

### 🛠️ SPAR Builder

A 5-step wizard for creating debates:

1. **SCOPE** — Define your decision question
2. **POPULATE** — Choose persona preset or build custom panel
3. **RULES** — Set rounds and debate style
4. **ENGINE** — Select AI provider (Ollama, OpenAI, etc.)
5. **REVIEW** — Preview and launch

### 📋 Session Detail

Detailed view of a completed debate:
- Decision text
- Phase-by-phase status
- Persona responses
- Synthesis and recommendations

### 📚 Template Browser

Browse and use debate templates:
- **Built-in Templates** — 6 ready-to-use templates
- **Your Templates** — Custom templates you've created
- **Variable Input** — Fill in placeholders

### ⚙️ Settings

Configure SPAR-Kit:
- **AI Engine** — Provider, model, API key
- **Appearance** — Theme, tips, confirmations
- **Debate Defaults** — Default rounds, preset

---

## Templates

### Built-in Templates

| Template | Use Case |
|----------|----------|
| `startup-pivot` | Evaluate major strategic pivots |
| `hiring-decision` | Should you hire this person? |
| `investment-eval` | Evaluate investments |
| `product-launch` | Product launch readiness |
| `crisis-response` | Emergency response decisions |
| `ethics-dilemma` | Navigate ethical situations |

### Using Templates

```bash
# From CLI
spar template use startup-pivot

# From TUI
Press T → Select template → Fill variables → Start
```

### Creating Templates

Templates use variable placeholders:

```
Decision: "Should we pivot from {current} to {new_direction}?"
Variables:
  - {current} → "B2B SaaS"
  - {new_direction} → "B2C marketplace"
```

---

## Configuration

### File Location

```
~/.spar/
├── config.json     # Settings
├── templates/      # Custom templates
└── sessions/       # Saved debates
```

### Settings Reference

| Setting | Description | Default |
|---------|-------------|---------|
| `provider` | LLM provider | `ollama` |
| `model` | Model name | `mistral:latest` |
| `baseUrl` | API endpoint | Provider default |
| `apiKey` | API key | None |
| `tui.theme` | Color theme | `dark` |
| `tui.showTips` | Show tips | `true` |
| `tui.confirmDelete` | Confirm deletes | `true` |
| `debate.defaultRounds` | Default rounds | `2` |
| `tui.defaultPreset` | Default preset | `innovation` |

---

## Keyboard Reference

### Full Shortcuts

```
┌───────────────────────────────────────────────────────────────┐
│ GLOBAL                                                         │
├───────────────────────────────────────────────────────────────┤
│ ↑/↓        Navigate           Q        Quit                   │
│ Enter      Select              ?        Help                   │
│ ←/Esc      Back                                                │
├───────────────────────────────────────────────────────────────┤
│ DASHBOARD                                                      │
├───────────────────────────────────────────────────────────────┤
│ N          New debate          T        Templates              │
│ R          Refresh             S        Settings               │
├───────────────────────────────────────────────────────────────┤
│ SESSION                                                        │
├───────────────────────────────────────────────────────────────┤
│ E          Export              C        Clone                  │
│ D          Delete              P        Pause (live)           │
└───────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### TUI Won't Launch

```bash
# Reinstall dependencies
cd /path/to/spar-kit
rm -rf node_modules
npm install

# Check for errors
npm run tui
```

### Missing Dependencies

The TUI requires:
- `ink` — React for CLI
- `react` — React library
- `zustand` — State management

Install with:
```bash
npm install ink react zustand
```

### Terminal Compatibility

The TUI works best in:
- iTerm2 (macOS)
- Windows Terminal
- Most Linux terminals with Unicode support

Minimum terminal size: 80×24 characters

---

## API Access

For programmatic access, use the API:

```javascript
import sparkit from 'sparkit/api';

// Initialize
const info = sparkit.initialize();

// Create session
const session = sparkit.createSession({
  decision: 'Should we expand to Singapore?',
  preset: 'startup'
});

// List sessions
const sessions = sparkit.listSessions({ limit: 10 });

// Export
const result = sparkit.exportSession(session.id, { format: 'md' });
```

---

🥊 **Don't deliberate alone. SPAR.**
