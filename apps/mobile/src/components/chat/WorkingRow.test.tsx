import { expect, it, vi } from 'vitest';

vi.mock('./Bubble', () => ({ Bubble: () => null }));
import { StreamingReply, workingText } from './WorkingRow';

it('keeps the activity in the label (reduced motion only stops the dots)', () => {
  expect(workingText('Reading files')).toBe('Working · Reading files');
  expect(workingText(undefined)).toBe('Working…');
});

it('renders nothing until text streams in', () => {
  expect(StreamingReply({ name: 'Hermes', onLink: vi.fn() })).toBeNull();
  expect(StreamingReply({ name: 'Hermes', text: 'Hi', onLink: vi.fn() })).not.toBeNull();
});
