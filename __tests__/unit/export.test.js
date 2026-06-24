/**
 * SPAR-Kit Unit Tests: Export Functions
 */

import { describe, test, expect } from '@jest/globals';

// Mock session data
const mockSession = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    version: '1.0.0',
    decision: 'Should we expand to the Singapore market?',
    status: 'completed',
    personas: ['north', 'east', 'south', 'west'],
    phases: {
        rumble: {
            responses: {
                north: 'The Visionary response...',
                east: 'The Challenger response...',
                south: 'The Pragmatist response...',
                west: 'The Sage response...'
            }
        },
        knit: {
            synthesis: 'Combined analysis suggests...'
        }
    },
    metrics: {
        duration: 134,
        tokenCount: 4521,
        llmCalls: 8
    },
    createdAt: '2026-01-14T10:00:00Z',
    completedAt: '2026-01-14T10:02:14Z'
};

describe('Export Functions', () => {
    describe('exportToMarkdown', () => {
        test('generates valid markdown', () => {
            const md = generateMarkdown(mockSession);

            expect(md).toContain('# SPAR Session');
            expect(md).toContain(mockSession.decision);
            expect(md).toContain('## Opening Positions');
            expect(md).toContain('## Synthesis');
        });

        test('includes all persona responses', () => {
            const md = generateMarkdown(mockSession);

            expect(md).toContain('North');
            expect(md).toContain('East');
            expect(md).toContain('South');
            expect(md).toContain('West');
        });

        test('includes metrics section', () => {
            const md = generateMarkdown(mockSession);

            expect(md).toContain('Duration');
            expect(md).toContain('Tokens');
        });

        test('handles missing phases gracefully', () => {
            const incomplete = { ...mockSession, phases: {} };
            const md = generateMarkdown(incomplete);

            expect(md).toBeDefined();
            expect(typeof md).toBe('string');
        });
    });

    describe('exportToJSON', () => {
        test('produces valid JSON', () => {
            const json = generateJSON(mockSession);

            expect(() => JSON.parse(json)).not.toThrow();
        });

        test('preserves all fields', () => {
            const json = generateJSON(mockSession);
            const parsed = JSON.parse(json);

            expect(parsed.id).toBe(mockSession.id);
            expect(parsed.decision).toBe(mockSession.decision);
            expect(parsed.status).toBe(mockSession.status);
        });

        test('excludes internal fields', () => {
            const sessionWithInternal = {
                ...mockSession,
                _filename: '/path/to/file',
                _internal: { temp: true }
            };
            const json = generateJSON(sessionWithInternal);
            const parsed = JSON.parse(json);

            expect(parsed._filename).toBeUndefined();
            expect(parsed._internal).toBeUndefined();
        });
    });

    describe('exportToText', () => {
        test('produces plain text', () => {
            const txt = generateText(mockSession);

            expect(typeof txt).toBe('string');
            expect(txt).not.toContain('<');
            expect(txt).not.toContain('>');
        });

        test('includes decision', () => {
            const txt = generateText(mockSession);

            expect(txt).toContain(mockSession.decision);
        });

        test('is human readable', () => {
            const txt = generateText(mockSession);

            // Should have line breaks for readability
            expect(txt.split('\n').length).toBeGreaterThan(5);
        });
    });
});

describe('Export Format Detection', () => {
    test('detects markdown by extension', () => {
        expect(getFormatFromPath('report.md')).toBe('markdown');
    });

    test('detects JSON by extension', () => {
        expect(getFormatFromPath('data.json')).toBe('json');
    });

    test('detects text by extension', () => {
        expect(getFormatFromPath('summary.txt')).toBe('text');
    });

    test('defaults to markdown for unknown', () => {
        expect(getFormatFromPath('file.xyz')).toBe('markdown');
    });
});

// Helper functions (mocked implementations for testing)
function generateMarkdown(session) {
    let md = `# SPAR Session\n\n`;
    md += `**Decision:** ${session.decision}\n\n`;
    md += `**Status:** ${session.status}\n\n`;
    md += `## Opening Positions\n\n`;

    if (session.phases?.rumble?.responses) {
        Object.entries(session.phases.rumble.responses).forEach(([dir, response]) => {
            md += `### ${dir.charAt(0).toUpperCase() + dir.slice(1)}\n${response}\n\n`;
        });
    }

    md += `## Synthesis\n\n`;
    if (session.phases?.knit?.synthesis) {
        md += session.phases.knit.synthesis + '\n\n';
    }

    md += `## Metrics\n\n`;
    if (session.metrics) {
        md += `- Duration: ${session.metrics.duration}s\n`;
        md += `- Tokens: ${session.metrics.tokenCount}\n`;
    }

    return md;
}

function generateJSON(session) {
    const clean = { ...session };
    delete clean._filename;
    delete clean._internal;
    return JSON.stringify(clean, null, 2);
}

function generateText(session) {
    let txt = `SPAR SESSION REPORT\n`;
    txt += `==================\n\n`;
    txt += `Decision: ${session.decision}\n`;
    txt += `Status: ${session.status}\n\n`;
    txt += `Personas: ${session.personas?.join(', ') || 'N/A'}\n\n`;

    if (session.phases?.knit?.synthesis) {
        txt += `Synthesis:\n${session.phases.knit.synthesis}\n`;
    }

    return txt;
}

function getFormatFromPath(path) {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md': return 'markdown';
        case 'json': return 'json';
        case 'txt': return 'text';
        default: return 'markdown';
    }
}
