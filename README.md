<p align="center">
  <span style="font-size: 100px;">🥊</span>
</p>

<h1 align="center">🥊 sparkit</h1>

<p align="center">
  <strong>Run AI persona debates from your terminal or browser</strong><br>
  <em>The official implementation of the SPAR methodology for AI-Persona Mode</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sparkit"><img src="https://img.shields.io/npm/v/sparkit.svg" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://synthanai.github.io/spar-kit"><img src="https://img.shields.io/badge/playground-live-orange.svg" alt="Try Now"></a>
  <img src="https://img.shields.io/badge/tests-140%2B%20passing-brightgreen.svg" alt="Tests">
</p>

<p align="center">
  <strong>நாலு பேரு, நாலு திசை, ஒரு முடிவு!</strong><br>
  <em>One methodology. Five modes. Every decision.</em>
</p>

---

## Installation

### Web (No Install)
**[▶️ synthanai.github.io/spar-kit](https://synthanai.github.io/spar-kit)**

### ChatGPT GPT (No Install)
**[🤖 SPAR Decision Partner](https://chatgpt.com/g/g-69678df7ed248191be8fd211e11d4797)** — Use SPAR directly in ChatGPT

### CLI
```bash
npm install -g sparkit
```

---

## Usage

```bash
# 🎯 Launch TUI Mission Control (recommended)
sparkit tui

# 🧙 Launch SPAR Builder wizard
sparkit builder

# ⚡ Quick debate
sparkit "Should we expand to Singapore?"

# 📝 Full command
sparkit debate start "Your decision here"

# 📦 Use a template
sparkit template use startup-pivot
```

### TUI Features (v4.0.0)

- **Dashboard**: View all sessions with status indicators
- **Session Management**: Pause, resume, cancel, clone debates
- **Live Monitoring**: Watch debates unfold in real-time
- **Persona Browser**: Browse 109 personas across 7 archetypes
- **3-Round Rumble**: Structured Opening → Clash → Final protocol
- **Keyboard Navigation**: Full keyboard control (see `docs/KEYBOARD_SHORTCUTS.md`)

---

## Commands

### Core Commands
| Command | Description |
|---------|-------------|
| `spar` | Start interactive debate |
| `spar tui` | **NEW!** Launch Mission Control TUI |
| `spar builder` | **NEW!** Launch SPAR Builder wizard |
| `spar debate start [topic]` | Start debate session |
| `spar debate history` | View past sessions |

### Template Commands (NEW!)
| Command | Description |
|---------|-------------|
| `spar template list` | Show all templates |
| `spar template show <id>` | View template details |
| `spar template use <id>` | Use template to start debate |
| `spar template create` | Create custom template |
| `spar template delete <id>` | Delete a template |

### Built-in Templates
| Template | Preset | Use Case |
|----------|--------|----------|
| `startup-pivot` | 🚀 Startup | Evaluate major pivots |
| `hiring-decision` | 💼 Corporate | Should you hire this person? |
| `investment-eval` | 💼 Corporate | Evaluate investments |
| `product-launch` | 🎨 Innovation | Launch readiness |
| `crisis-response` | ⚠️ Crisis | Emergency decisions |
| `ethics-dilemma` | ⚖️ Ethics | Navigate ethical situations |

### Other Commands
| Command | Description |
|---------|-------------|
| `spar persona list` | Show all 108 personas |
| `spar persona create` | Create custom persona |
| `spar config setup` | Configure provider & API key |
| `spar config show` | View configuration |
| `spar status` | Show version & stats |
| `spar compass` | Display N-E-W-S framework |

---

## The SPARKIT Protocol

```
S — SCOPE       Define the question precisely
P — POPULATE    Instantiate clashing personas  
A — ANNOUNCE    Present the challenge equally
R — RUMBLE      3-round structured dialectic:
                - R1: Opening (1500 tokens)
                - R2: Clash (1200 tokens)
                - R3: Final (1000 tokens)
K — KNIT        Moderator synthesizes tensions (21k tokens)
I — INTERROGATE Stress-test the synthesis
T — TRANSMIT    Extract actionable recommendations
```

---

## The Four Directions

```
                    🔵 NORTH
                   The Visionary
                "Where are we going?"
                         │
    🔴 WEST ─────────────┼───────────── 🟢 EAST
    The Sage             │          The Challenger
 "What's proven?"        │       "What's emerging?"
                         │
                    🟡 SOUTH
                  The Pragmatist
               "What's grounded?"
```

---

## Configuration

**Global config:** `~/.spar/`

```
~/.spar/
├── config.json     # Provider + API key
├── personas/       # Custom personas
└── sessions/       # Auto-saved debates
```

---

## Providers

### OpenRouter (Recommended) 🆕

**FREE-Optimal** configuration validated at 100% success, $0.00/run:

| Role | Model | Use |
|------|-------|-----|
| Debaters | `google/gemini-2.0-flash-exp:free` | Fast, 1M context |
| Arbiter | `deepseek/deepseek-r1-0528:free` | True reasoning |
| Critic | `meta-llama/llama-3.3-70b-instruct:free` | Balanced rigor |

📖 **[OpenRouter Integration Guide →](docs/OPENROUTER_INTEGRATION.md)**

### Other Providers

| Provider | Model |
|----------|-------|
| OpenAI | GPT-4 Turbo |
| Anthropic | Claude 3.5 Sonnet |
| Google | Gemini 1.5 Flash |

---

## Security

- API keys stored locally in `~/.spar/config.json`
- No server — direct API calls to your provider
- Web version uses browser localStorage

---

## Testing

```bash
# Run all tests (102 tests)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Suite

| Suite | Tests | Coverage |
|-------|-------|----------|
| `cli.test.js` | CLI configuration, personas, providers, validation | ✅ |
| `spar.test.js` | HTML structure, accessibility, JavaScript engine | ✅ |
| `style.test.js` | CSS variables, layout, components, syntax | ✅ |
| `integration.test.js` | Full debate flow, cross-component consistency | ✅ |

---

## SPAR Methodology

This toolkit implements the **SPAR** methodology — Structured Persona-Argumentation for Reasoning. Documentation:

| Resource | Description |
|----------|-------------|
| **[SPARKIT Protocol](docs/gpts/knowledge/SPARKIT_PROTOCOL.md)** | The 7-step methodology |
| **[Four Directions](docs/gpts/knowledge/FOUR_DIRECTIONS.md)** | N-E-W-S compass model |
| **[ASPIRES Framework](docs/gpts/knowledge/ASPIRES_FRAMEWORK.md)** | 7 advanced patterns |
| **[Persona Library](docs/gpts/knowledge/PERSONA_LIBRARY.md)** | 108 ready-to-use personas |
| **[Arena Templates](docs/gpts/knowledge/ARENA_TEMPLATES.md)** | Pre-configured debate formations |
| **[ChatGPT GPT](https://chatgpt.com/g/g-69678df7ed248191be8fd211e11d4797)** | Try SPAR in ChatGPT |

---

## Example

```bash
$ spar "Should we pivot from B2B to B2C?"

╔═══════════════════════════════════════════════════════════════╗
║   🥊  S P A R   v4.0.0                                        ║
╚═══════════════════════════════════════════════════════════════╝

═══ RUMBLE — Round 1/3: Opening ═══
  Token budget: 1500 tokens

🔵 North — "B2C is where the scale is..."
🟢 East — "The market is shifting..."
🟡 South — "Do you have the capital?"
🔴 West — "Every B2C company started with B2B..."

═══ RUMBLE — Round 2/3: The Clash ═══
═══ RUMBLE — Round 3/3: Final Positions ═══

✓ 3-Round Rumble Complete
📊 SYNTHESIS: Key Tensions, Evolution, Insights
✓ Session saved to ~/.spar/sessions/...
```

---

## Development

```bash
git clone https://github.com/synthanai/spar-kit.git
cd spar-kit
npm install
npm test        # Run 102 tests
node cli/index.js
```

---

## Links

- **[ChatGPT GPT](https://chatgpt.com/g/g-69678df7ed248191be8fd211e11d4797)** — Use SPAR in ChatGPT
- **[Web Playground](https://synthanai.github.io/spar-kit)** — Try in browser
- **[npm Package](https://www.npmjs.com/package/sparkit)** — Install via npm
- **[SPARKIT Protocol](docs/gpts/knowledge/SPARKIT_PROTOCOL.md)** — 7-step methodology
- **[ASPIRES Framework](docs/gpts/knowledge/ASPIRES_FRAMEWORK.md)** — Advanced patterns

---

## License

MIT © [Naveen Riaz Mohamed Kani](https://github.com/synthanai)

---

<p align="center">
  <em>Don't deliberate alone. SPAR.</em> 🥊
</p>
