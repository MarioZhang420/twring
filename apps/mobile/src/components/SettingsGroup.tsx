import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { font } from '@/theme/fonts';
import { radius, space, type, usePalette } from '@/theme/tokens';

import { Icon, type IconName } from './Icon';

export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  const palette = usePalette();
  return (
    <View style={styles.group}>
      <Text
        accessibilityRole="header"
        style={[type.microLabel, styles.heading, { color: palette.textTertiary }]}
      >
        {title.toUpperCase()}
      </Text>
      <View style={[styles.card, { borderColor: palette.border }]}>{children}</View>
    </View>
  );
}

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  accessibilityHint?: string;
  divider?: boolean;
  icon?: IconName;
  danger?: boolean;
  mono?: boolean;
  /** `inline` puts a short value on the right; `stacked` puts a sentence under the label. */
  layout?: 'inline' | 'stacked';
}

/** The same accessibility shape as Row, inside the grouped settings card. */
export function SettingsRow({
  label,
  value,
  onPress,
  accessibilityHint,
  divider = true,
  icon,
  danger = false,
  mono = false,
  layout = 'inline',
}: SettingsRowProps) {
  const palette = usePalette();
  const { fontScale } = useWindowDimensions();
  const inline = layout === 'inline' && fontScale <= 1.3;
  const line = {
    borderColor: palette.border,
    borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0,
  };
  const content = (
    <>
      {icon !== undefined && (
        <View style={styles.iconBox} importantForAccessibility="no" accessibilityElementsHidden>
          <Icon name={icon} size={14} color="rgba(255,255,255,0.7)" />
        </View>
      )}
      <View style={inline ? styles.inline : styles.text}>
        <Text
          style={[
            styles.label,
            inline && styles.inlineLabel,
            { color: danger ? palette.danger : palette.textPrimary },
          ]}
        >
          {label}
        </Text>
        {value !== undefined && (
          <Text
            numberOfLines={inline ? 1 : undefined}
            style={[
              styles.value,
              mono && styles.mono,
              inline && styles.inlineValue,
              { color: palette.textTertiary },
            ]}
          >
            {value}
          </Text>
        )}
      </View>
      {onPress !== undefined && (
        <View importantForAccessibility="no" accessibilityElementsHidden>
          <Icon name="chev" size={14} color={palette.textTertiary} />
        </View>
      )}
    </>
  );
  if (onPress === undefined)
    return (
      <View accessible style={[styles.row, line]}>
        {content}
      </View>
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value !== undefined ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, line, { opacity: pressed ? 0.6 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.sm },
  heading: { paddingLeft: space.xs, letterSpacing: 1 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  inline: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md },
  inlineLabel: { flex: 1 },
  inlineValue: { maxWidth: '55%', textAlign: 'right' },
  label: { fontFamily: font.body, fontSize: type.body.fontSize },
  value: { fontFamily: font.caption, fontSize: type.caption.fontSize, lineHeight: 17 },
  mono: { fontFamily: font.mono },
});
