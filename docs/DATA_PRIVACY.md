# Data Privacy Standards for Decision Context

**Document**: TASK-129  
**Version**: 1.0.0  
**Created**: 2026-01-14  
**Purpose**: Establish data privacy standards for decision context in SPAR-Kit

---

## 🎯 Core Principle

> **Local-first, user-controlled, minimal-collection.**

SPAR-Kit is designed with privacy as a foundational principle, not an afterthought.

---

## 📊 Data Classification

### What Data SPAR-Kit Processes

| Data Type | Classification | Storage | Retention |
|-----------|---------------|---------|-----------|
| Decision text | **User Content** | Local only | User-controlled |
| Persona responses | **Generated** | Session file | Until deleted |
| Thinking chains | **Generated** | Session file | Until deleted |
| Synthesis output | **Generated** | Session file | Until deleted |
| Override decisions | **User Action** | Audit trail | 90 days default |
| API keys | **Credential** | Config file | Until removed |
| Model preferences | **Config** | Config file | Persistent |
| Session metadata | **Operational** | Session file | Until deleted |

### Data Never Collected

| Data Type | Reason |
|-----------|--------|
| Personal identity | Not needed for function |
| Location data | Not needed for function |
| Usage analytics | Privacy-first design |
| Telemetry | No external transmission |
| Device fingerprints | Not collected |
| Browsing history | Not accessed |

---

## 🔐 Privacy Architecture

### Local-First Design

```
┌─────────────────────────────────────────────────────────────┐
│                 SPAR-KIT PRIVACY ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   USER'S MACHINE (All data stays here)                      │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  ~/.spar/                                             │  │
│   │  ├── config.json      ← Preferences + masked keys    │  │
│   │  ├── sessions/        ← All debate data              │  │
│   │  ├── personas/        ← Custom personas              │  │
│   │  └── audit/           ← Local audit trail            │  │
│   └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  OLLAMA (Default)                                     │  │
│   │  └── Local LLM inference                              │  │
│   │      • No data leaves machine                         │  │
│   │      • Air-gapped capable                             │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│   - - - - - - - OPTIONAL EXTERNAL - - - - - - - - - - - -   │
│                       │                                      │
│                       ▼ (Only if user chooses)              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  CLOUD PROVIDERS (User opt-in only)                   │  │
│   │  ├── OpenAI, Anthropic, Google                        │  │
│   │  └── Subject to their privacy policies                │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### API Key Handling

| Stage | Handling |
|-------|----------|
| **Input** | Prompted securely, never echoed |
| **Storage** | Encrypted in config file |
| **Display** | Always masked (`sk-...abc`) |
| **Logging** | Never logged to any file |
| **Transmission** | HTTPS only, direct to provider |
| **Deletion** | Overwritten on removal |

---

## 📋 Privacy Controls

### User-Controlled Settings

```javascript
// ~/.spar/config.json
{
  "privacy": {
    // Control what gets saved
    "saveThinkingChains": true,    // Save CoT reasoning
    "saveFullResponses": true,     // Save complete AI responses
    "saveAuditTrail": true,        // Enable audit logging
    
    // Retention settings
    "autoDeleteAfterDays": null,   // null = never auto-delete
    "auditRetentionDays": 90,      // Audit log retention
    
    // External transmission
    "allowCloudProviders": true,   // Allow non-local LLMs
    "preferLocalFirst": true,      // Default to Ollama
    
    // Export controls
    "includeThinkingInExport": true,
    "redactSensitiveOnExport": false
  }
}
```

### Data Deletion Commands

```bash
# Delete a specific session
sparkit session delete <session-id>

# Delete all sessions older than N days
sparkit session purge --older-than 30

# Delete all audit logs
sparkit audit clear

# Complete data wipe
sparkit reset --all

# Export before deletion
sparkit session export <id> --output backup.md
sparkit session delete <id>
```

---

## 🌐 Cloud Provider Considerations

### When Data Leaves the Machine

If user explicitly chooses a cloud provider (OpenAI, Anthropic, Gemini):

| Data Sent | Handling |
|-----------|----------|
| Decision text | Sent in prompt |
| System prompt | Sent with request |
| Persona context | Included in prompt |
| API key | HTTPS header |

| Data NOT Sent | Reason |
|---------------|--------|
| Previous sessions | Not needed |
| User identity | Not collected |
| Device info | Not collected |
| Session history | Isolated requests |

### Provider Privacy Policies

Users should review:
- [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)
- [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- [Google AI Privacy](https://ai.google/responsibility/privacy/)

### Recommendation: Local-First

SPAR-Kit **recommends** using Ollama (local) for sensitive decisions:

```
🏠 Ollama Ultrathink (DeepSeek-R1)
├── ✅ No data leaves your machine
├── ✅ No API key required
├── ✅ No usage tracking
├── ✅ Works offline/air-gapped
└── ✅ Full ultrathink reasoning
```

---

## 🔒 Security Measures

### Data at Rest

| Protection | Implementation |
|------------|----------------|
| File permissions | 0600 (owner read/write only) |
| API key encryption | System keychain where available |
| Session isolation | Separate files per session |
| Integrity checking | SHA-256 hashes in audit trail |

### Data in Transit

| Protection | Implementation |
|------------|----------------|
| Transport | HTTPS/TLS 1.3 only |
| Certificate validation | Enforced |
| Proxy support | Respects system settings |
| Air-gap mode | Ollama local only |

---

## 📝 Compliance Considerations

### GDPR Alignment

| GDPR Right | SPAR-Kit Support |
|------------|------------------|
| **Right to access** | All data locally accessible |
| **Right to deletion** | Full deletion commands |
| **Right to portability** | JSON/MD export |
| **Right to restrict** | Disable cloud providers |
| **Data minimization** | Only essential data stored |

### Enterprise Considerations

For enterprise deployment:
- Deploy with Ollama-only mode
- Configure `allowCloudProviders: false`
- Set appropriate `auditRetentionDays`
- Review `ETHICAL_FRAMEWORK.md` with legal

---

## 🚨 Privacy Warnings

SPAR-Kit displays warnings when:

1. **First cloud provider use**: "Your decision text will be sent to [Provider] API"
2. **Sensitive content detected**: "Contains potentially sensitive terms"
3. **Export with thinking**: "Export includes AI reasoning chains"
4. **Long retention**: "Session is older than 90 days"

---

## 📚 References

- [Ethical Framework](./ETHICAL_FRAMEWORK.md)
- [AI-Human Boundaries](./AI_HUMAN_BOUNDARIES.md)
- [Audit Trail](../cli/audit.js)

---

*SPAR-Kit Data Privacy Standards v1.0.0 — TASK-129 — 2026-01-14*
