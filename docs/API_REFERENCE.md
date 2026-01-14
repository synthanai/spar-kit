# SPAR-Kit API Reference

The SPAR-Kit API provides programmatic access to session management, debate creation, and configuration.

## Installation

```bash
npm install sparkit
```

## Quick Start

```javascript
import sparkit from 'sparkit/cli/api/index.js';

// Initialize (required before other calls)
const info = sparkit.initialize();
console.log(`SPAR-Kit API v${info.version}`);

// Create a session
const session = sparkit.createSession({
  decision: 'Should we adopt microservices architecture?',
  preset: 'innovation'
});

// List sessions
const sessions = sparkit.listSessions({ limit: 10 });

// Export session
const result = sparkit.exportSession(session.id, { format: 'md' });
```

---

## API Reference

### `initialize()`

Initialize the API. Must be called before other methods.

**Returns:** `Object`
- `version` — API version string
- `provider` — Configured LLM provider
- `model` — Configured model name
- `sessionCount` — Number of existing sessions

**Example:**
```javascript
const info = sparkit.initialize();
// { version: '1.0.0', provider: 'ollama', model: 'mistral:latest', sessionCount: 5 }
```

---

### `createSession(options)`

Create a new SPAR session.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `decision` | `string` | Yes | The decision question (10-2000 chars) |
| `preset` | `string` | No | Persona preset (default: config default) |
| `provider` | `string` | No | LLM provider (default: config) |
| `model` | `string` | No | Model name (default: config) |

**Returns:** `Object`
- `id` — Session UUID
- `status` — Session status (`running`)
- `decision` — The decision text
- `preset` — Preset used
- `provider` — Provider used
- `model` — Model used
- `createdAt` — ISO timestamp

**Throws:**
- `Error` if decision is invalid (XSS, too short, etc.)
- `Error` if preset is invalid

**Example:**
```javascript
const session = sparkit.createSession({
  decision: 'Should we pivot from B2B to B2C?',
  preset: 'startup'
});
```

---

### `getSession(id)`

Retrieve a session by ID.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Session UUID |

**Returns:** `Object | null`
- Full session object or `null` if not found

**Throws:**
- `Error` if ID is not a valid UUID

**Example:**
```javascript
const session = sparkit.getSession('550e8400-e29b-41d4-a716-446655440000');
if (session) {
  console.log(session.decision);
}
```

---

### `listSessions(filters)`

List sessions with optional filtering.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | No | Filter by status |
| `limit` | `number` | No | Max results (default: 50) |
| `days` | `number` | No | Filter by recency (days ago) |

**Returns:** `Array<Object>`
- Array of session summaries

**Example:**
```javascript
// Recent completed sessions
const completed = sparkit.listSessions({
  status: 'completed',
  limit: 10,
  days: 7
});
```

---

### `exportSession(id, options)`

Export a session to a file or return content.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Session UUID |
| `format` | `string` | No | Export format: `md`, `json`, `txt` (default: `md`) |
| `output` | `string` | No | File path to write (optional) |

**Returns:** `Object`
- `content` — Export content string
- `format` — Format used
- `path` — File path if written
- `sessionId` — Session ID

**Throws:**
- `Error` if session not found
- `Error` if output path is invalid

**Example:**
```javascript
// Get markdown content
const result = sparkit.exportSession(sessionId, { format: 'md' });
console.log(result.content);

// Write to file
sparkit.exportSession(sessionId, { 
  format: 'json',
  output: './exports/session.json'
});
```

---

### `deleteSession(id)`

Delete a session.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Session UUID |

**Returns:** `boolean`
- `true` if deleted, `false` if not found

**Example:**
```javascript
const deleted = sparkit.deleteSession(sessionId);
if (deleted) {
  console.log('Session deleted');
}
```

---

### `cloneSession(id)`

Clone an existing session.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Session UUID to clone |

**Returns:** `Object`
- `id` — New session UUID
- `status` — Status (`running`)
- `decision` — Decision text
- `clonedFrom` — Original session ID

**Throws:**
- `Error` if session not found

**Example:**
```javascript
const cloned = sparkit.cloneSession(originalId);
console.log(`Cloned to: ${cloned.id}`);
```

---

### `getStats()`

Get session statistics.

**Returns:** `Object`
- `total` — Total session count
- `completed` — Completed count
- `running` — Running count
- `paused` — Paused count
- `failed` — Failed count
- `completionRate` — Percentage (0-100)

**Example:**
```javascript
const stats = sparkit.getStats();
console.log(`Completion rate: ${stats.completionRate}%`);
```

---

### `getConfig()`

Get current configuration (API keys masked).

**Returns:** `Object`
- `provider` — LLM provider
- `model` — Model name
- `baseUrl` — API endpoint
- `apiKeySet` — Boolean (true if key is set)
- `tui` — TUI settings
- `debate` — Debate settings

**Example:**
```javascript
const config = sparkit.getConfig();
console.log(`Using: ${config.provider}/${config.model}`);
```

---

## Session Status Values

| Status | Description |
|--------|-------------|
| `running` | Debate in progress |
| `paused` | Debate paused |
| `completed` | Debate finished successfully |
| `aborted` | Debate cancelled by user |
| `failed` | Debate failed due to error |

---

## Error Handling

All methods throw descriptive errors:

```javascript
try {
  sparkit.createSession({ decision: 'x' }); // Too short
} catch (error) {
  console.error(error.message);
  // "Invalid decision: Decision text must be at least 10 characters"
}
```

---

## Security

The API includes built-in security:

- **Input Validation** — XSS, path traversal prevention
- **Output Sanitization** — Safe content export
- **API Key Masking** — Keys never exposed via API

---

## TypeScript Support

Type definitions coming in v3.2.0.

---

## Examples

### CI/CD Integration

```javascript
import sparkit from 'sparkit/cli/api/index.js';

async function runArchitectureReview() {
  sparkit.initialize();
  
  const session = sparkit.createSession({
    decision: 'Should we proceed with the proposed architecture changes?',
    preset: 'corporate'
  });
  
  // Session runs...
  
  const result = sparkit.exportSession(session.id, {
    format: 'md',
    output: `./reports/arch-review-${Date.now()}.md`
  });
  
  console.log(`Report saved: ${result.path}`);
}
```

### Batch Processing

```javascript
import sparkit from 'sparkit/cli/api/index.js';

sparkit.initialize();

const decisions = [
  'Should we migrate to cloud?',
  'Should we adopt GraphQL?',
  'Should we implement microservices?'
];

for (const decision of decisions) {
  const session = sparkit.createSession({ decision });
  console.log(`Created: ${session.id}`);
}
```

---

🥊 **Don't deliberate alone. SPAR.**
