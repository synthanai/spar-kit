# SPAR Kit Publishing Guide

## 1. Global Installation (Local Development)

The issue with global npm install is that it creates symlinks to the source directory, but dependencies aren't bundled. For proper global usage:

### Option A: Link for Development
```bash
cd /path/to/spar-kit
npm install           # Install dependencies locally
npm link              # Create global symlink
```

Then you can run `spar` or `sparkit` from anywhere.

### Option B: Bundled Global Install
After publishing to npm, users can install properly with:
```bash
npm install -g sparkit
```

---

## 2. Publishing to npm

### Prerequisites
1. Create an npm account: https://www.npmjs.com/signup
2. Login from terminal:
```bash
npm login
```

### Pre-Publish Checklist

- [ ] Version bump in `package.json` (currently `3.0.0`)
- [ ] Update `CHANGELOG.md` with release notes
- [ ] Ensure `README.md` is comprehensive
- [ ] Run tests: `npm test`
- [ ] Verify `package.json` has correct:
  - `name`: "sparkit"
  - `version`: "3.0.0"
  - `bin`: points to CLI entry
  - `files`: includes all necessary files (or use `.npmignore`)
  - `repository`: GitHub URL
  - `keywords`: for discoverability

### Add `files` field to package.json
Add this to ensure only necessary files are published:
```json
"files": [
  "cli/",
  "README.md",
  "LICENSE"
],
```

### Publish Commands
```bash
# Dry run (see what would be published)
npm pack --dry-run

# Publish to npm (public package)
npm publish --access public

# If you need to publish a beta/prerelease:
npm publish --tag beta
```

### Post-Publish Verification
```bash
# Check the published package
npm info sparkit

# Test installation
npm install -g sparkit
sparkit --version
sparkit status
```

---

## 3. GitHub Release (Recommended)

Create a GitHub release to match npm:
```bash
git tag v3.0.0
git push origin v3.0.0
```

Then create a release on GitHub with:
- Tag: v3.0.0
- Title: SPAR Kit v3.0.0 — Full Methodology Implementation
- Notes: Link to CHANGELOG.md

---

## 4. Troubleshooting Global Install

If `spar` command not found after global install:

1. Check npm bin location:
```bash
npm bin -g
```

2. Ensure it's in PATH:
```bash
export PATH="$(npm bin -g):$PATH"
```

3. Add to shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
echo 'export PATH="$(npm bin -g):$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 5. Quick Start for Users

After `npm install -g sparkit`:

```bash
# Configure provider (first time)
spar config setup

# Run a debate
spar "Should we expand to Singapore?"

# Use preset personas
spar --preset startup "Should we raise Series A?"

# See all commands
spar --help
```
