import { describe, expect, it } from 'vitest';

import { withoutRemoved } from './history';
import type { HistoryEntry } from './protocol';

const entry = (id: string): HistoryEntry => ({
  call_id: id,
  agent_id: 'agt_aaaaaaaaaaaaaaaaaaaa',
  agent_name: 'Operator',
  started_at: '2026-01-01T00:00:00.000Z',
  duration_s: 5,
  outcome: 'completed',
});

describe('withoutRemoved', () => {
  it('drops only the removed ids and keeps the order', () => {
    const list = [entry('a'), entry('b'), entry('c')];
    expect(withoutRemoved(list, new Set(['b'])).map((e) => e.call_id)).toEqual(['a', 'c']);
  });

  it('returns everything when nothing was removed, and nothing when all were', () => {
    const list = [entry('a'), entry('b')];
    expect(withoutRemoved(list, new Set())).toEqual(list);
    expect(withoutRemoved(list, new Set(['a', 'b']))).toEqual([]);
  });
});
