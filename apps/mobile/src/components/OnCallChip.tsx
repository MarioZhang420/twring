import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { StatusDot } from '@/components/StatusDot';
import { useNow } from '@/hooks/useNow';
import { radius, space, type, usePalette } from '@/theme/tokens';

export function callClock(startedAt: number | undefined, now: number): string {
  const seconds = startedAt ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Sits in a header's right slot while a call is live; tapping it returns to the call. */
export function OnCallChip({ startedAt }: { startedAt?: number }) {
  const palette = usePalette();
  const now = useNow(1000);
  const clock = callClock(startedAt, now.getTime());
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Return to call, ${clock}`}
      onPress={() => router.push('/call')}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: palette.accentTintStrong, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <StatusDot color={palette.accent} pulse />
      <Text numberOfLines={1} style={[type.caption, { color: palette.accent }]}>
        On a call · {clock}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
});
