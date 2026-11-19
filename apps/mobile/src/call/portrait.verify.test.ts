import type { CallState } from '@twring/contracts';
import { describe, expect, it } from 'vitest';

import { activeWave, hearingLabel, ringKey } from './portrait';
import { callLook } from './wave';

const ALL: CallState['status'][] = [
  'IDLE',
  'PREPARING',
  'CONNECTING',
  'LISTENING',
  'USER_SPEAKING',
  'AGENT_WORKING',
  'AGENT_SPEAKING',
  'RECONNECTING',
  'ENDING',
  'ENDED',
  'FAILED',
];

describe('portrait: every call status', () => {
  for (const status of ALL)
    for (const muted of [false, true])
      it(`${status} muted=${muted} maps without throwing`, () => {
        const look = callLook(status, muted, false);
        expect(ringKey(look)).toBeTruthy();
        expect(['live', 'frozen', 'flat']).toContain(activeWave(look).mode);
        for (const fresh of [false, true])
          for (const hearing of [false, true])
            expect(hearingLabel({ status, muted, fresh, hearing }).length).toBeGreaterThan(0);
      });

  it('reconnecting keeps the reconnecting ring even when muted', () => {
    expect(ringKey(callLook('RECONNECTING', true, false))).toBe('reconnecting');
  });
});
