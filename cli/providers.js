/**
 * SPAR Kit - Provider Module v3.3 (Model-Agnostic Ultrathink)
 * Multi-provider LLM support with user-selectable reasoning modes
 * 
 * DESIGN PRINCIPLE: Users choose their own provider and model.
 * Ultrathink is a REASONING MODE that can apply to any model.
 */

/**
 * Reasoning Modes Configuration
 * These are mode SETTINGS, not model recommendations
 * Users can apply any mode to any provider/model they choose
 */
export const REASONING_MODES = {
    standard: {
        name: 'Standard',
        description: 'Fast responses, suitable for straightforward decisions',
        icon: '🟢',
        defaultMaxTokens: 1000,
        thinkingEnabled: false,
        systemPromptAddition: ''
    },
    ultrathink: {
        name: 'Ultrathink',
        description: 'Extended reasoning with visible chain-of-thought',
        icon: '🟡',
        defaultMaxTokens: 4000,
        thinkingEnabled: true,
        systemPromptAddition: '\n\nBefore providing your response, think through the problem step by step. Show your reasoning process clearly. If your model supports <think> blocks, use them to show your deliberation.'
    },
    maximum: {
        name: 'Maximum',
        description: 'Deep reasoning for complex, high-stakes decisions',
        icon: '🔴',
        defaultMaxTokens: 8000,
        thinkingEnabled: true,
        systemPromptAddition: '\n\nThis is a high-stakes decision requiring deep analysis. Before responding, think through multiple angles, consider counterarguments, identify risks, and show your complete reasoning process. Use <think> blocks if supported.'
    }
};

// Alias for backward compatibility
export const REASONING_TIERS = REASONING_MODES;

/**
 * Provider Categories (not model recommendations)
 * Users can use any model available through these providers
 */
export const PROVIDERS = {
    ollama: {
        name: 'Ollama (Local)',
        description: 'Run models locally - you choose which models to install',
        requiresKey: false,
        endpoint: 'http://localhost:11434/api/chat',
        supportsModelDiscovery: true,  // CLI can query available models
        thinkingBlockPattern: /<think>([\s\S]*?)<\/think>/gi
    },
    openai: {
        name: 'OpenAI',
        description: 'OpenAI API - GPT models and reasoning models (o1/o3)',
        requiresKey: true,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        supportsModelDiscovery: false
    },
    anthropic: {
        name: 'Anthropic',
        description: 'Anthropic API - Claude models',
        requiresKey: true,
        endpoint: 'https://api.anthropic.com/v1/messages',
        supportsModelDiscovery: false
    },
    gemini: {
        name: 'Google Gemini',
        description: 'Google AI - Gemini models',
        requiresKey: true,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        supportsModelDiscovery: true
    },
    openai_compatible: {
        name: 'OpenAI-Compatible',
        description: 'Custom endpoint (vLLM, llama.cpp, LM Studio, etc.)',
        requiresKey: false,
        endpoint: 'http://localhost:8000/v1/chat/completions',
        customEndpoint: true,
        supportsModelDiscovery: false
    }
};

/**
 * Check if Ollama is running and list available models
 */
export async function discoverOllamaModels() {
    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) return [];
        const data = await response.json();
        return data.models?.map(m => m.name) || [];
    } catch {
        return [];
    }
}

/**
 * Check if a specific model is available in Ollama
 */
export async function checkOllamaModel(modelName) {
    const models = await discoverOllamaModels();
    return models.some(m => m.includes(modelName) || modelName.includes(m));
}

/**
 * Get list of available providers
 */
export function getAvailableProviders() {
    return Object.entries(PROVIDERS).map(([key, config]) => ({
        key,
        name: config.name,
        description: config.description,
        requiresKey: config.requiresKey,
        supportsModelDiscovery: config.supportsModelDiscovery
    }));
}

/**
 * Extract thinking blocks from models that support <think> blocks
 * Works with any model that outputs thinking in this format
 * Returns { thinking: string, response: string }
 */
export function extractThinkingBlocks(content) {
    // Support <think>...</think> blocks (used by many reasoning models)
    const thinkPattern = /<think>([\s\S]*?)<\/think>/gi;
    const matches = [...content.matchAll(thinkPattern)];

    if (matches.length === 0) {
        return { thinking: null, response: content };
    }

    const thinking = matches.map(m => m[1].trim()).join('\n\n');
    const response = content.replace(thinkPattern, '').trim();

    return { thinking, response };
}

