import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: unknown) => styles },
  View: 'View',
  Text: 'Text',
}));
vi.mock('react-native-reanimated', () => ({
  default: { View: 'View' },
  useReducedMotion: () => true,
}));
vi.mock('@/components/GhostButton', () => ({ GhostButton: () => null }));
vi.mock('@/theme/tokens', () => ({ type: { body: { fontSize: 15 } }, usePalette: () => ({}) }));
vi.mock('@/threads/presentation', () => ({ workingLabel: (activity?: string) => activity }));
vi.mock('./Bubble', () => ({ Bubble: () => null }));

import { WorkingRow, workingText } from './WorkingRow';

it('keeps the activity in the label (reduced motion only stops the dots)', () => {
  expect(workingText('Reading files')).toBe('Working · Reading files');
  expect(workingText(undefined)).toBe('Working…');
});

it('shows the activity with reduced motion', () => {
  const wrap = WorkingRow({
    name: 'Hermes',
    activity: 'Reading files',
    onStop: vi.fn(),
    onLink: vi.fn(),
  }) as ReactElement<{ children: ReactNode }>;
  const row = Children.toArray(wrap.props.children).filter(isValidElement)[0] as ReactElement<{
    children: ReactNode;
  }>;
  const parts = Children.toArray(row.props.children).filter(isValidElement);
  const label = parts[0] as ReactElement<{ children: string }>;
  expect(label.props.children).toBe('Working · Reading files');
  expect(parts).toHaveLength(2);
});
