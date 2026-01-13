/**
 * SPAR Kit - Provider Module v3.0
 * Multi-provider LLM support including local models
 */

/**
 * Available providers configuration
 */
export const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        models: ['gpt-4-turbo-preview', 'gpt-4o', 'gpt-4o-mini'],
        defaultModel: 'gpt-4o',
        requiresKey: true,
        endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    anthropic: {
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
        defaultModel: 'claude-3-5-sonnet-20241022',
        requiresKey: true,
        endpoint: 'https://api.anthropic.com/v1/messages'
    },
    gemini: {
        name: 'Google Gemini',
        models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
        defaultModel: 'gemini-1.5-flash',
        requiresKey: true,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
    },
    ollama: {
        name: 'Ollama (Local)',
        models: ['llama3.2', 'mistral', 'deepseek-r1', 'qwen2.5', 'phi3'],
        defaultModel: 'llama3.2',
        requiresKey: false,
        endpoint: 'http://localhost:11434/api/chat'
    },
    openai_compatible: {
        name: 'OpenAI-Compatible (vLLM/llama.cpp/LM Studio)',
        models: [],
        defaultModel: 'default',
        requiresKey: false,
        endpoint: 'http://localhost:8000/v1/chat/completions'
    }
};

/**
 * Call AI provider with message
 */
export async function callAI(provider, apiKey, systemPrompt, userMessage, options = {}) {
    const model = options.model || PROVIDERS[provider]?.defaultModel;
    const baseUrl = options.baseUrl || PROVIDERS[provider]?.endpoint;
    const maxTokens = options.maxTokens || 1000;

    if (provider === 'openai' || provider === 'openai_compatible') {
        return await callOpenAI(baseUrl, apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (provider === 'anthropic') {
        return await callAnthropic(apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (provider === 'gemini') {
        return await callGemini(apiKey, model, systemPrompt, userMessage, maxTokens);
    }

    if (provider === 'ollama') {
        return await callOllama(baseUrl, model, systemPrompt, userMessage, maxTokens);
    }

    throw new Error(`Unknown provider: ${provider}`);
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

export default { callAI, PROVIDERS };
