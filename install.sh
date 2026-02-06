#!/bin/sh
# SPAR-Kit Universal Installer
# https://github.com/synthanai/spar-kit
#
# Usage: curl -fsSL https://raw.githubusercontent.com/synthanai/spar-kit/main/install.sh | sh
#
# Options:
#   --claude    Install Claude Code integration only
#   --gemini    Install Gemini integration only
#   --cursor    Install Cursor integration only
#   --all       Install all integrations
#   --cli-only  Install CLI only, no agent integrations
#   --dry-run   Show what would be installed without making changes

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Banner
print_banner() {
  echo ""
  echo "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
  echo "${CYAN}║${NC}  ${BOLD}███████╗██████╗  █████╗ ██████╗${NC}                              ${CYAN}║${NC}"
  echo "${CYAN}║${NC}  ${BOLD}██╔════╝██╔══██╗██╔══██╗██╔══██╗${NC}                             ${CYAN}║${NC}"
  echo "${CYAN}║${NC}  ${BOLD}███████╗██████╔╝███████║██████╔╝${NC}   Structured Persona-       ${CYAN}║${NC}"
  echo "${CYAN}║${NC}  ${BOLD}╚════██║██╔═══╝ ██╔══██║██╔══██╗${NC}   Argumentation for         ${CYAN}║${NC}"
  echo "${CYAN}║${NC}  ${BOLD}███████║██║     ██║  ██║██║  ██║${NC}   Reasoning                 ${CYAN}║${NC}"
  echo "${CYAN}║${NC}  ${BOLD}╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝${NC}                             ${CYAN}║${NC}"
  echo "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

# Logging helpers
info() { echo "${BLUE}ℹ${NC} $1"; }
success() { echo "${GREEN}✓${NC} $1"; }
warn() { echo "${YELLOW}⚠${NC} $1"; }
error() { echo "${RED}✗${NC} $1"; }
step() { echo "${CYAN}→${NC} $1"; }

# Parse arguments
DRY_RUN=false
CLI_ONLY=false
INSTALL_CLAUDE=false
INSTALL_GEMINI=false
INSTALL_CURSOR=false
INSTALL_ALL=false

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
    --cli-only) CLI_ONLY=true ;;
    --claude) INSTALL_CLAUDE=true ;;
    --gemini) INSTALL_GEMINI=true ;;
    --cursor) INSTALL_CURSOR=true ;;
    --all) INSTALL_ALL=true ;;
    --help|-h)
      echo "SPAR-Kit Installer"
      echo ""
      echo "Usage: curl -fsSL https://raw.githubusercontent.com/synthanai/spar-kit/main/install.sh | sh"
      echo ""
      echo "Options:"
      echo "  --claude    Install Claude Code integration"
      echo "  --gemini    Install Gemini integration"
      echo "  --cursor    Install Cursor integration"
      echo "  --all       Install all detected integrations"
      echo "  --cli-only  Install CLI only, no agent integrations"
      echo "  --dry-run   Show what would be installed"
      echo ""
      exit 0
      ;;
  esac
done

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Darwin*) OS="macos" ;;
    Linux*)  OS="linux" ;;
    MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
    *) OS="unknown" ;;
  esac
  echo "$OS"
}

# Check Node.js
check_node() {
  if ! command -v node >/dev/null 2>&1; then
    error "Node.js is not installed"
    echo "  Install Node.js 18+ from https://nodejs.org"
    exit 1
  fi
  
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ required (found v$NODE_VERSION)"
    exit 1
  fi
  success "Node.js v$(node -v | sed 's/v//') detected"
}

# Check npm
check_npm() {
  if ! command -v npm >/dev/null 2>&1; then
    error "npm is not installed"
    exit 1
  fi
  success "npm $(npm -v) detected"
}

# Install SPAR CLI
install_cli() {
  step "Installing SPAR-Kit CLI..."
  
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would run: npm install -g sparkit"
    return
  fi
  
  npm install -g sparkit >/dev/null 2>&1
  
  if command -v spar >/dev/null 2>&1; then
    success "SPAR-Kit CLI installed ($(spar --version 2>/dev/null || echo 'v4.x'))"
  else
    error "CLI installation failed"
    exit 1
  fi
}

