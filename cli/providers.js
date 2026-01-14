/**
 * SPAR Kit - Provider Module v3.2 (Ultrathink)
 * Multi-provider LLM support with extended reasoning capabilities
 */

/**
 * Reasoning Tiers Configuration
 * Controls the depth of thinking for AI personas
 */
export const REASONING_TIERS = {
    standard: {
        name: 'Standard',
        description: 'Fast responses, good for simple decisions',
        icon: '🟢',
        defaultMaxTokens: 1000,
        thinkingEnabled: false
    },
    ultrathink: {
        name: 'Ultrathink',
        description: 'Extended reasoning with chain-of-thought',
        icon: '🟡',
        defaultMaxTokens: 4000,
        thinkingEnabled: true
    },
    maximum: {
        name: 'Maximum',
        description: 'Premium reasoning models (OpenAI o1/o3)',
        icon: '🔴',
        defaultMaxTokens: 8000,
        thinkingEnabled: true
    }
};

/**
 * Available providers configuration
 */
export const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        models: ['gpt-4-turbo-preview', 'gpt-4o', 'gpt-4o-mini'],
        defaultModel: 'gpt-4o',
        requiresKey: true,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        tier: 'standard'
    },
    openai_reasoning: {
        name: 'OpenAI Reasoning (o1/o3)',
        models: ['o1', 'o1-mini', 'o3-mini'],
        defaultModel: 'o1-mini',
        requiresKey: true,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        tier: 'maximum',
        supportsThinking: true
    },
    anthropic: {
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
        defaultModel: 'claude-3-5-sonnet-20241022',
        requiresKey: true,
        endpoint: 'https://api.anthropic.com/v1/messages',
        tier: 'standard'
    },
    gemini: {
        name: 'Google Gemini',
        models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.0-flash-thinking-exp'],
        defaultModel: 'gemini-1.5-flash',
        requiresKey: true,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        tier: 'standard'
    },
    ollama: {
        name: 'Ollama (Local)',
        models: ['llama3.2', 'mistral', 'qwen2.5', 'phi3'],
        defaultModel: 'llama3.2',
        requiresKey: false,
        endpoint: 'http://localhost:11434/api/chat',
        tier: 'standard'
    },
    ollama_ultrathink: {
        name: 'Ollama Ultrathink (DeepSeek-R1)',
        models: [
            'deepseek-r1:1.5b',
            'deepseek-r1:7b', 
            'deepseek-r1:8b',
            'deepseek-r1:14b',
            'deepseek-r1:32b',
            'deepseek-r1:70b',
            'deepseek-r1'  // Latest/default
        ],
        defaultModel: 'deepseek-r1:14b',
        requiresKey: false,
        endpoint: 'http://localhost:11434/api/chat',
        tier: 'ultrathink',
        supportsThinking: true
    },
    openai_compatible: {
        name: 'OpenAI-Compatible (vLLM/llama.cpp/LM Studio)',
        models: [],
        defaultModel: 'default',
        requiresKey: false,
        endpoint: 'http://localhost:8000/v1/chat/completions',
        tier: 'standard'
    }
};

/**
 * Get provider by reasoning tier
 */
export function getProvidersByTier(tier) {
    return Object.entries(PROVIDERS)
        .filter(([_, config]) => config.tier === tier)
        .map(([key, config]) => ({ key, ...config }));
}

/**
 * Get recommended provider for a tier
 */
export function getRecommendedProvider(tier) {
    const providers = getProvidersByTier(tier);
    if (tier === 'ultrathink') {
        return providers.find(p => p.key === 'ollama_ultrathink') || providers[0];
    }
    if (tier === 'maximum') {
        return providers.find(p => p.key === 'openai_reasoning') || providers[0];
    }
    return providers.find(p => p.key === 'ollama') || providers[0];
}

/**
 * Extract thinking blocks from DeepSeek-R1 or similar models
 * Returns { thinking: string, response: string }
 */
export function extractThinkingBlocks(content) {
    // DeepSeek-R1 uses <think>...</think> blocks
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
 */
export async function callAI(provider, apiKey, systemPrompt, userMessage, options = {}) {
    const providerKey = provider.includes('ultrathink') ? 'ollama_ultrathink' : 
                        provider.includes('reasoning') ? 'openai_reasoning' : provider;
    const config = PROVIDERS[providerKey] || PROVIDERS[provider];
    
    if (!config) {
        throw new Error(`Unknown provider: ${provider}`);
    }
    
    const model = options.model || config.defaultModel;
    const baseUrl = options.baseUrl || config.endpoint;
    const maxTokens = options.maxTokens || REASONING_TIERS[config.tier]?.defaultMaxTokens || 1000;

    if (providerKey === 'openai' || providerKey === 'openai_compatible') {
        return await callOpenAI(baseUrl, apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (providerKey === 'openai_reasoning') {
        return await callOpenAIReasoning(apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (providerKey === 'anthropic') {
        return await callAnthropic(apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (providerKey === 'gemini') {
        return await callGemini(apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (providerKey === 'ollama' || providerKey === 'ollama_ultrathink') {
        return await callOllama(baseUrl, model, systemPrompt, userMessage, maxTokens);
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

