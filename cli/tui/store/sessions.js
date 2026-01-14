/**
 * SPAR-Kit TUI: Session Store
 * 
 * State management for SPAR sessions using zustand.
 * Handles loading, saving, filtering, and managing session state.
 */

import { create } from 'zustand';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// Session directories
const SPAR_DIR = join(homedir(), '.spar');
const SESSIONS_DIR = join(SPAR_DIR, 'sessions');

// Ensure directories exist
function ensureDirectories() {
    if (!existsSync(SPAR_DIR)) mkdirSync(SPAR_DIR, { recursive: true });
    if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });
}

/**
 * Session Status Enum
 */
export const SessionStatus = {
    RUNNING: 'running',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ABORTED: 'aborted',
    FAILED: 'failed'
};

/**
 * Default session schema
 */
export function createSession(decision, preset, provider, model) {
    return {
        id: uuidv4(),
        version: '3.1.0',
        status: SessionStatus.RUNNING,
        decision,
        preset: preset || 'innovation',
        provider: provider || 'ollama',
        model: model || 'mistral:latest',
        phases: {
            scope: { status: 'pending', timestamp: null, duration_ms: 0 },
            populate: { status: 'pending', personas: [], timestamp: null },
            announce: { status: 'pending', timestamp: null },
            rumble: {
                status: 'pending',
                current_round: 0,
                total_rounds: 3,
                rounds: []
            },
            knit: { status: 'pending', synthesis: null, timestamp: null },
            interrogate: { status: 'pending', critiques: [], timestamp: null },
            transmit: { status: 'pending', recommendations: null, timestamp: null }
        },
        checkpoint: {
            phase: null,
            round: null,
            persona_index: null,
            resumable: false,
            last_response: null
        },
        metrics: {
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            completed_at: null,
            total_tokens: 0,
            llm_calls: 0,
            duration_ms: 0
        }
    };
}

/**
 * Parse session filename to extract metadata
 */
function parseSessionFilename(filename) {
    // Format: 2026-01-14T04-28-33-647Z_decision_slug.json
    const match = filename.match(/^(\d{4}-\d{2}-\d{2}T[\d-]+Z)_(.+)\.json$/);
    if (match) {
        return {
            timestamp: match[1].replace(/-/g, ':').replace('T::', 'T'),
            slug: match[2]
        };
    }
    return null;
}

/**
 * Load all sessions from disk
 */
function loadSessionsFromDisk() {
    ensureDirectories();
    const sessions = [];

    try {
        const files = readdirSync(SESSIONS_DIR);
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const content = readFileSync(join(SESSIONS_DIR, file), 'utf-8');
                    const session = JSON.parse(content);
                    // Add filename for reference
                    session._filename = file;
                    sessions.push(session);
                } catch (e) {
                    console.error(`Failed to load session: ${file}`, e.message);
                }
            }
        }
    } catch (e) {
        console.error('Failed to read sessions directory:', e.message);
    }

    // Sort by most recent first
    sessions.sort((a, b) => {
        const dateA = new Date(a.metrics?.started_at || 0);
        const dateB = new Date(b.metrics?.started_at || 0);
        return dateB - dateA;
    });

    return sessions;
}

/**
 * Save session to disk
 */
function saveSessionToDisk(session) {
    ensureDirectories();

    // Update timestamp
    session.metrics.updated_at = new Date().toISOString();

    // Generate filename from decision
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const slug = session.decision
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .substring(0, 40);
    const filename = session._filename || `${timestamp}_${slug}.json`;

    try {
        writeFileSync(
            join(SESSIONS_DIR, filename),
            JSON.stringify(session, null, 2),
            'utf-8'
        );
        session._filename = filename;
        return true;
    } catch (e) {
        console.error('Failed to save session:', e.message);
        return false;
    }
}

/**
 * Delete session from disk
 */
function deleteSessionFromDisk(session) {
    if (!session._filename) return false;

    try {
        unlinkSync(join(SESSIONS_DIR, session._filename));
        return true;
    } catch (e) {
        console.error('Failed to delete session:', e.message);
        return false;
    }
}

/**
 * Session Store (zustand)
 */
