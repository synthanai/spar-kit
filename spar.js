/**
 * SPAR Kit - JavaScript Engine v2.0
 * Four Perspectives, Four Dimensions, One Synthesis
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    version: '2.0.0',
    storageKeys: {
        apiKey: 'spar-kit-api-key',
        provider: 'spar-kit-provider',
        sessions: 'spar-kit-sessions',
        rememberKey: 'spar-kit-remember'
    }
};

// ============================================
// PERSONA DEFINITIONS (N-E-W-S Compass)
// ============================================

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
        color: '#10b981',
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
        color: '#f59e0b',
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

// ============================================
// STATE MANAGEMENT
// ============================================

let sparState = {
    decision: '',
    provider: 'openai',
    responses: {
        round1: { north: '', east: '', south: '', west: '' },
        round2: { north: '', east: '', south: '', west: '' }
    },
    synthesis: '',
    errors: {},
    isRunning: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function $(id) {
    return document.getElementById(id);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function playSound(type) {
    // Boxing bell sound effect (optional, uses Web Audio API)
    if (type === 'start') {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    }
}

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

function saveApiKey(key) {
    if ($('rememberKey')?.checked) {
        localStorage.setItem(CONFIG.storageKeys.apiKey, btoa(key));
        localStorage.setItem(CONFIG.storageKeys.rememberKey, 'true');
    } else {
        localStorage.removeItem(CONFIG.storageKeys.apiKey);
        localStorage.removeItem(CONFIG.storageKeys.rememberKey);
    }
}

function loadApiKey() {
    const remembered = localStorage.getItem(CONFIG.storageKeys.rememberKey) === 'true';
    if (remembered) {
        const encoded = localStorage.getItem(CONFIG.storageKeys.apiKey);
        if (encoded) {
            try {
                return atob(encoded);
            } catch (e) { }
        }
    }
    return '';
}

function saveProvider(provider) {
    localStorage.setItem(CONFIG.storageKeys.provider, provider);
}

function loadProvider() {
    return localStorage.getItem(CONFIG.storageKeys.provider) || 'openai';
}

// ============================================
// UI INTERACTIONS
// ============================================

function toggleApiKey() {
    const input = $('apiKey');
    const btn = $('toggleKeyBtn');
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

function copyResponse(direction, round = 1) {
    const content = round === 1
        ? sparState.responses.round1[direction]
        : sparState.responses.round2[direction];

    if (!content) {
        showToast('Nothing to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
        showToast(`${PERSONAS[direction].name} copied!`, 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function copySynthesis() {
    if (!sparState.synthesis) {
        showToast('No synthesis to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(sparState.synthesis).then(() => {
        showToast('Synthesis copied!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function retryPersona(direction) {
    runSinglePersona(direction);
}

function setExample(type) {
    const examples = {
        career: "I'm deciding whether to accept a new job offer at 40% higher salary but requiring relocation. I have a young family and we just bought a house. The new role is in a growing company but higher risk.",
        market: "I'm deciding whether to expand into the Singapore market. We have a proven product in Australia but no local presence. The market is competitive but growing. We'd need to hire a local team.",
        product: "I'm deciding whether to launch our product now with 80% of features or wait 3 more months for the complete version. Competitors are moving fast but early users want more polish.",
        hire: "I'm deciding between two candidates for VP of Engineering. One has 15 years experience at big tech companies, excellent credentials. The other is from a startup, less traditional background but more energy and aligns with our culture.",
        investment: "I'm deciding whether to bootstrap our next phase or take VC funding. We're profitable but growing slowly. VC would accelerate growth but mean giving up control and potentially changing our culture."
    };
    $('decisionInput').value = examples[type];
    $('decisionInput').focus();
}

// ============================================
// API CONFIGURATION
// ============================================

function getApiConfig() {
    const provider = $('provider').value;
    const apiKey = $('apiKey').value.trim();

    if (!apiKey) {
        showToast('Please enter your API key', 'error');
        $('apiKey').focus();
        return null;
    }

    // Save for next time
    saveApiKey(apiKey);
    saveProvider(provider);

    return { provider, apiKey };
}

// ============================================
// API CALLS WITH STREAMING SUPPORT
// ============================================

async function callAI(provider, apiKey, systemPrompt, userMessage, onChunk = null) {
    const endpoints = {
        openai: 'https://api.openai.com/v1/chat/completions',
        anthropic: 'https://api.anthropic.com/v1/messages',
        gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
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
                    max_tokens: 1000,
                    stream: false
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
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
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: userMessage }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.content[0].text;
        }

        if (provider === 'gemini') {
            const response = await fetch(endpoints.gemini, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error(`Unknown provider: ${provider}`);
    } catch (error) {
        console.error(`API Error (${provider}):`, error);
        throw error;
    }
}

// ============================================
// SPAR EXECUTION
// ============================================

async function runSpar() {
    if (sparState.isRunning) return;

    const config = getApiConfig();
    if (!config) return;

    const decision = $('decisionInput').value.trim();
    if (!decision) {
        showToast('Please describe your decision', 'error');
        $('decisionInput').focus();
        return;
    }

    sparState.decision = decision;
    sparState.isRunning = true;
    sparState.errors = {};

    // Play start sound
    playSound('start');

    // Show debate section
    $('debate').classList.add('active');
    $('debate').scrollIntoView({ behavior: 'smooth' });

    // Update button state
    const btn = $('sparBtn');
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spar-icon">⏳</span><span class="btn-spar-text">Running</span>`;

    // Update favicon to show progress
    updateFavicon('running');

    const userMessage = `THE DECISION: ${decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;

    // Run all 4 personas in parallel
    const directions = ['north', 'east', 'south', 'west'];
    let completed = 0;

    const promises = directions.map(async (dir) => {
        await runSinglePersona(dir, config, userMessage);
        completed++;
        updateProgress(completed, 4);
    });

    await Promise.all(promises);

    // Show actions and reset button
    $('actions').style.display = 'flex';
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-spar-icon">🥊</span><span class="btn-spar-text">SPAR</span>`;
    sparState.isRunning = false;
    updateFavicon('done');

    showToast('Round 1 complete! 🥊', 'success');
}

async function runSinglePersona(dir, config = null, userMessage = null) {
    if (!config) {
        config = getApiConfig();
        if (!config) return;
    }

    if (!userMessage) {
        userMessage = `THE DECISION: ${sparState.decision}

Analyze this decision from your perspective:
- What do you see that others might miss?
- What questions would you ask before deciding?
- What's your position on this decision, and why?`;
    }

    const persona = PERSONAS[dir];
    const statusEl = $(`${dir}-status`);
    const contentEl = $(`${dir}-content`);
    const indicatorEl = $(`${dir}-indicator`);
    const retryBtn = $(`${dir}-retry`);

    // Reset state
    statusEl.textContent = 'Thinking';
    statusEl.className = 'position-status thinking';
    contentEl.textContent = '';
    contentEl.classList.remove('empty', 'error');
    contentEl.classList.add('loading');
    indicatorEl?.classList.add('active');
    if (retryBtn) retryBtn.style.display = 'none';

    // Typing animation dots
    let dots = 0;
    const dotsInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        statusEl.textContent = 'Thinking' + '.'.repeat(dots);
    }, 400);

    try {
        const response = await callAI(config.provider, config.apiKey, persona.prompt, userMessage);

        clearInterval(dotsInterval);
        sparState.responses.round1[dir] = response;
        sparState.errors[dir] = null;

        // Animate text appearance
        contentEl.classList.remove('loading');
        contentEl.textContent = response;
        contentEl.classList.add('fade-in');

        statusEl.textContent = 'Done';
        statusEl.className = 'position-status done';

    } catch (error) {
        clearInterval(dotsInterval);
        sparState.errors[dir] = error.message;

        contentEl.classList.remove('loading');
        contentEl.classList.add('error');
        contentEl.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${error.message}</span>
            </div>
        `;
        statusEl.textContent = 'Error';
        statusEl.className = 'position-status';

        // Show retry button
        if (retryBtn) retryBtn.style.display = 'inline-flex';
    }

    indicatorEl?.classList.remove('active');
}

function updateProgress(current, total) {
    const percent = Math.round((current / total) * 100);
    // Could update a progress bar here if desired
}

function updateFavicon(state) {
    // Dynamic favicon based on state
    const emoji = state === 'running' ? '⏳' : state === 'done' ? '✅' : '🥊';
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    document.head.appendChild(link);
}

// ============================================
// ROUND 2
// ============================================

async function runRound2() {
    const config = getApiConfig();
    if (!config) return;

    $('round2').style.display = 'block';
    $('round2').scrollIntoView({ behavior: 'smooth' });

    playSound('start');

    const otherPositions = `The other perspectives said:

NORTH (Visionary): ${sparState.responses.round1.north.substring(0, 300)}...

EAST (Challenger): ${sparState.responses.round1.east.substring(0, 300)}...

SOUTH (Pragmatist): ${sparState.responses.round1.south.substring(0, 300)}...

WEST (Sage): ${sparState.responses.round1.west.substring(0, 300)}...

Where do you DISAGREE with them? What are they missing? Be specific, direct, and confrontational. This is a clash of perspectives.`;

    const directions = ['north', 'east', 'south', 'west'];

    const promises = directions.map(async (dir) => {
        const persona = PERSONAS[dir];
        const statusEl = $(`${dir}-r2-status`);
        const contentEl = $(`${dir}-r2-content`);

        statusEl.textContent = 'Clashing';
        statusEl.className = 'position-status thinking';
        contentEl.textContent = '';
        contentEl.classList.add('loading');

        try {
            const response = await callAI(config.provider, config.apiKey, persona.prompt, otherPositions);
            sparState.responses.round2[dir] = response;
            contentEl.classList.remove('loading');
            contentEl.textContent = response;
            statusEl.textContent = 'Done';
            statusEl.className = 'position-status done';
        } catch (error) {
            contentEl.classList.remove('loading');
            contentEl.innerHTML = `<span class="error-message">Error: ${error.message}</span>`;
            statusEl.textContent = 'Error';
            statusEl.className = 'position-status';
        }
    });

    await Promise.all(promises);

    // Generate synthesis
    await generateSynthesis(config);
    showToast('The Clash complete! 🥊', 'success');
}

// ============================================
// SYNTHESIS
// ============================================

async function generateSynthesis(config) {
    $('synthesis').style.display = 'block';
    $('synthesis').scrollIntoView({ behavior: 'smooth' });

    const synthesisPrompt = `You are a neutral MODERATOR synthesizing a SPAR debate.

The decision was: ${sparState.decision}

ROUND 1 POSITIONS:
North (Visionary): ${sparState.responses.round1.north}
East (Challenger): ${sparState.responses.round1.east}
South (Pragmatist): ${sparState.responses.round1.south}
West (Sage): ${sparState.responses.round1.west}

ROUND 2 - THE CLASH:
North: ${sparState.responses.round2.north}
East: ${sparState.responses.round2.east}
South: ${sparState.responses.round2.south}
West: ${sparState.responses.round2.west}

Provide a synthesis with these sections:

## 🔥 KEY TENSIONS
Where do the personas genuinely, fundamentally disagree?

## 🤝 SURPRISING CONVERGENCES
Where do they unexpectedly agree despite different perspectives?

## 💡 INSIGHTS SURFACED
What emerged from this debate that wasn't obvious at the start?

## ❓ OPEN QUESTIONS
What remains unresolved that the decision-maker should consider?

## 🧭 THE DECISION MATRIX
Summarize the core trade-offs in a simple format.

Be concise but complete. Use markdown formatting.`;

    const contentEl = $('synthesis-content');
    contentEl.innerHTML = '<span class="loading-text">Synthesizing the debate...</span>';

    try {
        const response = await callAI(config.provider, config.apiKey, 'You are a neutral debate moderator and expert synthesizer.', synthesisPrompt);
        sparState.synthesis = response;

        // Render with simple markdown
        contentEl.innerHTML = renderMarkdown(response);
    } catch (error) {
        contentEl.innerHTML = `<span class="error-message">Error generating synthesis: ${error.message}</span>`;
    }
}

function renderMarkdown(text) {
    return text
        .replace(/## (.*)/g, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// ============================================
// EXPORT
// ============================================

function exportMarkdown() {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();

    let md = `# SPAR Session

**Date**: ${date} at ${time}
**Method**: SPAR Kit v${CONFIG.version} (N-E-W-S Compass)
**Provider**: ${sparState.provider}

---

## 🎯 The Decision

${sparState.decision}

---

## ⚔️ Round 1: Opening Positions

### 🔵 North — The Visionary
${sparState.responses.round1.north || '_Not completed_'}

### 🟢 East — The Challenger
${sparState.responses.round1.east || '_Not completed_'}

### 🟡 South — The Pragmatist
${sparState.responses.round1.south || '_Not completed_'}

### 🔴 West — The Sage
${sparState.responses.round1.west || '_Not completed_'}

---

## 🔥 Round 2: The Clash

### 🔵 North responds
${sparState.responses.round2.north || '_Not run_'}

### 🟢 East responds
${sparState.responses.round2.east || '_Not run_'}

### 🟡 South responds
${sparState.responses.round2.south || '_Not run_'}

### 🔴 West responds
${sparState.responses.round2.west || '_Not run_'}

---

## 📊 Synthesis

${sparState.synthesis || '_Not generated_'}

---

> **நாலு பேரு, நாலு திசை, ஒரு முடிவு!**
> *Four Perspectives, Four Dimensions, One Synthesis*

🥊 Generated by [SPAR Kit](https://synthanai.github.io/spar-kit) | [GitHub](https://github.com/synthanai/spar-kit)
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spar-session-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Session exported! 📄', 'success');
}

// ============================================
// RESET
// ============================================

function resetSpar() {
    sparState = {
        decision: '',
        provider: loadProvider(),
        responses: {
            round1: { north: '', east: '', south: '', west: '' },
            round2: { north: '', east: '', south: '', west: '' }
        },
        synthesis: '',
        errors: {},
        isRunning: false
    };

    $('decisionInput').value = '';
    $('debate').classList.remove('active');
    $('round2').style.display = 'none';
    $('synthesis').style.display = 'none';
    $('actions').style.display = 'none';

    ['north', 'east', 'south', 'west'].forEach(dir => {
        const content = $(`${dir}-content`);
        const status = $(`${dir}-status`);
        const indicator = $(`${dir}-indicator`);
        const retry = $(`${dir}-retry`);

        if (content) {
            content.textContent = 'Awaiting response...';
            content.className = 'position-content empty';
        }
        if (status) {
            status.textContent = 'Waiting';
            status.className = 'position-status waiting';
        }
        if (indicator) {
            indicator.classList.remove('active');
        }
        if (retry) {
            retry.style.display = 'none';
        }
    });

    $('setup').scrollIntoView({ behavior: 'smooth' });
    updateFavicon('idle');
    showToast('Ready for a new SPAR! 🥊', 'info');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + Enter to run SPAR
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!sparState.isRunning) {
            runSpar();
        }
    }

    // Escape to reset
    if (e.key === 'Escape' && !sparState.isRunning) {
        resetSpar();
    }
});

// Allow Enter in textarea without triggering SPAR
$('decisionInput')?.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runSpar();
    }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    const savedKey = loadApiKey();
    const savedProvider = loadProvider();

    if (savedKey && $('apiKey')) {
        $('apiKey').value = savedKey;
        if ($('rememberKey')) $('rememberKey').checked = true;
    }

    if (savedProvider && $('provider')) {
        $('provider').value = savedProvider;
    }

    // Set initial favicon
    updateFavicon('idle');

    console.log(`🥊 SPAR Kit v${CONFIG.version} loaded`);
    console.log('நாலு பேரு, நாலு திசை, ஒரு முடிவு!');
});

// Provider change handler
$('provider')?.addEventListener('change', (e) => {
    saveProvider(e.target.value);
});

// API key save handler
$('apiKey')?.addEventListener('change', (e) => {
    if ($('rememberKey')?.checked) {
        saveApiKey(e.target.value);
    }
});
