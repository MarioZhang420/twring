import { Pressable, StyleSheet } from 'react-native';

import { usePalette } from '@/theme/tokens';

import { Icon } from './Icon';

interface Props {
  name: string;
  onPress: () => void;
  /** The agent is offline: the button stays visible but greyed out. */
  disabled?: boolean;
  variant?: 'outline' | 'fill';
}

/** The round Call control beside an agent: one look in lists, headers and history. */
export function CallButton({ name, onPress, disabled = false, variant = 'outline' }: Props) {
  const palette = usePalette();
  const fill = variant === 'fill' && !disabled;
  const background = fill ? palette.accent : palette.surfaceRaised;
  const border = disabled || fill ? 'transparent' : palette.borderAccent;
  const iconColor = disabled ? palette.textMuted : fill ? palette.onAccent : palette.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={disabled ? `Call ${name}, offline` : `Call ${name}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, borderColor: border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Icon name="phone" size={20} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
