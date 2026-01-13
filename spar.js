/**
 * SPAR Kit - JavaScript Engine
 * Four Perspectives, Four Dimensions, One Synthesis
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

// Persona definitions (N-E-W-S Compass)
const PERSONAS = {
    north: {
        name: 'The Visionary',
        direction: 'North',
        icon: '🔵',
        color: '#3b82f6',
        prompt: `You are THE VISIONARY (North).

YOUR CORE PRIORITY: Where are we going? What's the ideal future?
YOUR FEAR: Settling for mediocrity when greatness is possible.
YOUR STYLE: You focus on possibility, aspiration, and long-term direction.

When engaging with problems, you ask: "What could this become? Are we thinking big enough?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Challenge others to think beyond current constraints.
When you see small thinking, name it. When you see untapped potential, champion it.

Keep your response focused and under 300 words.`
    },
    east: {
        name: 'The Challenger',
        direction: 'East',
        icon: '🟢',
        color: '#22c55e',
        prompt: `You are THE CHALLENGER (East).

YOUR CORE PRIORITY: What's emerging? What new dawn is breaking?
YOUR FEAR: Being left behind by clinging to the old way.
YOUR STYLE: You focus on disruption, innovation, and what's coming next.

When engaging with problems, you ask: "What's changing? What would a newcomer do differently?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Challenge assumptions that worked yesterday but may fail tomorrow.
When you see complacency, disrupt it. When you see fresh approaches, advocate for them.

Keep your response focused and under 300 words.`
    },
    south: {
        name: 'The Pragmatist',
        direction: 'South',
        icon: '🟡',
        color: '#eab308',
        prompt: `You are THE PRAGMATIST (South).

YOUR CORE PRIORITY: What's grounded? What actually works in reality?
YOUR FEAR: Beautiful ideas that collapse when they meet the real world.
YOUR STYLE: You focus on execution, feasibility, and practical constraints.

When engaging with problems, you ask: "Can we actually do this? What are the real constraints?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Ground airy visions in operational reality.
When you see wishful thinking, challenge it. When you see solid plans, support them.

Keep your response focused and under 300 words.`
    },
    west: {
        name: 'The Sage',
        direction: 'West',
        icon: '🔴',
        color: '#ef4444',
        prompt: `You are THE SAGE (West).

YOUR CORE PRIORITY: What's proven? What has history taught us?
YOUR FEAR: Repeating mistakes that wisdom could have prevented.
YOUR STYLE: You focus on experience, patterns, and lessons from the past.

When engaging with problems, you ask: "What have we learned before? What does wisdom suggest?"

You will analyze a decision. Argue your perspective directly.
Don't be balanced — be you. Bring the weight of experience to bear on shiny new ideas.
When you see historical patterns being ignored, name them. When you see genuine novelty, acknowledge it.

Keep your response focused and under 300 words.`
    }
};

// State
let sparState = {
    decision: '',
    responses: {
        round1: { north: '', east: '', south: '', west: '' },
        round2: { north: '', east: '', south: '', west: '' }
    },
    synthesis: ''
};

// Toggle API key visibility
function toggleApiKey() {
    const input = document.getElementById('apiKey');
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Get API configuration
function getApiConfig() {
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('apiKey').value;

    if (!apiKey) {
        alert('Please enter your API key');
        return null;
    }

    return { provider, apiKey };
}

// Call AI API
async function callAI(provider, apiKey, systemPrompt, userMessage) {
    const endpoints = {
        openai: 'https://api.openai.com/v1/chat/completions',
        anthropic: 'https://api.anthropic.com/v1/messages',
        gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
    };

    try {
        if (provider === 'openai') {
            const response = await fetch(endpoints.openai, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4-turbo-preview',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 1000
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.choices[0].message.content;
        }

        if (provider === 'anthropic') {
            const response = await fetch(endpoints.anthropic, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: [
                        { role: 'user', content: userMessage }
                    ]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.content[0].text;
        }

        if (provider === 'gemini') {
            const response = await fetch(endpoints.gemini, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
                    }]
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        }
    } catch (error) {
        console.error(`API Error (${provider}):`, error);
        throw error;
    }
}

// Run SPAR
async function runSpar() {
    const config = getApiConfig();
    if (!config) return;

    const decision = document.getElementById('decisionInput').value;
    if (!decision.trim()) {
        alert('Please enter your decision');
        return;
    }

    sparState.decision = decision;

    // Show debate section
    document.getElementById('debate').style.display = 'block';
    document.getElementById('round1').scrollIntoView({ behavior: 'smooth' });

    // Disable button
    const btn = document.getElementById('sparBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Running...';

    const userMessage = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;

    // Run all 4 personas in parallel
    const directions = ['north', 'east', 'south', 'west'];

    const promises = directions.map(async (dir) => {
        const persona = PERSONAS[dir];
        const statusEl = document.getElementById(`${dir}-status`);
        const contentEl = document.getElementById(`${dir}-content`);
        const indicatorEl = document.getElementById(`${dir}-indicator`);

        statusEl.textContent = 'Thinking...';
        statusEl.className = 'status loading';
        indicatorEl.classList.add('active');

        try {
            const response = await callAI(config.provider, config.apiKey, persona.prompt, userMessage);
            sparState.responses.round1[dir] = response;
            contentEl.textContent = response;
            statusEl.textContent = 'Done';
            statusEl.className = 'status done';
        } catch (error) {
            contentEl.textContent = `Error: ${error.message}`;
            statusEl.textContent = 'Error';
            statusEl.className = 'status';
        }
    });

    await Promise.all(promises);

    // Show actions
    document.getElementById('actions').style.display = 'flex';
    btn.disabled = false;
    btn.textContent = '🥊 SPAR';
}

// Run Round 2
async function runRound2() {
    const config = getApiConfig();
    if (!config) return;

    document.getElementById('round2').style.display = 'block';
    document.getElementById('round2').scrollIntoView({ behavior: 'smooth' });

    const otherPositions = `The other perspectives said:

NORTH (Visionary): ${sparState.responses.round1.north.substring(0, 200)}...

EAST (Challenger): ${sparState.responses.round1.east.substring(0, 200)}...

SOUTH (Pragmatist): ${sparState.responses.round1.south.substring(0, 200)}...

WEST (Sage): ${sparState.responses.round1.west.substring(0, 200)}...

Where do you DISAGREE with them? What are they missing? Be specific and direct.`;

    const directions = ['north', 'east', 'south', 'west'];

    const promises = directions.map(async (dir) => {
        const persona = PERSONAS[dir];
        const statusEl = document.getElementById(`${dir}-r2-status`);
        const contentEl = document.getElementById(`${dir}-r2-content`);

        statusEl.textContent = 'Responding...';
        statusEl.className = 'status loading';

        try {
            const response = await callAI(config.provider, config.apiKey, persona.prompt, otherPositions);
            sparState.responses.round2[dir] = response;
            contentEl.textContent = response;
            statusEl.textContent = 'Done';
            statusEl.className = 'status done';
        } catch (error) {
            contentEl.textContent = `Error: ${error.message}`;
            statusEl.textContent = 'Error';
            statusEl.className = 'status';
        }
    });

    await Promise.all(promises);

    // Generate synthesis
    await generateSynthesis(config);
}

// Generate Synthesis
async function generateSynthesis(config) {
    document.getElementById('synthesis').style.display = 'block';

    const synthesisPrompt = `You are a neutral MODERATOR synthesizing a SPAR debate.

The decision was: ${sparState.decision}

ROUND 1 POSITIONS:
North (Visionary): ${sparState.responses.round1.north}
East (Challenger): ${sparState.responses.round1.east}
South (Pragmatist): ${sparState.responses.round1.south}
West (Sage): ${sparState.responses.round1.west}

ROUND 2 RESPONSES:
North: ${sparState.responses.round2.north}
East: ${sparState.responses.round2.east}
South: ${sparState.responses.round2.south}
West: ${sparState.responses.round2.west}

Provide a synthesis with:
1. KEY TENSIONS: Where do the personas genuinely disagree?
2. CONVERGENCES: Where do they surprisingly agree?
3. INSIGHTS SURFACED: What emerged that wasn't obvious at the start?
4. OPEN QUESTIONS: What remains unresolved?

Be concise but complete.`;

    const contentEl = document.getElementById('synthesis-content');
    contentEl.textContent = 'Generating synthesis...';

    try {
        const response = await callAI(config.provider, config.apiKey, 'You are a neutral debate moderator.', synthesisPrompt);
        sparState.synthesis = response;
        contentEl.textContent = response;
    } catch (error) {
        contentEl.textContent = `Error generating synthesis: ${error.message}`;
    }
}

// Export to Markdown
function exportMarkdown() {
    const date = new Date().toISOString().split('T')[0];

    let md = `# SPAR Session: ${sparState.decision.substring(0, 50)}...

**Date**: ${date}
**Method**: SPAR Kit (N-E-W-S Compass)

---

## The Decision

${sparState.decision}

---

## Round 1: Opening Positions

### 🔵 North — The Visionary
${sparState.responses.round1.north}

### 🟢 East — The Challenger
${sparState.responses.round1.east}

### 🟡 South — The Pragmatist
${sparState.responses.round1.south}

### 🔴 West — The Sage
${sparState.responses.round1.west}

---

## Round 2: The Clash

### 🔵 North responds
${sparState.responses.round2.north || 'Not run'}

### 🟢 East responds
${sparState.responses.round2.east || 'Not run'}

### 🟡 South responds
${sparState.responses.round2.south || 'Not run'}

### 🔴 West responds
${sparState.responses.round2.west || 'Not run'}

---

## Synthesis

${sparState.synthesis || 'Not generated'}

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு.**
> *Four Perspectives, Four Dimensions, One Synthesis.*

Generated by [SPAR Kit](https://github.com/synthanai/spar-kit)
`;

    // Download
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spar-session-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

// Reset
function resetSpar() {
    sparState = {
        decision: '',
        responses: {
            round1: { north: '', east: '', south: '', west: '' },
            round2: { north: '', east: '', south: '', west: '' }
        },
        synthesis: ''
    };

    document.getElementById('decisionInput').value = '';
    document.getElementById('debate').style.display = 'none';
    document.getElementById('round2').style.display = 'none';
    document.getElementById('synthesis').style.display = 'none';
    document.getElementById('actions').style.display = 'none';

    ['north', 'east', 'south', 'west'].forEach(dir => {
        document.getElementById(`${dir}-content`).textContent = '';
        document.getElementById(`${dir}-status`).textContent = 'Waiting...';
        document.getElementById(`${dir}-status`).className = 'status';
        document.getElementById(`${dir}-indicator`).classList.remove('active');
    });

    document.getElementById('setup').scrollIntoView({ behavior: 'smooth' });
}

// Save API key to localStorage
document.getElementById('apiKey')?.addEventListener('change', (e) => {
    // Optionally save to localStorage (commented out for security)
    // localStorage.setItem('spar-api-key', e.target.value);
});

// Load API key from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    // Optionally load from localStorage
    // const savedKey = localStorage.getItem('spar-api-key');
    // if (savedKey) document.getElementById('apiKey').value = savedKey;
});
