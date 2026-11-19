import { expect, it } from 'vitest';

import { statusLineContent } from './status-line';

const base = { name: 'Hermes', aiApp: false, working: false };

it('working beats the latest status', () => {
  const content = statusLineContent({
    ...base,
    working: true,
    activity: 'Reading files',
    latest: { status: 'failed' },
  });
  expect(content).toEqual({
    kind: 'working',
    text: 'Working · Reading files',
    label: 'Reading files',
  });
});

it('shows a failed send in danger with a retry', () => {
  const content = statusLineContent({
    ...base,
    pending: { clientId: 'c1', state: 'failed' },
  });
  expect(content).toMatchObject({ kind: 'status', tone: 'danger', retryClientId: 'c1' });
});

it('shows a failed message in danger', () => {
  expect(statusLineContent({ ...base, latest: { status: 'failed' } })).toMatchObject({
    kind: 'status',
    tone: 'danger',
  });
});

it('is empty when there is nothing to say', () => {
  expect(statusLineContent(base)).toEqual({ kind: 'empty' });
});

it('uses the AI app reply copy', () => {
  expect(statusLineContent({ ...base, aiApp: true, latest: { status: 'sent' } })).toMatchObject({
    kind: 'status',
    text: 'Hermes reads this when it checks',
    tone: 'tertiary',
  });
});

it('shows an AI app send that failed in danger with a retry', () => {
  const content = statusLineContent({
    ...base,
    aiApp: true,
    pending: { clientId: 'c2', state: 'failed' },
  });
  expect(content).toMatchObject({
    kind: 'status',
    tone: 'danger',
    retryClientId: 'c2',
    text: "Didn't go through",
  });
});

it('never hides a failed AI app message behind the calm reply copy', () => {
  const content = statusLineContent({
    ...base,
    aiApp: true,
    latest: { status: 'failed', errorCode: 'rate_limited' },
  });
  expect(content).toMatchObject({
    kind: 'status',
    tone: 'danger',
    text: "Didn't go through: too many messages",
  });
});
