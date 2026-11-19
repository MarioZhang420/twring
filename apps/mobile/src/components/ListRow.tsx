import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
} from 'react-native';

import { font } from '@/theme/fonts';
import { radius, space, type, usePalette } from '@/theme/tokens';

interface Props {
  avatar: ReactNode;
  title: string;
  titleTone?: 'primary' | 'secondary';
  meta?: string;
  metaTone?: 'tertiary' | 'accent';
  line?: string;
  lineTone?: 'secondary' | 'accent' | 'danger' | 'working';
  line2?: string;
  badge?: number;
  /** A 48 px control column; always reserved so every row's columns line up. */
  right?: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityActions?: readonly AccessibilityActionInfo[];
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
  accessibilityLabel: string;
}

/** The one list row: avatar, title and time, a status line, and a fixed right column. */
export function ListRow({
  avatar,
  title,
  titleTone = 'primary',
  meta,
  metaTone = 'tertiary',
  line,
  lineTone = 'secondary',
  line2,
  badge,
  right,
  onPress,
  onLongPress,
  accessibilityActions,
  onAccessibilityAction,
  accessibilityLabel,
}: Props) {
  const palette = usePalette();
  const lineColor = {
    secondary: palette.textSecondary,
    accent: palette.accent,
    danger: palette.danger,
    working: palette.accent,
  }[lineTone];
  const showBadge = badge !== undefined && badge > 0;
  const main = (
    <>
      {avatar}
      <View style={styles.text}>
        <View style={styles.line}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: titleTone === 'primary' ? palette.textPrimary : palette.textSecondary },
            ]}
          >
            {title}
          </Text>
          {meta !== undefined && (
            <Text
              numberOfLines={1}
              style={[
                type.caption,
                { color: metaTone === 'accent' ? palette.accent : palette.textTertiary },
              ]}
            >
              {meta}
            </Text>
          )}
        </View>
        {(line !== undefined || showBadge) && (
          <View style={styles.line}>
            <Text
              numberOfLines={1}
              style={[styles.sub, { color: lineColor }, lineTone === 'working' && styles.italic]}
            >
              {line ?? ''}
            </Text>
            {showBadge && (
              <View style={[styles.badge, { backgroundColor: palette.accent }]}>
                <Text style={[styles.badgeText, { color: palette.onAccent }]}>
                  {badge > 99 ? '99+' : String(badge)}
                </Text>
              </View>
            )}
          </View>
        )}
        {line2 !== undefined && (
          <Text numberOfLines={1} style={[type.caption, { color: palette.textTertiary }]}>
            {line2}
          </Text>
        )}
      </View>
    </>
  );
  return (
    <View style={[styles.row, { borderColor: palette.border }]}>
      {onPress !== undefined || onLongPress !== undefined ? (
        <Pressable
          {...(onPress !== undefined && { accessibilityRole: 'button' as const })}
          accessibilityLabel={accessibilityLabel}
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={onAccessibilityAction}
          onPress={onPress}
          onLongPress={onLongPress}
          style={({ pressed }) => [styles.main, { opacity: pressed ? 0.6 : 1 }]}
        >
          {main}
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityLabel={accessibilityLabel}
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={onAccessibilityAction}
          style={styles.main}
        >
          {main}
        </View>
      )}
      <View testID="list-row-right" style={styles.right}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  main: {
    flex: 1,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
  },
  text: { flex: 1, gap: 2 },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  title: { flex: 1, fontFamily: font.bodyEmphasis, fontSize: type.body.fontSize },
  sub: { flex: 1, fontFamily: font.body, fontSize: type.caption.fontSize },
  italic: { fontStyle: 'italic' },
  badge: {
    minWidth: 20,
    minHeight: 20,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: font.bodyEmphasis, fontSize: 11 },
  right: { width: 48, alignItems: 'center', justifyContent: 'center' },
});
