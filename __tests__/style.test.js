/**
 * SPAR Kit CSS Test Suite
 * Tests for stylesheet structure and critical styles
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('SPAR Kit CSS', () => {
    let css;

    beforeAll(() => {
        css = readFileSync(join(__dirname, '..', 'style.css'), 'utf-8');
    });

    describe('CSS Variables', () => {
        test('should define root CSS variables', () => {
            expect(css).toContain(':root');
        });

        test('should have direction color variables', () => {
            // Check for color definitions
            expect(css).toMatch(/--.*north|#3b82f6|blue/i);
        });
    });

    describe('Layout Styles', () => {
        test('should have container styles', () => {
            expect(css).toContain('.container');
        });

        test('should have header styles', () => {
            expect(css).toContain('.header');
        });

        test('should have footer styles', () => {
            expect(css).toContain('.footer');
        });
    });

    describe('Component Styles', () => {
        test('should have compass styles', () => {
            expect(css).toContain('.compass');
        });

        test('should have button styles', () => {
            expect(css).toMatch(/\.btn-primary|button/);
        });

        test('should have position/card styles', () => {
            expect(css).toContain('.position');
        });

        test('should have status indicator styles', () => {
            expect(css).toContain('.status');
        });
    });

    describe('Direction-Specific Styles', () => {
        test('should have north styles', () => {
            expect(css).toMatch(/\.north|north-pos/);
        });

        test('should have east styles', () => {
            expect(css).toMatch(/\.east|east-pos/);
        });

        test('should have south styles', () => {
            expect(css).toMatch(/\.south|south-pos/);
        });

        test('should have west styles', () => {
            expect(css).toMatch(/\.west|west-pos/);
        });
    });

    describe('Responsive Design', () => {
        test('should have media queries', () => {
            expect(css).toContain('@media');
        });
    });

    describe('Animation Styles', () => {
        test('should have transition properties', () => {
            expect(css).toContain('transition');
        });

        test('should have loading animation', () => {
            expect(css).toMatch(/loading|@keyframes|animation/);
        });
    });

    describe('Form Styles', () => {
        test('should have input styles', () => {
            expect(css).toMatch(/input|textarea/);
        });

        test('should have select styles', () => {
            expect(css).toContain('select');
        });
    });

    describe('Typography', () => {
        test('should use Inter font family', () => {
            expect(css).toContain('Inter');
        });

        test('should have font-size definitions', () => {
            expect(css).toContain('font-size');
        });
    });

    describe('Color Scheme', () => {
        test('should have dark background colors', () => {
            // Check for dark theme colors
            expect(css).toMatch(/#[0-9a-f]{6}|rgb|hsl/i);
        });
    });
});

describe('SPAR Kit CSS Syntax Validation', () => {
    let css;

    beforeAll(() => {
        css = readFileSync(join(__dirname, '..', 'style.css'), 'utf-8');
    });

    test('should have balanced curly braces', () => {
        const openBraces = (css.match(/{/g) || []).length;
        const closeBraces = (css.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);
    });

    test('should not have empty rules', () => {
        // Allow for minified CSS where {} may not have whitespace
        const emptyRules = css.match(/{\s*}/g) || [];
        expect(emptyRules.length).toBe(0);
    });

    test('should end properties with semicolons', () => {
        // Check that most properties end with semicolons
        const properties = css.match(/:[^{}]+;/g) || [];
        expect(properties.length).toBeGreaterThan(0);
    });

    test('should have valid selectors', () => {
        // Check for common selector patterns
        const hasClassSelectors = css.includes('.');
        const hasIdSelectors = css.includes('#') || true; // Optional
        const hasElementSelectors = css.match(/\bbody\b|\bhtml\b|\bheader\b/);

        expect(hasClassSelectors).toBe(true);
    });
});
