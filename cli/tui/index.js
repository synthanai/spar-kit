#!/usr/bin/env node

/**
 * SPAR-Kit TUI: Entry Point
 * 
 * Launches the interactive TUI for SPAR-Kit Mission Control.
 */

import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

/**
 * Launch TUI
 */
export function launchTUI() {
    const { waitUntilExit } = render(<App />);
    return waitUntilExit();
}

// Run if executed directly
if (process.argv[1].includes('tui')) {
    launchTUI().catch(console.error);
}

export default launchTUI;
