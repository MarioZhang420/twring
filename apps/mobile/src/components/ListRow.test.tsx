import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: unknown) => styles, hairlineWidth: 1 },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));
vi.mock('@/theme/fonts', () => ({ font: { body: 'body', bodyEmphasis: 'emphasis' } }));
vi.mock('@/theme/tokens', () => ({
  radius: new Proxy({}, { get: () => 0 }),
  space: new Proxy({}, { get: () => 0 }),
  type: new Proxy({}, { get: () => ({ fontSize: 0 }) }),
  usePalette: () => ({
    surfaceRaised: 'raised',
    border: 'border',
    borderAccent: 'borderAccent',
    accent: 'accent',
    onAccent: 'onAccent',
    textMuted: 'muted',
    textPrimary: 'primary',
    textSecondary: 'secondary',
    textTertiary: 'tertiary',
    danger: 'danger',
  }),
}));

import { ListRow } from './ListRow';

function rightColumn(row: ReactElement<{ children: ReactNode }>) {
  const children = Children.toArray(row.props.children).filter(isValidElement);
  return children[1] as ReactElement<{ testID: string; children?: ReactNode }>;
}

it('keeps the right column when there is no control', () => {
  const row = ListRow({ avatar: null, title: 'Hermes', accessibilityLabel: 'Hermes' });
  const right = rightColumn(row as ReactElement<{ children: ReactNode }>);
  expect(right.props.testID).toBe('list-row-right');
  expect(right.props.children).toBeUndefined();
});

it('puts the control in the right column', () => {
  const control = <></>;
  const row = ListRow({
    avatar: null,
    title: 'Hermes',
    accessibilityLabel: 'Hermes',
    right: control,
  });
  expect(rightColumn(row as ReactElement<{ children: ReactNode }>).props.children).toBe(control);
});
