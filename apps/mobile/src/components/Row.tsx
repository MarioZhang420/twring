import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { space, type, usePalette } from '@/theme/tokens';
import { Icon } from './Icon';

interface Props {
  label: string;
  value?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  /** False for the last row of a card, so no line sits on the card's edge. */
  divider?: boolean;
  /** `inline` puts a short value on the right; `stacked` puts a sentence under the label. */
  layout?: 'inline' | 'stacked';
}

/** A settings-style line: label, current value underneath, and a chevron when it opens more. */
export function Row({
  label,
  value,
  onPress,
  accessibilityHint,
  divider = true,
  layout = 'inline',
}: Props) {
  const palette = usePalette();
  const { fontScale } = useWindowDimensions();
  const inline = layout === 'inline' && fontScale <= 1.3;
  const line = {
    borderColor: palette.border,
    borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0,
  };
  const body = (
    <>
      <View style={inline ? styles.inline : styles.text}>
        <Text style={[type.body, inline && styles.inlineLabel, { color: palette.textPrimary }]}>
          {label}
        </Text>
        {value !== undefined && (
          <Text
            numberOfLines={inline ? 1 : undefined}
            style={[type.caption, inline && styles.inlineValue, { color: palette.textTertiary }]}
          >
            {value}
          </Text>
        )}
      </View>
      {onPress !== undefined && (
        <View importantForAccessibility="no" accessibilityElementsHidden>
          <Icon name="chev" size={16} color={palette.textTertiary} />
        </View>
      )}
    </>
  );
  if (onPress === undefined) {
    return (
      <View accessible style={[styles.row, line]}>
        {body}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value !== undefined ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, line, { opacity: pressed ? 0.6 : 1 }]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: { flex: 1, gap: space.xs },
  inline: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md },
  inlineLabel: { flex: 1 },
  inlineValue: { maxWidth: '55%', textAlign: 'right' },
});
