/**
 * SPAR-Kit TUI: Navigation Store
 * 
 * State management for TUI navigation and view state.
 */

import { create } from 'zustand';

/**
 * View Enum
 */
export const Views = {
    DASHBOARD: 'dashboard',
    SESSION_LIST: 'session_list',
    SESSION_DETAIL: 'session_detail',
    PHASE_VIEW: 'phase_view',
    LIVE_SESSION: 'live_session',
    NEW_DEBATE: 'new_debate',
    TEMPLATES: 'templates',
    SETTINGS: 'settings',
    HELP: 'help'
};

/**
 * Navigation Store (zustand)
 */
export const useNavigationStore = create((set, get) => ({
    // Current view
    currentView: Views.DASHBOARD,

    // View history for back navigation
    history: [],

    // View-specific state
    viewState: {
        selectedSessionId: null,
        selectedPhase: null,
        selectedRound: null,
        listOffset: 0,
        listSelected: 0
    },

    // Modal state
    modal: {
        visible: false,
        type: null, // 'confirm', 'input', 'error', 'success'
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null
    },

    // Navigate to view
    navigate: (view, state = {}) => {
        const current = get().currentView;
        set(prev => ({
            history: [...prev.history, { view: current, state: prev.viewState }],
            currentView: view,
            viewState: { ...prev.viewState, ...state }
        }));
    },

    // Go back
    goBack: () => {
        const { history } = get();
        if (history.length > 0) {
            const previous = history[history.length - 1];
            set({
                currentView: previous.view,
                viewState: previous.state,
                history: history.slice(0, -1)
            });
            return true;
        }
        return false;
    },

    // Can go back?
    canGoBack: () => get().history.length > 0,

    // Update view state
    updateViewState: (updates) => {
        set(prev => ({
            viewState: { ...prev.viewState, ...updates }
        }));
    },

    // Show modal
    showModal: (type, title, message, onConfirm, onCancel) => {
        set({
            modal: {
                visible: true,
                type,
                title,
                message,
                onConfirm,
                onCancel
            }
        });
    },

    // Hide modal
    hideModal: () => {
        set({
            modal: {
                visible: false,
                type: null,
                title: '',
                message: '',
                onConfirm: null,
                onCancel: null
            }
        });
    },

    // Confirm delete
    confirmDelete: (message, onConfirm) => {
        get().showModal('confirm', '⚠️ Confirm Delete', message, onConfirm, get().hideModal);
    },

    // Show error
    showError: (message) => {
        get().showModal('error', '❌ Error', message, get().hideModal);
    },

    // Show success
    showSuccess: (message) => {
        get().showModal('success', '✅ Success', message, get().hideModal);
    },

    // Reset navigation
    reset: () => {
        set({
            currentView: Views.DASHBOARD,
            history: [],
            viewState: {
                selectedSessionId: null,
                selectedPhase: null,
                selectedRound: null,
                listOffset: 0,
                listSelected: 0
            }
        });
    },

    // Select session and navigate to detail
    viewSession: (sessionId) => {
        get().navigate(Views.SESSION_DETAIL, { selectedSessionId: sessionId });
    },

    // View phase detail
    viewPhase: (phase, round = null) => {
        get().navigate(Views.PHASE_VIEW, { selectedPhase: phase, selectedRound: round });
    },

    // View live session
    viewLive: (sessionId) => {
        get().navigate(Views.LIVE_SESSION, { selectedSessionId: sessionId });
    },

    // Start new debate
    startNewDebate: () => {
        get().navigate(Views.NEW_DEBATE);
    }
}));

export default useNavigationStore;
