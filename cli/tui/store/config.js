/**
 * SPAR-Kit TUI: Config Store
 * 
 * State management for configuration.
 */

import { create } from 'zustand';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const SPAR_DIR = join(homedir(), '.spar');
const CONFIG_PATH = join(SPAR_DIR, 'config.json');

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
    provider: 'ollama',
    model: 'mistral:latest',
    baseUrl: 'http://localhost:11434/api/chat',
    apiKey: null,

    // TUI settings
    tui: {
        theme: 'default', // default, minimal, vibrant
        showTips: true,
        confirmDelete: true,
        autoExport: false,
        defaultPreset: 'innovation'
    },

    // Debate settings
    debate: {
        defaultRounds: 2,
        maxTokensPerResponse: 2000,
        streamingEnabled: true
    }
};

/**
 * Load config from disk
 */
function loadConfigFromDisk() {
    if (!existsSync(SPAR_DIR)) mkdirSync(SPAR_DIR, { recursive: true });

    if (existsSync(CONFIG_PATH)) {
        try {
            const content = readFileSync(CONFIG_PATH, 'utf-8');
            const loaded = JSON.parse(content);
            return { ...DEFAULT_CONFIG, ...loaded };
        } catch (e) {
            console.error('Failed to load config:', e.message);
        }
    }
    return { ...DEFAULT_CONFIG };
}

/**
 * Save config to disk
 */
function saveConfigToDisk(config) {
    if (!existsSync(SPAR_DIR)) mkdirSync(SPAR_DIR, { recursive: true });

    try {
        writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
        return true;
    } catch (e) {
        console.error('Failed to save config:', e.message);
        return false;
    }
}

/**
 * Check config file permissions (security)
 */
function checkConfigPermissions() {
    if (!existsSync(CONFIG_PATH)) return { secure: true };

    try {
        const stats = statSync(CONFIG_PATH);
        const mode = stats.mode & 0o777;

        // Warn if world-readable (especially if API key is set)
        if (mode & 0o004) {
            return {
                secure: false,
                warning: 'Config file is world-readable. Run: chmod 600 ~/.spar/config.json'
            };
        }
        return { secure: true };
    } catch (e) {
        return { secure: true }; // Can't check, assume ok
    }
}

/**
 * Mask API key for display
 */
function maskApiKey(key) {
    if (!key) return 'Not set';
    if (key.length < 8) return '****';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

/**
 * Config Store (zustand)
 */
export const useConfigStore = create((set, get) => ({
    // State
    config: DEFAULT_CONFIG,
    loaded: false,
    lastSaved: null,
    permissionWarning: null,

    // Load config
    load: () => {
        const config = loadConfigFromDisk();
        const permissions = checkConfigPermissions();
        set({
            config,
            loaded: true,
            permissionWarning: permissions.secure ? null : permissions.warning
        });
        return config;
    },

    // Save config
    save: () => {
        const { config } = get();
        const success = saveConfigToDisk(config);
        if (success) {
            set({ lastSaved: new Date().toISOString() });
        }
        return success;
    },

    // Get config value
    get: (key) => {
        const { config } = get();
        const keys = key.split('.');
        let value = config;
        for (const k of keys) {
            value = value?.[k];
        }
        return value;
    },

    // Set config value
    set: (key, value) => {
        set(state => {
            const config = { ...state.config };
            const keys = key.split('.');
            let obj = config;
            for (let i = 0; i < keys.length - 1; i++) {
                obj[keys[i]] = { ...obj[keys[i]] };
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            saveConfigToDisk(config);
            return { config, lastSaved: new Date().toISOString() };
        });
    },

    // Set provider
    setProvider: (provider, model, baseUrl, apiKey) => {
        set(state => {
            const config = {
                ...state.config,
                provider,
                model,
                baseUrl,
                apiKey
            };
            saveConfigToDisk(config);
            return { config, lastSaved: new Date().toISOString() };
        });
    },

    // Get masked API key
    getMaskedApiKey: () => {
        const { config } = get();
        return maskApiKey(config.apiKey);
    },

    // Check if configured
    isConfigured: () => {
        const { config } = get();
        if (config.provider === 'ollama') {
            return !!config.baseUrl && !!config.model;
        }
        return !!config.apiKey && !!config.model;
    },

    // Reset to defaults
    reset: () => {
        set({ config: { ...DEFAULT_CONFIG } });
        saveConfigToDisk(DEFAULT_CONFIG);
    },

    // Get provider display info
    getProviderInfo: () => {
        const { config } = get();
        return {
            provider: config.provider,
            model: config.model,
            baseUrl: config.baseUrl,
            apiKeySet: !!config.apiKey,
            apiKeyMasked: maskApiKey(config.apiKey)
        };
    }
}));

export default useConfigStore;
