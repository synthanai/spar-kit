# SPAR-Kit API Examples

Practical examples for using the SPAR-Kit programmatic API.

---

## Basic Usage

### Import the API

```javascript
import sparkit from 'sparkit';

// Or import specific functions
import { createSession, getSession, listSessions, exportSession } from 'sparkit';
```

### Initialize (Required)

```javascript
await sparkit.initialize();
```

---

## Creating Sessions

### Simple Session

```javascript
const session = await sparkit.createSession({
  decision: 'Should we expand to the Singapore market?'
});

console.log('Created session:', session.id);
// Output: Created session: 550e8400-e29b-41d4-a716-446655440000
```

### Session with Options

```javascript
const session = await sparkit.createSession({
  decision: 'Should we hire this senior engineer?',
  preset: 'corporate',     // Preset persona pack
  provider: 'ollama',      // LLM provider
  model: 'llama3.2'        // Specific model
});
```

### Session with Custom Personas

```javascript
const session = await sparkit.createSession({
  decision: 'How should we handle the data privacy concerns?',
  personas: [
    'p3_ethics_guardian',      // Protector archetype
    'e2_innovation_hunter',    // Explorer archetype
    's1_systems_thinker',      // Strategist archetype
    'a2_contrarian_evidence'   // Analyst archetype
  ]
});
```

---

## Retrieving Sessions

### Get a Specific Session

```javascript
const session = await sparkit.getSession('550e8400-e29b-41d4-a716-446655440000');

if (session) {
  console.log('Decision:', session.decision);
  console.log('Status:', session.status);
  console.log('Created:', session.createdAt);
} else {
  console.log('Session not found');
}
```

### Get Session with Responses

```javascript
const session = await sparkit.getSession(sessionId);

if (session.status === 'completed') {
  console.log('North (Visionary):', session.phases.rumble.responses.north);
  console.log('Synthesis:', session.phases.knit.synthesis);
}
```

---

## Listing Sessions

### List All Sessions

```javascript
const sessions = await sparkit.listSessions();

console.log(`Found ${sessions.length} sessions`);
sessions.forEach(s => {
  console.log(`- ${s.decision.substring(0, 50)}... [${s.status}]`);
});
```

### Filter by Status

```javascript
// Get only completed sessions
const completed = await sparkit.listSessions({ status: 'completed' });

// Get running sessions
const running = await sparkit.listSessions({ status: 'running' });

// Get failed sessions
const failed = await sparkit.listSessions({ status: 'failed' });
```

### Pagination

```javascript
// Get first 10 sessions
const page1 = await sparkit.listSessions({ limit: 10 });

// Get sessions from last 7 days
const recent = await sparkit.listSessions({ days: 7 });
```

---

## Exporting Sessions

### Export to Markdown

```javascript
const result = await sparkit.exportSession(sessionId, { format: 'md' });

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('report.md', result.content);

console.log('Exported to:', result.path || 'report.md');
```

### Export to JSON

```javascript
const result = await sparkit.exportSession(sessionId, { format: 'json' });

// Parse for programmatic use
const data = JSON.parse(result.content);
console.log('Phases completed:', Object.keys(data.phases));
```

### Export with Custom Path

```javascript
const result = await sparkit.exportSession(sessionId, {
  format: 'md',
  output: './exports/q1-strategy-decision.md'
});
```

---

## Session Management

### Clone a Session

```javascript
// Re-run a debate with the same decision
const cloned = await sparkit.cloneSession(originalSessionId);

console.log('New session ID:', cloned.id);
console.log('Status:', cloned.status); // 'created'
```

### Delete a Session

```javascript
const deleted = await sparkit.deleteSession(sessionId);

if (deleted) {
  console.log('Session deleted');
} else {
  console.log('Session not found');
}
```

---

## Statistics and Configuration

### Get Statistics

```javascript
const stats = await sparkit.getStats();

console.log('Total sessions:', stats.total);
console.log('By status:');
console.log('  - Completed:', stats.byStatus.completed);
console.log('  - Running:', stats.byStatus.running);
console.log('  - Failed:', stats.byStatus.failed);
```

### Get Configuration

```javascript
const config = await sparkit.getConfig();

console.log('Provider:', config.provider);
console.log('Model:', config.model);
console.log('API Key:', config.apiKey); // Always masked: '****'
```

---

## Integration Examples

### CI/CD Pipeline

```javascript
// Run a strategic decision analysis in CI
import sparkit from 'sparkit';

async function analyzeDeployment() {
  await sparkit.initialize();
  
  const session = await sparkit.createSession({
    decision: `Should we deploy ${process.env.VERSION} to production today?
    
    Context:
    - Feature: ${process.env.FEATURE_NAME}
    - Test coverage: ${process.env.COVERAGE}%
    - Known issues: ${process.env.OPEN_ISSUES}`,
    preset: 'startup'
  });
  
  // Wait for completion (in real usage, you'd poll or use callbacks)
  console.log('Session created:', session.id);
  
  // Export for review
  const report = await sparkit.exportSession(session.id);
  console.log(report.content);
}
```

### Batch Analysis

```javascript
// Analyze multiple decisions
const decisions = [
  'Should we invest in AI tooling?',
  'Should we expand the engineering team?',
  'Should we adopt a new framework?'
];

for (const decision of decisions) {
  const session = await sparkit.createSession({ decision });
  console.log(`Created: ${session.id} - "${decision.substring(0, 30)}..."`);
}

// List all
const sessions = await sparkit.listSessions({ days: 1 });
console.log(`Created ${sessions.length} sessions today`);
```

### Express.js API Endpoint

```javascript
import express from 'express';
import sparkit from 'sparkit';

const app = express();
app.use(express.json());

// Initialize once
await sparkit.initialize();

app.post('/api/debate', async (req, res) => {
  try {
    const session = await sparkit.createSession({
      decision: req.body.decision,
      preset: req.body.preset || 'innovation'
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/session/:id', async (req, res) => {
  const session = await sparkit.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(session);
});

app.listen(3000);
```

---

## Error Handling

```javascript
try {
  const session = await sparkit.createSession({
    decision: '' // Empty decision will throw
  });
} catch (error) {
  if (error.message.includes('required')) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

*SPAR-Kit API v1.0.0*
