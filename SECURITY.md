# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.1.x   | ✅ Actively supported |
| 3.0.x   | ⚠️ Security fixes only |
| < 3.0   | ❌ No longer supported |

## Reporting a Vulnerability

If you discover a security vulnerability in SPAR-Kit, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email: synthai@synthai.biz
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours and will work with you to address the issue.

---

## Security Architecture

### Input Validation

All user input is validated before processing:

| Input Type | Validations |
|------------|-------------|
| Session ID | UUID v4 format required |
| Decision text | Length limits, XSS pattern detection |
| File paths | Path traversal prevention, null byte rejection |
| Model names | Alphanumeric + safe characters only |
| Base URLs | Whitelist of allowed domains (SSRF prevention) |
| API keys | Format validation per provider |

### Output Sanitization

All output is sanitized before display or export:

- **Terminal output** — Control characters removed
- **Markdown export** — Special characters escaped
- **JSON export** — Internal fields stripped
- **LLM responses** — Prompt injection patterns removed

### Sensitive Data Handling

| Data Type | Handling |
|-----------|----------|
| API keys | Stored locally in `~/.spar/config.json`, masked in logs and API |
| Session data | Stored locally, sanitized on export |
| LLM responses | Not transmitted to any server except configured provider |

---

## Configuration Security

### File Permissions

The security module checks config file permissions:

```javascript
// Recommended: 600 (owner read/write only)
chmod 600 ~/.spar/config.json
```

If permissions are too open, a warning is displayed.

### API Key Storage

- Keys stored in local config file only
- Never transmitted except to configured LLM provider
- Masked in all log output and API responses
- Not included in session exports

---

## XSS Prevention

The following patterns are blocked in decision text:

- `<script>` tags
- `javascript:` URLs
- Event handlers (`onclick=`, `onerror=`, etc.)
- `<iframe>`, `<object>`, `<embed>` tags

---

## Path Traversal Prevention

File paths are validated to prevent:

- `../` sequences
- Encoded traversal (`%2e%2e`)
- Backslash sequences (`..\\`)
- Null bytes

---

## SSRF Prevention

Base URLs are validated against a whitelist:

- `localhost` / `127.0.0.1` (local)
- `api.openai.com`
- `api.anthropic.com`
- `generativelanguage.googleapis.com`
- `*.ollama.ai`

Arbitrary URLs are rejected.

---

## Session Integrity

Sessions are validated on load:

- Required fields checked (`id`, `version`, `status`, `decision`)
- UUID format validated
- Status must be valid enum value
- Decision text validated for XSS

Invalid sessions are not loaded.

---

## Dependency Security

We use:

- `npm audit` for vulnerability scanning
- Dependabot for automated updates
- Minimal runtime dependencies

To audit your installation:

```bash
cd /path/to/spar-kit
npm audit
```

---

## Security Tests

The test suite includes security-specific tests:

```bash
npm run test:security
```

Tests cover:
- UUID validation
- XSS detection
- Path traversal prevention
- API key format validation
- Output sanitization
- Sensitive data masking

---

## Best Practices

### For Users

1. **Protect your config file**
   ```bash
   chmod 600 ~/.spar/config.json
   ```

2. **Use environment variables for CI/CD**
   ```bash
   export OPENAI_API_KEY=sk-...
   ```

3. **Review exported sessions** before sharing publicly

### For Developers

1. **Never log API keys** — Use `maskSensitiveData()`
2. **Validate all input** — Use validation module
3. **Sanitize all output** — Use sanitization module
4. **Test security** — Run `npm run test:security`

---

## Changelog

### v3.1.0 Security Updates

- Added comprehensive input validation module
- Added output sanitization for terminal, Markdown, JSON
- Added API key masking
- Added session integrity checks
- Added security test suite
- Added config file permission checks

---

🔒 **Security is a feature, not an afterthought.**
