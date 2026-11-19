import { beforeEach, expect, it, vi } from 'vitest';

interface State {
  pathname: string;
  view: { call: unknown; connectedAt?: number };
}
const state = vi.hoisted((): State => ({ pathname: '/', view: { call: { status: 'IDLE' } } }));
vi.mock('expo-router', () => ({ usePathname: () => state.pathname }));
vi.mock('./session', () => ({ useCallView: () => state.view }));

import { useOnCall } from './on-call';

beforeEach(() => {
  state.pathname = '/';
  state.view = { call: { status: 'IDLE' } };
});

it('is inactive without a call', () => {
  expect(useOnCall()).toEqual({ active: false });
});

it('is active with the start time on other screens during a call', () => {
  state.view = { call: { status: 'LISTENING', callId: 'call-1' }, connectedAt: 1000 };
  expect(useOnCall()).toEqual({ active: true, connectedAt: 1000 });
});

it('is inactive on the call screen itself', () => {
  state.pathname = '/call';
  state.view = { call: { status: 'LISTENING', callId: 'call-1' }, connectedAt: 1000 };
  expect(useOnCall()).toEqual({ active: false });
});
