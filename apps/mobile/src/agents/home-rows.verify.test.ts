import type { Agent, ThreadSummary } from '@twring/contracts';
import { describe, expect, it } from 'vitest';

import { homeRow } from './home-rows';

const base = {
  id: 'a1',
  name: 'Ada',
  updated_at: '2026-11-19T10:00:00Z',
  connector_online: true,
} as unknown as Agent;

describe('homeRow edge cases', () => {
  it('agent with no thread has a line and zero unread', () => {
    const r = homeRow(base, undefined, new Set(), false);
    expect(r.unread).toBe(0);
    expect(r.line.length).toBeGreaterThan(0);
    expect(r.call).toBe('enabled');
  });
  it('connector_removed is offline and call disabled', () => {
    const r = homeRow({ ...base, connector_removed: true }, undefined, new Set(), false);
    expect(r.offline).toBe(true);
    expect(r.call).toBe('disabled');
  });
  it('chats off keeps the unread count from the thread', () => {
    const r = homeRow(base, { unread: 150 } as unknown as ThreadSummary, new Set(), true);
    expect(r.unread).toBe(150);
  });
});
