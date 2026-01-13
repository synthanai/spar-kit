# 🥊 SPAR Kit

**Run AI persona debates in your browser or terminal. No installation required.**

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு!**
> *Four Perspectives, Four Dimensions, One Synthesis*

---

## 🚀 Try It Now

### Web (Instant)

**[▶️ Launch SPAR Kit](https://synthanai.github.io/spar-kit)** — No installation, runs in your browser.

### CLI (Enterprise-Ready)

```bash
# Run directly (no install)
npx spar-kit

# Or install globally
npm install -g spar-kit
spar run "Should we expand to Singapore?"
```

**CLI Features:**
- ✅ Interactive setup wizard
- ✅ Credentials stored locally (`~/.spar-kit.json`)
- ✅ Parallel API execution
- ✅ Beautiful terminal output
- ✅ Markdown export
- ✅ No browser required — perfect for enterprise/CI

---

## What is SPAR Kit?

SPAR Kit is a browser-based tool for running [SPAR](https://github.com/synthanai/spar) debates — structured disagreement between AI personas to stress-test your decisions.

```
                    🔵 NORTH
                   The Visionary
                "Where are we going?"
                         │
                         │
         🔴 WEST ────────┼──────── 🟢 EAST
         The Sage        │        The Challenger
     "What's proven?"    │     "What's emerging?"
                         │
                         │
                    🟡 SOUTH
                  The Pragmatist
               "What's grounded?"
```

### Features

- ✅ **Zero installation** — runs entirely in your browser
- ✅ **Multi-provider** — OpenAI, Anthropic, or Google Gemini
- ✅ **Parallel execution** — all 4 personas run simultaneously
- ✅ **Two-round debates** — opening positions + the clash
- ✅ **Auto-synthesis** — AI moderator summarizes tensions & insights
- ✅ **Markdown export** — save your SPAR sessions
- ✅ **Privacy-first** — API keys never leave your browser

---

## How It Works

1. **Enter your API key** (OpenAI, Anthropic, or Gemini)
2. **Describe your decision** in the text area
3. **Click SPAR** — four personas debate in parallel
4. **Read the clash** — Round 2 surfaces tensions
5. **Export your session** — Markdown download

---

## The Four Directions

| Direction | Persona | Core Question |
|-----------|---------|---------------|
| 🔵 **North** | The Visionary | "Where are we going?" |
| 🟢 **East** | The Challenger | "What's emerging?" |
| 🟡 **South** | The Pragmatist | "What's grounded?" |
| 🔴 **West** | The Sage | "What's proven?" |

**Natural tensions:**
- **North ↔ South**: Vision vs. Reality
- **East ↔ West**: Innovation vs. Tradition

---

## Self-Hosting

SPAR Kit is a static site. To host your own:

```bash
git clone https://github.com/synthanai/spar-kit.git
cd spar-kit
# Open index.html in your browser, or:
python -m http.server 8000
# Visit http://localhost:8000
```

---

## Privacy & Security

- 🔒 **Your API key stays local** — stored only in your browser session
- 🔒 **No backend** — all AI calls go directly to provider APIs
- 🔒 **No tracking** — no analytics, no cookies, no data collection
- 🔒 **Open source** — audit the code yourself

---

## Related

- **[SPAR](https://github.com/synthanai/spar)** — The methodology, principles, and persona library
- **[SPAR in 5 Minutes](https://github.com/synthanai/spar/blob/main/quick-start/SPAR_IN_5_MINUTES.md)** — Manual quickstart guide

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Ideas for contribution:
- 🎨 UI/UX improvements
- 🌍 Translations
- 🔌 Additional AI provider integrations
- 📱 Mobile optimization
- ♿ Accessibility improvements

---

## License

MIT License — use freely, attribute kindly.

---

## Author

**Naveen Riaz Mohamed Kani**

Built with the SPAR methodology — using structured disagreement to stress-test the tool itself.

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு.**
> **Four Perspectives, Four Dimensions, One Synthesis.**

*Don't deliberate alone. SPAR.* 🥊