/**
 * Call AI provider with message
 * Provider-agnostic: works with any provider + model combination
 * 
 * @param {string} provider - Provider key (ollama, openai, anthropic, gemini, openai_compatible)
 * @param {string} apiKey - API key (null for local providers)
 * @param {string} model - User-selected model name
 * @param {string} systemPrompt - System prompt for the AI
 * @param {string} userMessage - User message
 * @param {object} options - Additional options (maxTokens, baseUrl, reasoningMode)
 */
export async function callAI(provider, apiKey, model, systemPrompt, userMessage, options = {}) {
    const config = PROVIDERS[provider];

    if (!config) {
        throw new Error(`Unknown provider: ${provider}`);
    }

    const baseUrl = options.baseUrl || config.endpoint;
    const reasoningMode = options.reasoningMode || 'standard';
    const modeConfig = REASONING_MODES[reasoningMode] || REASONING_MODES.standard;
    const maxTokens = options.maxTokens || modeConfig.defaultMaxTokens;

    // Enhance system prompt based on reasoning mode
    const enhancedSystemPrompt = systemPrompt + modeConfig.systemPromptAddition;

    if (provider === 'openai' || provider === 'openai_compatible') {
        return await callOpenAI(baseUrl, apiKey, model, enhancedSystemPrompt, userMessage, maxTokens);
    }

    if (provider === 'anthropic') {
        return await callAnthropic(apiKey, model, enhancedSystemPrompt, userMessage, maxTokens);
    }

    if (provider === 'gemini') {
        return await callGemini(apiKey, model, enhancedSystemPrompt, userMessage, maxTokens);
    }

    if (provider === 'ollama') {
        return await callOllama(baseUrl, model, enhancedSystemPrompt, userMessage, maxTokens);
    }

    throw new Error(`Unknown provider: ${provider}`);
}

/**
 * Call AI with reasoning extraction (for ultrathink mode)
 * Returns { thinking: string|null, response: string, provider: string, model: string }
 */
export async function callAIWithReasoning(provider, apiKey, systemPrompt, userMessage, options = {}) {
    const content = await callAI(provider, apiKey, systemPrompt, userMessage, options);
    const { thinking, response } = extractThinkingBlocks(content);

    const providerKey = provider.includes('ultrathink') ? 'ollama_ultrathink' : provider;
    const config = PROVIDERS[providerKey] || PROVIDERS[provider];

    return {
        thinking,
        response,
        provider: config?.name || provider,
        model: options.model || config?.defaultModel,
        hasThinking: thinking !== null && thinking.length > 0
    };
}

async function callOpenAI(endpoint, apiKey, model, systemPrompt, userMessage, maxTokens) {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: maxTokens
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
}

/**
 * Call OpenAI reasoning models (o1, o3)
 * These models have different API parameters
 */
async function callOpenAIReasoning(apiKey, model, systemPrompt, userMessage, maxTokens) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    // o1/o3 models don't support system messages the same way
    // Prepend system prompt to user message
    const combinedMessage = `${systemPrompt}\n\n---\n\n${userMessage}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            messages: [
                { role: 'user', content: combinedMessage }
            ],
            max_completion_tokens: maxTokens
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
}

async function callAnthropic(apiKey, model, systemPrompt, userMessage, maxTokens) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }]
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.content[0].text;
}

async function callGemini(apiKey, model, systemPrompt, userMessage, maxTokens) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
            generationConfig: { maxOutputTokens: maxTokens }
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
}

async function callOllama(endpoint, model, systemPrompt, userMessage, maxTokens) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            stream: false,
            options: { num_predict: maxTokens }
        })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.message?.content || data.response;
}

/**
 * Check if Ollama is available and has the required model
 */
export async function checkOllamaModel(model, endpoint = 'http://localhost:11434') {
    try {
        const response = await fetch(`${endpoint}/api/tags`);
        if (!response.ok) return { available: false, error: 'Ollama not running' };

        const data = await response.json();
        const models = data.models?.map(m => m.name) || [];
        const hasModel = models.some(m => m.startsWith(model.split(':')[0]));

        return {
            available: true,
            hasModel,
            models,
            suggestion: hasModel ? null : `Run: ollama pull ${model}`
        };
    } catch (error) {
        return {
            available: false,
            error: 'Cannot connect to Ollama. Is it running?',
            suggestion: 'Start Ollama with: ollama serve'
        };
    }
}

export default {
    callAI,
    callAIWithReasoning,
    extractThinkingBlocks,
    getProvidersByTier,
    getRecommendedProvider,
    checkOllamaModel,
    PROVIDERS,
    REASONING_TIERS
};

