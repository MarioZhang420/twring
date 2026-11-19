import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOnCall } from '@/call/on-call';
import { type, usePalette } from '@/theme/tokens';

import { TwringLockup } from './Brand';
import { IconButton } from './IconButton';
import { OnCallChip } from './OnCallChip';

interface Props {
  title?: string;
  /** Shows a Back control; `true` leaves the screen, a function replaces that. */
  back?: boolean | (() => void);
  /** Extra controls on the right of the header. */
  headerRight?: ReactNode;
  headerLeft?: ReactNode;
  /** With `title`: one header row, the title on the left and the Twring lockup on the right. */
  brand?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Pinned below the scrolling content: the screen's primary action. */
  footer?: ReactNode;
  children: ReactNode;
}

export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** Safe-area page with a calm header, content that scrolls as text grows, and a pinned footer. */
export function Screen({
  title,
  back,
  headerRight,
  headerLeft,
  brand = false,
  refreshing,
  onRefresh,
  footer,
  children,
}: Props) {
  const palette = usePalette();
  const onBack = typeof back === 'function' ? back : goBack;
  const onCall = useOnCall();
  const chip = onCall.active ? <OnCallChip startedAt={onCall.connectedAt} /> : undefined;
  const branded = brand && title !== undefined;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      {branded ? (
        <View style={styles.brandHeader}>
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[type.screenTitle, styles.brandTitle, { color: palette.textPrimary }]}
          >
            {title}
          </Text>
          {chip ?? headerRight ?? <TwringLockup size={18} glow={false} />}
        </View>
      ) : onCall.active ||
        (back !== undefined && back !== false) ||
        headerLeft !== undefined ||
        headerRight !== undefined ? (
        <View style={styles.header}>
          <View style={styles.headerSlot}>
            {headerLeft ??
              (back !== undefined && back !== false ? (
                <IconButton icon="back" accessibilityLabel="Back" onPress={onBack} />
              ) : null)}
          </View>
          <View style={styles.headerCenter} />
          <View style={styles.headerSlot}>{chip ?? headerRight}</View>
        </View>
      ) : null}
      {/*
        Edge-to-edge Android (SDK 57) no longer resizes the window for the keyboard, so both
        platforms pad by the keyboard height; the footer's primary action stays above it.
      */}
      <KeyboardAvoidingView behavior="padding" style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {title !== undefined && !branded && (
            <Text
              accessibilityRole="header"
              style={[type.screenTitle, { color: palette.textPrimary }]}
            >
              {title}
            </Text>
          )}
          {children}
        </ScrollView>
        {footer !== undefined && <View style={styles.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 12,
  },
  // Grows for wider controls (the connect steps' progress); empty slots keep the title centred.
  brandHeader: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
  },
  brandTitle: { flex: 1 },
  headerSlot: { minWidth: 36, alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  content: { paddingHorizontal: 22, paddingVertical: 16, gap: 18 },
  footer: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
});
