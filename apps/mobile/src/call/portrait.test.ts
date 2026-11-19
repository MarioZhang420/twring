import { describe, expect, it } from 'vitest';

import { activeWave, hearingLabel, ringKey } from './portrait';
import { callLook } from './wave';

describe('ringKey', () => {
  it('maps each call state to its palette colour', () => {
    expect(ringKey(callLook('CONNECTING', false, false))).toBe('textTertiary');
    expect(ringKey(callLook('LISTENING', false, false))).toBe('listening');
    expect(ringKey(callLook('USER_SPEAKING', false, false))).toBe('userSpeaking');
    expect(ringKey(callLook('AGENT_WORKING', false, true))).toBe('working');
    expect(ringKey(callLook('AGENT_SPEAKING', false, false))).toBe('speaking');
    expect(ringKey(callLook('RECONNECTING', false, false))).toBe('reconnecting');
  });

  it('does not show the user speaking while muted', () => {
    expect(ringKey(callLook('USER_SPEAKING', true, false))).toBe('listening');
  });
});

describe('activeWave', () => {
  it('follows the speaker and lies flat otherwise', () => {
    expect(activeWave(callLook('AGENT_SPEAKING', false, false))).toEqual({
      who: 'agent',
      mode: 'live',
    });
    expect(activeWave(callLook('USER_SPEAKING', false, false))).toEqual({
      who: 'you',
      mode: 'live',
    });
    expect(activeWave(callLook('LISTENING', false, false))).toEqual({ who: 'none', mode: 'flat' });
    expect(activeWave(callLook('RECONNECTING', false, false))).toEqual({
      who: 'none',
      mode: 'frozen',
    });
  });
});

describe('hearingLabel', () => {
  const base = { status: 'LISTENING' as const, muted: false, fresh: true, hearing: false };
  it('asks for speech only while listening', () => {
    expect(hearingLabel(base)).toBe('Say something');
    expect(hearingLabel({ ...base, status: 'USER_SPEAKING' })).toBe('Say something');
    expect(hearingLabel({ ...base, status: 'AGENT_SPEAKING' })).toBe('Mic is on');
    expect(hearingLabel({ ...base, status: 'AGENT_WORKING' })).toBe('Mic is on');
  });
  it('keeps muted, stale and hearing labels', () => {
    expect(hearingLabel({ ...base, muted: true })).toBe('You are muted');
    expect(hearingLabel({ ...base, fresh: false })).toBe('Waiting for audio…');
    expect(hearingLabel({ ...base, hearing: true })).toBe('Twring hears you');
  });
});
