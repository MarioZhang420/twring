import type { UserMessageStatus } from '@twring/contracts';

import { aiAppReplyStatus } from '../../agents/ai-app';
import { apiErrorCopy } from '../../api/errors';
import { messageStatus, workingLabel } from '../../threads/presentation';

/** Reduced motion stops the dots, never the words. */
export function workingText(label: string | undefined): string {
  return label ? `Working · ${label}` : 'Working…';
}

export type StatusLineContent =
  | { kind: 'working'; text: string; label?: string }
  | { kind: 'status'; text: string; tone: 'tertiary' | 'danger'; retryClientId?: string }
  | { kind: 'empty' };

export interface StatusLineInput {
  name: string;
  aiApp: boolean;
  working: boolean;
  activity?: string;
  /** The newest unconfirmed send, if any. */
  pending?: { clientId: string; state: 'sending' | 'failed'; error?: unknown };
  /** The newest own message the server knows about. */
  latest?: { status: UserMessageStatus; errorCode?: string };
}

/** One line above the composer: working beats the latest send's status; otherwise nothing. */
export function statusLineContent(input: StatusLineInput): StatusLineContent {
  if (input.working) {
    const label = workingLabel(input.activity);
    return { kind: 'working', text: workingText(label), label };
  }
  const { pending, latest, name, aiApp } = input;
  if (pending) {
    if (pending.state === 'failed')
      return {
        kind: 'status',
        tone: 'danger',
        retryClientId: pending.clientId,
        text: pending.error
          ? `Didn't go through: ${apiErrorCopy(pending.error).message}`
          : messageStatus('failed', name),
      };
    return {
      kind: 'status',
      tone: 'tertiary',
      text: aiApp ? aiAppReplyStatus(name) : messageStatus('sending', name),
    };
  }
  if (latest)
    return {
      kind: 'status',
      tone: !aiApp && latest.status === 'failed' ? 'danger' : 'tertiary',
      text: aiApp ? aiAppReplyStatus(name) : messageStatus(latest.status, name, latest.errorCode),
    };
  return { kind: 'empty' };
}
