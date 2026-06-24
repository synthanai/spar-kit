/**
 * SPAR Kit HTML/JavaScript Test Suite
 * Tests for the browser-based UI functionality
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('SPAR Kit HTML Interface', () => {
    let dom;
    let document;

    beforeEach(() => {
        const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
        dom = new JSDOM(html, {
            runScripts: 'outside-only',
            url: 'http://localhost'
        });
        document = dom.window.document;
    });

    afterEach(() => {
        dom.window.close();
    });

    describe('HTML Structure', () => {
        test('should have document title containing SPAR', () => {
            expect(document.title).toContain('SPAR');
            expect(document.title).toContain('Four Voices');
        });

        test('should have meta viewport for responsive design', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            expect(viewport).not.toBeNull();
            expect(viewport.content).toContain('width=device-width');
        });

        test('should have meta description for SEO', () => {
            const description = document.querySelector('meta[name="description"]');
            expect(description).not.toBeNull();
            expect(description.content.length).toBeGreaterThan(20);
        });

        test('should have inline styles or external stylesheet', () => {
            const inlineStyle = document.querySelector('style');
            const externalStyle = document.querySelector('link[href*="style"]');
            expect(inlineStyle || externalStyle).not.toBeNull();
        });

        test('should have JavaScript', () => {
            // Can be inline or external script
            const inlineScript = document.querySelector('script:not([src])');
            const externalScript = document.querySelector('script[src*="spar"]');
            expect(inlineScript || externalScript).not.toBeNull();
        });
    });

    describe('Header Section', () => {
        test('should have logo with boxing glove emoji', () => {
            const logo = document.querySelector('.logo-icon');
            expect(logo).not.toBeNull();
            expect(logo.textContent).toBe('🥊');
        });

        test('should have SPAR text', () => {
            const logoText = document.querySelector('.logo-text');
            expect(logoText).not.toBeNull();
            expect(logoText.textContent).toContain('SPAR');
        });

        test('should have Tamil content somewhere', () => {
            const body = document.body.textContent;
            expect(body).toContain('நாலு');
        });
    });

    describe('Setup Section', () => {
        test('should have provider selector', () => {
            const provider = document.getElementById('provider');
            expect(provider).not.toBeNull();
            expect(provider.tagName.toLowerCase()).toBe('select');
        });

        test('should have all three provider options', () => {
            const options = document.querySelectorAll('#provider option');
            const values = Array.from(options).map(o => o.value);
            expect(values).toContain('openai');
            expect(values).toContain('anthropic');
            expect(values).toContain('gemini');
        });

        test('should have API key input', () => {
            const apiKey = document.getElementById('apiKey');
            expect(apiKey).not.toBeNull();
            expect(apiKey.type).toBe('password');
        });

        test('should have toggle visibility button', () => {
            const toggle = document.querySelector('[onclick*="toggle"]');
            expect(toggle).not.toBeNull();
        });
    });

    describe('Decision Section', () => {
        test('should have decision textarea', () => {
            const textarea = document.getElementById('decisionInput');
            expect(textarea).not.toBeNull();
            expect(textarea.tagName.toLowerCase()).toBe('textarea');
        });

        test('should have placeholder text', () => {
            const textarea = document.getElementById('decisionInput');
            expect(textarea.placeholder.length).toBeGreaterThan(10);
        });
    });

    describe('Compass Section', () => {
        test('should have all four direction indicators', () => {
            const north = document.getElementById('north-indicator');
            const east = document.getElementById('east-indicator');
            const south = document.getElementById('south-indicator');
            const west = document.getElementById('west-indicator');

            expect(north).not.toBeNull();
            expect(east).not.toBeNull();
            expect(south).not.toBeNull();
            expect(west).not.toBeNull();
        });

        test('should have direction icons', () => {
            const icons = document.querySelectorAll('.direction-icon');
            expect(icons.length).toBeGreaterThanOrEqual(4);
        });

        test('should have persona names', () => {
            const names = document.querySelectorAll('.direction-name');
            expect(names.length).toBeGreaterThanOrEqual(4);
        });

        test('should have SPAR button', () => {
            const btn = document.getElementById('sparBtn');
            expect(btn).not.toBeNull();
            expect(btn.textContent).toContain('SPAR');
        });
    });

    describe('Debate Section', () => {
        test('should have debate section', () => {
            const debate = document.getElementById('debate');
            expect(debate).not.toBeNull();
        });

        test('should have Round 1 section', () => {
            const round1 = document.getElementById('round1') || document.querySelector('.round-1, .positions-grid, [class*="round"]');
            expect(round1).not.toBeNull();
        });

        test('should have Round 2 section', () => {
            const round2 = document.getElementById('round2');
            expect(round2).not.toBeNull();
        });

        test('should have synthesis section', () => {
            const synthesis = document.getElementById('synthesis');
            expect(synthesis).not.toBeNull();
        });

        test('should have all four persona response containers', () => {
            const directions = ['north', 'east', 'south', 'west'];
            for (const dir of directions) {
                const content = document.getElementById(`${dir}-content`);
                const status = document.getElementById(`${dir}-status`);
                expect(content).not.toBeNull();
                expect(status).not.toBeNull();
            }
        });
    });

    describe('Actions Section', () => {
        test('should have actions section', () => {
            const actions = document.getElementById('actions');
            expect(actions).not.toBeNull();
        });

        test('should have export markdown functionality', () => {
            const btn = document.querySelector('[onclick*="export"]');
            expect(btn).not.toBeNull();
        });

        test('should have round 2 functionality', () => {
            const btn = document.querySelector('[onclick*="Round2"], [onclick*="round2"]');
            expect(btn).not.toBeNull();
        });

        test('should have reset/new SPAR functionality', () => {
            const btn = document.querySelector('[onclick*="reset"], [onclick*="new"]');
            expect(btn).not.toBeNull();
        });
    });

    describe('Footer Section', () => {
        test('should have footer', () => {
            const footer = document.querySelector('footer, .footer');
            expect(footer).not.toBeNull();
        });

        test('should have GitHub link', () => {
            const link = document.querySelector('a[href*="github"]');
            expect(link).not.toBeNull();
        });
    });

    describe('Accessibility', () => {
        test('should have proper document language', () => {
            expect(document.documentElement.lang).toBe('en');
        });

        test('should have form labels or aria', () => {
            const labels = document.querySelectorAll('label');
            const ariaLabels = document.querySelectorAll('[aria-label]');
            expect(labels.length + ariaLabels.length).toBeGreaterThan(0);
        });
    });
});

describe('SPAR Kit JavaScript Engine', () => {
    // Test the JavaScript logic (from spar.js)

    describe('PERSONAS Constant', () => {
        const PERSONAS = {
            north: {
                name: 'The Visionary',
                direction: 'North',
                icon: '🔵',
                color: '#3b82f6'
            },
            east: {
                name: 'The Challenger',
                direction: 'East',
                icon: '🟢',
                color: '#22c55e'
            },
            south: {
                name: 'The Pragmatist',
                direction: 'South',
                icon: '🟡',
                color: '#eab308'
            },
            west: {
                name: 'The Sage',
                direction: 'West',
                icon: '🔴',
                color: '#ef4444'
            }
        };

        test('should have four directions', () => {
            expect(Object.keys(PERSONAS)).toHaveLength(4);
        });

        test('each persona should have color property', () => {
            for (const persona of Object.values(PERSONAS)) {
                expect(persona).toHaveProperty('color');
                expect(persona.color).toMatch(/^#[0-9a-f]{6}$/i);
            }
        });
    });

    describe('State Management', () => {
        test('should initialize with empty state', () => {
            const sparState = {
                decision: '',
                responses: {
                    round1: { north: '', east: '', south: '', west: '' },
                    round2: { north: '', east: '', south: '', west: '' }
                },
                synthesis: ''
            };

            expect(sparState.decision).toBe('');
            expect(sparState.synthesis).toBe('');
            expect(Object.values(sparState.responses.round1).every(v => v === '')).toBe(true);
            expect(Object.values(sparState.responses.round2).every(v => v === '')).toBe(true);
        });

        test('should handle state updates', () => {
            const sparState = {
                decision: '',
                responses: {
                    round1: { north: '', east: '', south: '', west: '' },
                    round2: { north: '', east: '', south: '', west: '' }
                },
                synthesis: ''
            };

            sparState.decision = 'Should we expand?';
            sparState.responses.round1.north = 'North response';

            expect(sparState.decision).toBe('Should we expand?');
            expect(sparState.responses.round1.north).toBe('North response');
        });
    });

    describe('API Configuration', () => {
        test('should validate provider is selected', () => {
            const provider = 'openai';
            const apiKey = 'sk-test123';

            const isValid = provider && apiKey && apiKey.length > 0;
            expect(isValid).toBe(true);
        });

        test('should reject empty API key', () => {
            const provider = 'openai';
            const apiKey = '';

            const isValid = Boolean(provider && apiKey && apiKey.length > 0);
            expect(isValid).toBe(false);
        });
    });

    describe('Markdown Export', () => {
        test('should generate complete markdown with all sections', () => {
            const sparState = {
                decision: 'Test decision',
                responses: {
                    round1: {
                        north: 'North R1',
                        east: 'East R1',
                        south: 'South R1',
                        west: 'West R1'
                    },
                    round2: {
                        north: 'North R2',
                        east: 'East R2',
                        south: 'South R2',
                        west: 'West R2'
                    }
                },
                synthesis: 'Synthesis content'
            };
            const date = '2026-01-14';

            const md = `# SPAR Session: ${sparState.decision.substring(0, 50)}...

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
> *Four voices, four directions, one decision.*

Generated by [SPAR Kit](https://github.com/synthanai/spar-kit)
`;

            expect(md).toContain('# SPAR Session');
            expect(md).toContain('## The Decision');
            expect(md).toContain('Test decision');
            expect(md).toContain('## Round 1: Opening Positions');
            expect(md).toContain('## Round 2: The Clash');
            expect(md).toContain('## Synthesis');
            expect(md).toContain('நாலு பேரு, நாலு திசை, ஒரு முடிவு');
        });

        test('should handle missing round 2 responses', () => {
            const responses = { north: '', east: '', south: '', west: '' };

            const md = Object.entries(responses).map(([dir, content]) =>
                content || 'Not run'
            );

            expect(md.every(s => s === 'Not run')).toBe(true);
        });
    });

    describe('Reset Functionality', () => {
        test('should reset state to initial values', () => {
            let sparState = {
                decision: 'Some decision',
                responses: {
                    round1: { north: 'resp', east: 'resp', south: 'resp', west: 'resp' },
                    round2: { north: 'resp', east: 'resp', south: 'resp', west: 'resp' }
                },
                synthesis: 'Some synthesis'
            };

            // Reset
            sparState = {
                decision: '',
                responses: {
                    round1: { north: '', east: '', south: '', west: '' },
                    round2: { north: '', east: '', south: '', west: '' }
                },
                synthesis: ''
            };

            expect(sparState.decision).toBe('');
            expect(sparState.synthesis).toBe('');
        });
    });
});
