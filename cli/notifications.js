/**
 * SPAR-Kit Notifications Module
 * Terminal bell and desktop notifications for session events
 */

/**
 * Play terminal bell sound
 */
export function terminalBell() {
    // ASCII BEL character
    process.stdout.write('\x07');
}

/**
 * Notification types
 */
export const NotificationType = {
    SESSION_COMPLETE: 'session_complete',
    SESSION_ERROR: 'session_error',
    PHASE_COMPLETE: 'phase_complete',
    ATTENTION_NEEDED: 'attention_needed'
};

/**
 * Notification preferences (from config)
 */
let notificationSettings = {
    terminalBell: true,
    desktopNotifications: false,
    soundEnabled: true
};

/**
 * Configure notification settings
 */
export function configureNotifications(settings) {
    notificationSettings = { ...notificationSettings, ...settings };
}

/**
 * Send notification based on type
 */
export function notify(type, title, body) {
    if (notificationSettings.terminalBell) {
        // Play bell for important notifications
        if (type === NotificationType.SESSION_COMPLETE ||
            type === NotificationType.SESSION_ERROR ||
            type === NotificationType.ATTENTION_NEEDED) {
            terminalBell();
        }
    }

    if (notificationSettings.desktopNotifications) {
        sendDesktopNotification(title, body);
    }

    // Log to console as fallback
    console.log(`[SPAR] ${title}: ${body}`);
}

/**
 * Desktop notification using node-notifier (optional dependency)
 * Falls back gracefully if not installed
 */
export async function sendDesktopNotification(title, body) {
    try {
        // Dynamic import to make it optional
        const notifier = await import('node-notifier').catch(() => null);

        if (notifier) {
            notifier.default.notify({
                title: `🥊 SPAR-Kit: ${title}`,
                message: body,
                sound: notificationSettings.soundEnabled,
                timeout: 5
            });
        }
    } catch (e) {
        // node-notifier not installed, just use terminal
        terminalBell();
    }
}

/**
 * Convenience notification functions
 */
export function notifySessionComplete(decision) {
    notify(
        NotificationType.SESSION_COMPLETE,
        'Session Complete',
        `Your SPAR debate is ready: "${decision.substring(0, 40)}..."`
    );
}

export function notifySessionError(error) {
    notify(
        NotificationType.SESSION_ERROR,
        'Session Error',
        `An error occurred: ${error.substring(0, 50)}`
    );
}

export function notifyPhaseComplete(phase) {
    notify(
        NotificationType.PHASE_COMPLETE,
        'Phase Complete',
        `${phase.toUpperCase()} phase completed`
    );
}

export function notifyAttentionNeeded(message) {
    notify(
        NotificationType.ATTENTION_NEEDED,
        'Attention Needed',
        message
    );
}

export default {
    terminalBell,
    notify,
    notifySessionComplete,
    notifySessionError,
    notifyPhaseComplete,
    notifyAttentionNeeded,
    configureNotifications,
    NotificationType
};