# Create ~/.spar directory
init_spar_dir() {
  SPAR_DIR="$HOME/.spar"
  
  if [ ! -d "$SPAR_DIR" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo "  [DRY RUN] Would create: $SPAR_DIR"
    else
      mkdir -p "$SPAR_DIR/personas" "$SPAR_DIR/sessions"
      success "Created $SPAR_DIR"
    fi
  else
    info "SPAR directory already exists at $SPAR_DIR"
  fi
}

# Detect installed AI assistants
detect_assistants() {
  info "Detecting AI coding assistants..."
  
  FOUND_CLAUDE=false
  FOUND_GEMINI=false
  FOUND_CURSOR=false
  FOUND_VSCODE=false
  
  # Claude Code
  if [ -d "$HOME/.claude" ] || command -v claude >/dev/null 2>&1; then
    FOUND_CLAUDE=true
    echo "  ${GREEN}✓${NC} Claude Code detected"
  fi
  
  # Gemini
  if [ -d "$HOME/.gemini" ]; then
    FOUND_GEMINI=true
    echo "  ${GREEN}✓${NC} Gemini Code Assist detected"
  fi
  
  # Cursor
  if [ -d "$HOME/.cursor" ] || [ -d "$HOME/Library/Application Support/Cursor" ]; then
    FOUND_CURSOR=true
    echo "  ${GREEN}✓${NC} Cursor detected"
  fi
  
  # VS Code
  if command -v code >/dev/null 2>&1; then
    FOUND_VSCODE=true
    echo "  ${GREEN}✓${NC} VS Code detected"
  fi
  
  if [ "$FOUND_CLAUDE" = false ] && [ "$FOUND_GEMINI" = false ] && [ "$FOUND_CURSOR" = false ] && [ "$FOUND_VSCODE" = false ]; then
    warn "No AI coding assistants detected (will install CLI only)"
  fi
}

# Universal SKILL.md content
SKILL_CONTENT='---
name: SPAR-Kit
description: Run structured dialectic debates with AI personas for better decision-making
---

# SPAR-Kit Skill

Run the **SPAR** (Structured Persona-Argumentation for Reasoning) methodology to stress-test decisions through structured disagreement.

## Quick Start

```bash
# Quick debate
spar "Should we expand to Singapore?"

# Interactive Mission Control
spar tui

# Guided wizard
spar builder
```

## Commands

| Command | Description |
|---------|-------------|
| `spar "topic"` | Quick 4-persona debate |
| `spar tui` | Launch Mission Control TUI |
| `spar builder` | Interactive debate wizard |
| `spar persona list` | Browse 109 personas |
| `spar template list` | View debate templates |
| `spar template use <id>` | Use a preset template |

## The Four Directions

```
           🔵 NORTH (Visionary)
          "Where are we going?"
                   │
🔴 WEST ───────────┼─────────── 🟢 EAST
 (Sage)            │         (Challenger)
"What'\''s proven?"      "What'\''s emerging?"
                   │
           🟡 SOUTH (Pragmatist)
          "What'\''s grounded?"
```

## Available Templates

- `startup-pivot` — Evaluate major pivots
- `hiring-decision` — Should you hire this person?
- `product-launch` — Launch readiness assessment
- `crisis-response` — Emergency decisions
- `ethics-dilemma` — Navigate ethical situations

## Usage Tips

1. **Be specific** — "Should we use Kubernetes?" beats "What about infrastructure?"
2. **High stakes** — SPAR is for decisions that matter, not trivial choices
3. **Time budget** — Allow 15-30 minutes for full dialectic
4. **Follow up** — Use `spar interrogate` to stress-test the synthesis

## Links

- [Playground](https://synthanai.github.io/spar-kit)
- [GitHub](https://github.com/synthanai/spar-kit)
- [Methodology](https://github.com/synthanai/spar-kit/tree/main/methodology)
'

# Workflow content
WORKFLOW_CONTENT='---
description: Run a SPAR dialectic debate to stress-test a decision
---

# SPAR Debate Workflow

Run structured disagreement with 4 AI personas to surface blind spots.

## Steps

1. **Scope the question** — Be specific about the decision
   ```bash
   spar builder
   ```

2. **Select personas** — Choose from 109 personas or use defaults (N-E-S-W compass)

3. **Run the Rumble** — 3-round dialectic:
   - Round 1: Opening positions (1500 tokens)
   - Round 2: The Clash (1200 tokens)
   - Round 3: Final positions (1000 tokens)

4. **Review synthesis** — The Arbiter synthesizes key tensions

5. **Interrogate** — Stress-test the synthesis with follow-up questions
   ```bash
   spar interrogate <session-id>
   ```

## Quick Mode

For faster decisions, use the direct command:
```bash
spar "Your decision question here"
```

## Tips

- Best for high-stakes decisions with genuine uncertainty
- Not suitable for purely technical/objective questions
- Allow 15-30 minutes for full protocol
'

# Install Claude Code integration
install_claude() {
  step "Installing Claude Code integration..."
  
  CLAUDE_SKILL_DIR="$HOME/.claude/skills/spar-kit"
  
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create: $CLAUDE_SKILL_DIR/SKILL.md"
    return
  fi
  
  mkdir -p "$CLAUDE_SKILL_DIR"
  echo "$SKILL_CONTENT" > "$CLAUDE_SKILL_DIR/SKILL.md"
  
  success "Claude Code skill installed at $CLAUDE_SKILL_DIR"
}

# Install Gemini integration
install_gemini() {
  step "Installing Gemini integration..."
  
  # For workspace-level installation
  GEMINI_SKILL_DIR=".agent/skills/spar-kit"
  GEMINI_WORKFLOW_DIR=".agent/workflows"
  
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create: $GEMINI_SKILL_DIR/SKILL.md"
    echo "  [DRY RUN] Would create: $GEMINI_WORKFLOW_DIR/sparkit.md"
    return
  fi
  
  # Create in current directory if it looks like a workspace
  if [ -d ".git" ] || [ -d ".agent" ]; then
    mkdir -p "$GEMINI_SKILL_DIR"
    mkdir -p "$GEMINI_WORKFLOW_DIR"
    echo "$SKILL_CONTENT" > "$GEMINI_SKILL_DIR/SKILL.md"
    echo "$WORKFLOW_CONTENT" > "$GEMINI_WORKFLOW_DIR/sparkit.md"
    success "Gemini skill installed in current workspace"
  else
    # Create template in home
    TEMPLATE_DIR="$HOME/.spar/templates/gemini"
    mkdir -p "$TEMPLATE_DIR"
    echo "$SKILL_CONTENT" > "$TEMPLATE_DIR/SKILL.md"
    echo "$WORKFLOW_CONTENT" > "$TEMPLATE_DIR/sparkit.md"
    success "Gemini templates saved to $TEMPLATE_DIR"
    info "Copy to your project: cp -r $TEMPLATE_DIR/.agent ."
  fi
}

# Install Cursor integration
install_cursor() {
  step "Installing Cursor integration..."
  
  CURSOR_RULES="$HOME/.cursor/rules/spar.md"
  
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would create: $CURSOR_RULES"
    return
  fi
  
  mkdir -p "$HOME/.cursor/rules"
  
  cat > "$CURSOR_RULES" << 'CURSOR_EOF'
# SPAR-Kit Integration

When the user asks to run a SPAR debate or mentions "spar", "dialectic", or "stress-test a decision":

1. Use the `spar` CLI command
2. Suggest running `spar tui` for complex decisions
3. For quick debates: `spar "the question here"`

## Available Commands
- `spar "topic"` — Quick debate
- `spar tui` — Mission Control interface
- `spar builder` — Guided wizard
- `spar persona list` — Browse personas
CURSOR_EOF

  success "Cursor rules installed at $CURSOR_RULES"
}

# Main installation flow
main() {
  print_banner
  
  OS=$(detect_os)
  info "Detected OS: $OS"
  
  if [ "$DRY_RUN" = true ]; then
    warn "DRY RUN MODE — No changes will be made"
    echo ""
  fi
  
  # Prerequisites
  check_node
  check_npm
  echo ""
  
  # Install CLI
  install_cli
  init_spar_dir
  echo ""
  
  # Exit early if CLI only
  if [ "$CLI_ONLY" = true ]; then
    echo ""
    success "CLI-only installation complete!"
    echo ""
    echo "  Get started:"
    echo "    ${CYAN}spar tui${NC}              Launch Mission Control"
    echo "    ${CYAN}spar builder${NC}          Guided debate wizard"
    echo "    ${CYAN}spar \"Your topic\"${NC}     Quick debate"
    echo ""
    exit 0
  fi
  
  # Detect and install integrations
  detect_assistants
  echo ""
  
  # Determine what to install
  if [ "$INSTALL_ALL" = true ]; then
    INSTALL_CLAUDE=true
    INSTALL_GEMINI=true
    INSTALL_CURSOR=true
  fi
  
  # If no specific flags, ask what's detected
  if [ "$INSTALL_CLAUDE" = false ] && [ "$INSTALL_GEMINI" = false ] && [ "$INSTALL_CURSOR" = false ]; then
    if [ "$FOUND_CLAUDE" = true ]; then INSTALL_CLAUDE=true; fi
    if [ "$FOUND_GEMINI" = true ]; then INSTALL_GEMINI=true; fi
    if [ "$FOUND_CURSOR" = true ]; then INSTALL_CURSOR=true; fi
  fi
  
  # Install integrations
  if [ "$INSTALL_CLAUDE" = true ]; then install_claude; fi
  if [ "$INSTALL_GEMINI" = true ]; then install_gemini; fi
  if [ "$INSTALL_CURSOR" = true ]; then install_cursor; fi
  
  echo ""
  echo "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
  echo "${GREEN}║${NC}  ${BOLD}Installation Complete!${NC}                                       ${GREEN}║${NC}"
  echo "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "  ${BOLD}Get started:${NC}"
  echo "    ${CYAN}spar tui${NC}              Launch Mission Control"
  echo "    ${CYAN}spar builder${NC}          Interactive wizard"
  echo "    ${CYAN}spar \"Your topic\"${NC}     Quick 4-persona debate"
  echo ""
  echo "  ${BOLD}Learn more:${NC}"
  echo "    ${CYAN}spar --help${NC}           View all commands"
  echo "    ${CYAN}spar persona list${NC}     Browse 109 personas"
  echo "    ${CYAN}spar methodology${NC}      Learn the SPAR protocol"
  echo ""
  echo "  ${BOLD}Links:${NC}"
  echo "    Playground:  ${BLUE}https://synthanai.github.io/spar-kit${NC}"
  echo "    GitHub:      ${BLUE}https://github.com/synthanai/spar-kit${NC}"
  echo ""
  echo "  ${YELLOW}நாலு பேரு, நாலு திசை, ஒரு முடிவு${NC}"
  echo "  ${YELLOW}Don't deliberate alone. SPAR. 🥊${NC}"
  echo ""
}

main "$@"