export const useSessionStore = create((set, get) => ({
    // State
    sessions: [],
    currentSession: null,
    filter: 'all', // all, completed, running, failed
    loading: false,
    error: null,

    // Stats
    stats: {
        total: 0,
        completed: 0,
        running: 0,
        paused: 0,
        failed: 0
    },

    // Load all sessions
    loadSessions: () => {
        set({ loading: true, error: null });
        try {
            const sessions = loadSessionsFromDisk();
            const stats = {
                total: sessions.length,
                completed: sessions.filter(s => s.status === SessionStatus.COMPLETED).length,
                running: sessions.filter(s => s.status === SessionStatus.RUNNING).length,
                paused: sessions.filter(s => s.status === SessionStatus.PAUSED).length,
                failed: sessions.filter(s =>
                    s.status === SessionStatus.FAILED || s.status === SessionStatus.ABORTED
                ).length
            };
            set({ sessions, stats, loading: false });
        } catch (e) {
            set({ error: e.message, loading: false });
        }
    },

    // Get filtered sessions
    getFilteredSessions: () => {
        const { sessions, filter } = get();
        if (filter === 'all') return sessions;
        return sessions.filter(s => s.status === filter);
    },

    // Get session by ID
    getSession: (id) => {
        const { sessions } = get();
        return sessions.find(s => s.id === id);
    },

    // Create new session
    createSession: (decision, preset, provider, model) => {
        const session = createSession(decision, preset, provider, model);
        saveSessionToDisk(session);
        set(state => ({
            sessions: [session, ...state.sessions],
            currentSession: session,
            stats: { ...state.stats, total: state.stats.total + 1, running: state.stats.running + 1 }
        }));
        return session;
    },

    // Update session
    updateSession: (id, updates) => {
        set(state => {
            const sessions = state.sessions.map(s => {
                if (s.id === id) {
                    const updated = { ...s, ...updates };
                    saveSessionToDisk(updated);
                    return updated;
                }
                return s;
            });
            return { sessions };
        });
    },

    // Pause session
    pauseSession: (id) => {
        const session = get().getSession(id);
        if (session && session.status === SessionStatus.RUNNING) {
            get().updateSession(id, {
                status: SessionStatus.PAUSED,
                checkpoint: { ...session.checkpoint, resumable: true }
            });
        }
    },

    // Resume session
    resumeSession: (id) => {
        const session = get().getSession(id);
        if (session && session.status === SessionStatus.PAUSED) {
            get().updateSession(id, { status: SessionStatus.RUNNING });
        }
    },

    // Cancel session
    cancelSession: (id) => {
        get().updateSession(id, { status: SessionStatus.ABORTED });
    },

    // Complete session
    completeSession: (id, recommendations) => {
        get().updateSession(id, {
            status: SessionStatus.COMPLETED,
            'phases.transmit.recommendations': recommendations,
            'phases.transmit.status': 'completed',
            'metrics.completed_at': new Date().toISOString()
        });
    },

    // Delete session
    deleteSession: (id) => {
        const session = get().getSession(id);
        if (session) {
            deleteSessionFromDisk(session);
            set(state => ({
                sessions: state.sessions.filter(s => s.id !== id),
                stats: { ...state.stats, total: state.stats.total - 1 }
            }));
        }
    },

    // Clone session
    cloneSession: (id) => {
        const original = get().getSession(id);
        if (original) {
            const clone = createSession(
                original.decision,
                original.preset,
                original.provider,
                original.model
            );
            saveSessionToDisk(clone);
            set(state => ({
                sessions: [clone, ...state.sessions],
                currentSession: clone
            }));
            return clone;
        }
        return null;
    },

    // Set current session
    setCurrentSession: (session) => {
        set({ currentSession: session });
    },

    // Set filter
    setFilter: (filter) => {
        set({ filter });
    },

    // Get recent sessions (last N days)
    getRecentSessions: (days = 7) => {
        const { sessions } = get();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return sessions.filter(s => new Date(s.metrics?.started_at) >= cutoff);
    },

    // Get running sessions
    getActiveSessions: () => {
        const { sessions } = get();
        return sessions.filter(s =>
            s.status === SessionStatus.RUNNING || s.status === SessionStatus.PAUSED
        );
    }
}));

export default useSessionStore;
