/**
 * SPAR Kit CSS Test Suite
 * Tests for stylesheet structure and critical styles
 * (Styles are now inline in index.html)
 * 
 * @author Naveen Riaz Mohamed Kani
 * @license MIT
 */

import { jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Extract CSS from the <style> tag in index.html
function extractCssFromHtml(htmlContent) {
    const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
    return styleMatch ? styleMatch[1] : '';
}

describe('SPAR Kit CSS', () => {
    let css;
    let html;

    beforeAll(() => {
        html = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
        css = extractCssFromHtml(html);
    });

    describe('CSS Variables', () => {
        test('should define root CSS variables', () => {
            expect(css).toContain(':root');
        });

        test('should have direction color variables', () => {
            expect(css).toContain('--north');
            expect(css).toContain('--east');
            expect(css).toContain('--south');
            expect(css).toContain('--west');
        });

        test('should define color values', () => {
            expect(css).toMatch(/#[0-9a-f]{6}/i);
        });
    });

    describe('Layout Styles', () => {
        test('should have container styles', () => {
            expect(css).toContain('container');
        });

        test('should have header styles', () => {
            expect(css).toContain('header');
        });

        test('should have footer styles', () => {
            expect(css).toContain('footer');
        });
    });

    describe('Component Styles', () => {
        test('should have compass styles', () => {
            expect(css).toContain('compass');
        });

        test('should have button styles', () => {
            expect(css).toMatch(/button|btn/);
        });

        test('should have position/card styles', () => {
            expect(css).toContain('position');
        });

        test('should have status indicator styles', () => {
            expect(css).toContain('status');
        });
    });

    describe('Direction-Specific Styles', () => {
        test('should have north styles', () => {
            expect(css).toMatch(/north/i);
        });

        test('should have east styles', () => {
            expect(css).toMatch(/east/i);
        });

        test('should have south styles', () => {
            expect(css).toMatch(/south/i);
        });

        test('should have west styles', () => {
            expect(css).toMatch(/west/i);
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

        test('should have animations or keyframes', () => {
            expect(css).toMatch(/@keyframes|animation/);
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
            expect(css).toMatch(/--void|--cosmos|background/i);
        });
    });
});

describe('SPAR Kit CSS Syntax Validation', () => {
    let css;

    beforeAll(() => {
        const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
        css = extractCssFromHtml(html);
    });

    test('should have balanced curly braces', () => {
        const openBraces = (css.match(/{/g) || []).length;
        const closeBraces = (css.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);
    });

    test('should not have empty rules', () => {
        const emptyRules = css.match(/{\s*}/g) || [];
        expect(emptyRules.length).toBe(0);
    });

    test('should end properties with semicolons', () => {
        const properties = css.match(/:[^{}]+;/g) || [];
        expect(properties.length).toBeGreaterThan(0);
    });

    test('should have valid selectors', () => {
        const hasClassSelectors = css.includes('.');
        expect(hasClassSelectors).toBe(true);
    });
});
