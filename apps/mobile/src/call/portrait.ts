import type { CallState } from '@twring/contracts';

import type { CallLook, WaveMode } from './wave';

/** The palette colour of the ring around the agent's portrait. */
export type RingKey =
  'listening' | 'userSpeaking' | 'speaking' | 'working' | 'reconnecting' | 'textTertiary';

/** Read from the call look, so the ring never claims a state the call is not in. */
export function ringKey(look: CallLook): RingKey {
  switch (look.orb) {
    case 'you':
      return 'userSpeaking';
    case 'agent':
      return 'speaking';
    case 'working':
      return 'working';
    case 'reconnecting':
      return 'reconnecting';
    case 'connecting':
      return 'textTertiary';
    case 'idle':
      return 'listening';
    default: {
      const exhaustive: never = look.orb;
      return exhaustive;
    }
  }
}

/** The one waveform follows whoever has the floor; with nobody speaking it lies flat. */
export function activeWave(look: CallLook): { who: 'agent' | 'you' | 'none'; mode: WaveMode } {
  if (look.who === 'agent') return { who: 'agent', mode: look.agentWave };
  if (look.who === 'you') return { who: 'you', mode: look.youWave };
  return { who: 'none', mode: look.agentWave === 'frozen' ? 'frozen' : 'flat' };
}

export function hearingLabel({
  status,
  muted,
  fresh,
  hearing,
}: {
  status: CallState['status'];
  muted: boolean;
  fresh: boolean;
  hearing: boolean;
}): string {
  if (muted) return 'You are muted';
  if (!fresh) return 'Waiting for audio…';
  if (hearing) return 'Twring hears you';
  if (status === 'LISTENING' || status === 'USER_SPEAKING') return 'Say something';
  return 'Mic is on';
}
