import type { ReactElement } from 'react';
import { expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  StyleSheet: { create: (styles: unknown) => styles, hairlineWidth: 1 },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));
vi.mock('./Icon', () => ({ Icon: () => null }));
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

import { CallButton } from './CallButton';

type ButtonProps = {
  accessibilityLabel: string;
  accessibilityState: { disabled: boolean };
  disabled: boolean;
  children: ReactElement<{ color: string }>;
};

it('labels an offline agent and disables the button', () => {
  const button = CallButton({
    name: 'Hermes',
    onPress: vi.fn(),
    disabled: true,
  }) as ReactElement<ButtonProps>;
  expect(button.props.accessibilityLabel).toBe('Call Hermes, offline');
  expect(button.props.accessibilityState).toEqual({ disabled: true });
  expect(button.props.disabled).toBe(true);
  expect(button.props.children.props.color).toBe('muted');
});

it('calls an online agent', () => {
  const onPress = vi.fn();
  const button = CallButton({ name: 'Hermes', onPress, variant: 'fill' }) as ReactElement<
    ButtonProps & { onPress: () => void }
  >;
  expect(button.props.accessibilityLabel).toBe('Call Hermes');
  expect(button.props.accessibilityState).toEqual({ disabled: false });
  expect(button.props.children.props.color).toBe('onAccent');
  button.props.onPress();
  expect(onPress).toHaveBeenCalledOnce();
});
