import { describe, expect, it } from 'vitest';

import { statusLineContent } from './status-line';

describe('status line edge cases', () => {
  it('empty thread is empty', () => {
    expect(statusLineContent({ name: 'A', aiApp: false, working: false })).toEqual({
      kind: 'empty',
    });
  });
  it('working with no activity still has text', () => {
    const c = statusLineContent({ name: 'A', aiApp: false, working: true, activity: '' });
    expect(c.kind).toBe('working');
    if (c.kind === 'working') expect(c.text.length).toBeGreaterThan(0);
  });
  it('working beats a failed unsent message (plan priority order)', () => {
    const c = statusLineContent({
      name: 'A',
      aiApp: false,
      working: true,
      pending: { clientId: 'c1', state: 'failed' },
    });
    expect(c.kind).toBe('working');
  });
  it('AI app failed pending send still offers Retry in danger tone', () => {
    const c = statusLineContent({
      name: 'A',
      aiApp: true,
      working: false,
      pending: { clientId: 'c1', state: 'failed' },
    });
    expect(c).toMatchObject({ kind: 'status', tone: 'danger', retryClientId: 'c1' });
  });
});
