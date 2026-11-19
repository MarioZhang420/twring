import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { Agent } from '@twring/contracts';
import { isAiApp } from '@/agents/ai-app';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { twringApi } from '@/api';
import { startCall } from '@/call/start';
import { Avatar } from '@/components/Avatar';
import { CallButton } from '@/components/CallButton';
import { ErrorNotice } from '@/components/ErrorNotice';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { Waveform } from '@/components/Waveform';
import { useNow } from '@/hooks/useNow';
import { useResource } from '@/hooks/useResource';
import { DAY_GROUPS, groupHistory, historyListRow, historySummary } from '@/ring/history';
import type { HistoryEntry } from '@/ring/protocol';
import { parseCallBack } from '@/ring/missed';
import { markMissedSeen } from '@/ring/missed-seen';
import { space, type, usePalette } from '@/theme/tokens';

/** Call history: calls and missed agent rings, with no transcript kept. */
export default function HistoryScreen() {
  const palette = usePalette();
  const now = useNow();
  const load = useCallback((signal: AbortSignal) => {
    const api = twringApi();
    return api === undefined ? Promise.resolve<HistoryEntry[]>([]) : api.history(signal);
  }, []);
  const history = useResource(load);
  const agents = useResource(
    useCallback((signal: AbortSignal): Promise<Agent[]> => {
      const api = twringApi();
      return api ? api.listAgents(signal) : Promise.resolve([]);
    }, []),
  );
  const avatarVersion = (agentId: string) =>
    agents.data?.find((agent) => agent.id === agentId)?.avatar_version;
  const params = useLocalSearchParams<{ call_back?: string; name?: string }>();

  // Seeing Recents sees every missed call: Chats drops them and their notifications go.
  useFocusEffect(
    useCallback(() => {
      void markMissedSeen();
    }, []),
  );

  // "Call back" on a missed-call notification: call that agent once, then forget the link.
  const callBack = parseCallBack(params);
  const callBackId = callBack?.agentId;
  const callBackName = callBack?.name;
  useEffect(() => {
    // Wait for the agents to tell an AI app (opens its chat) from a callable agent; if they
    // can't load, call as before.
    if (callBackId === undefined || (!agents.data && !agents.error)) return;
    router.setParams({ call_back: undefined, name: undefined });
    if (isAiApp(agents.data?.find((agent) => agent.id === callBackId)))
      router.push({ pathname: '/chats/[agentId]', params: { agentId: callBackId } });
    else
      startCall({ agentId: callBackId, ...(callBackName !== undefined && { name: callBackName }) });
  }, [callBackId, callBackName, agents.data, agents.error]);

  const groups = groupHistory(history.data ?? [], now);
  const summary = historySummary(history.data ?? []);
  return (
    <Screen
      brand
      title="Recents"
      refreshing={history.refreshing}
      onRefresh={() => history.reload({ refresh: true })}
    >
      {summary !== undefined && (
        <Text style={[type.caption, styles.summary, { color: palette.textTertiary }]}>
          {summary}
        </Text>
      )}
      {history.loading && (
        <View accessible accessibilityLabel="Loading call history" style={styles.loading}>
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} height={72} />
          ))}
        </View>
      )}
      {history.error !== undefined && (
        <ErrorNotice error={history.error} onRetry={() => history.reload()} />
      )}
      {history.data?.length === 0 && (
        <View style={styles.empty}>
          <Waveform
            width={280}
            height={80}
            color={palette.accent}
            intensity={0.18}
            animated={false}
          />
          <Text style={[type.body, styles.emptyText, { color: palette.textSecondary }]}>
            Your completed calls will appear here.
          </Text>
        </View>
      )}
      {DAY_GROUPS.map(
        (group) =>
          groups[group].length > 0 && (
            <View key={group} style={styles.group}>
              <Text style={[type.microLabel, styles.groupLabel, { color: palette.textTertiary }]}>
                {group}
              </Text>
              <View>
                {groups[group].map((item) => {
                  const row = historyListRow(item, now);
                  const avatar = (
                    <Avatar
                      id={item.agent_id}
                      name={row.agentName}
                      avatarVersion={avatarVersion(item.agent_id)}
                      size={44}
                    />
                  );
                  if (row.kind === 'missed') {
                    const matchedAgent = agents.data?.find((agent) => agent.id === row.agentId);
                    const aiApp = matchedAgent ? isAiApp(matchedAgent) : undefined;
                    const reason = item.reason?.trim();
                    return (
                      <ListRow
                        key={row.key}
                        avatar={avatar}
                        title={row.agentName}
                        line={`Missed · ${row.when}`}
                        lineTone="danger"
                        {...(reason ? { line2: reason } : {})}
                        accessibilityLabel={row.accessibilityLabel}
                        right={
                          aiApp === true ? (
                            <IconButton
                              icon="chat"
                              size={40}
                              accessibilityLabel={`Open chat with ${row.agentName}`}
                              onPress={() =>
                                router.push({
                                  pathname: '/chats/[agentId]',
                                  params: { agentId: row.agentId },
                                })
                              }
                            />
                          ) : aiApp === false ? (
                            <CallButton
                              name={row.agentName}
                              onPress={() =>
                                startCall({ agentId: row.agentId, name: row.agentName })
                              }
                            />
                          ) : undefined
                        }
                      />
                    );
                  }
                  return (
                    <ListRow
                      key={row.key}
                      avatar={avatar}
                      title={row.agentName}
                      line={`${row.outcome} · ${row.when} · ${row.duration}`}
                      lineTone={row.failed ? 'danger' : 'secondary'}
                      accessibilityLabel={row.accessibilityLabel}
                    />
                  );
                })}
              </View>
            </View>
          ),
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { fontVariant: ['tabular-nums'] },
  loading: { gap: space.xs },
  empty: { alignItems: 'center', gap: space.lg, paddingTop: 72 },
  emptyText: { textAlign: 'center' },
  group: { gap: space.xs },
  groupLabel: { paddingLeft: space.xs, letterSpacing: 1 },
});
