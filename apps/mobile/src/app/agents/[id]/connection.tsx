import type { Agent } from '@twring/contracts';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { protocolLabel } from '@/agents/labels';
import { canEditAgent } from '@/agents/shared';
import { twringApi } from '@/api';
import { ErrorNotice } from '@/components/ErrorNotice';
import { Row } from '@/components/Row';
import { Screen } from '@/components/Screen';
import { useResource } from '@/hooks/useResource';
import { radius, usePalette, type Palette } from '@/theme/tokens';

/** Connection details: how Twring reaches this agent, and the way to change it. */
export default function ConnectionDetailsScreen() {
  const palette = usePalette();
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : '';
  const load = useCallback(
    async (signal: AbortSignal): Promise<Agent> => {
      const api = twringApi();
      if (api === undefined) throw new Error('not configured');
      return api.getAgent(id, signal);
    },
    [id],
  );
  const data = useResource(load);
  const agent = data.data;

  return (
    <Screen back title="Connection details">
      {data.error !== undefined && <ErrorNotice error={data.error} onRetry={() => data.reload()} />}
      {agent === undefined
        ? data.error === undefined && (
            <ActivityIndicator accessibilityLabel="Loading" color={palette.textSecondary} />
          )
        : connectionRows(agent, palette)}
    </Screen>
  );
}

function connectionRows(agent: Agent, palette: Palette) {
  const editable = canEditAgent(agent);
  const showAddress =
    editable && agent.protocol !== 'mcp-app' && agent.protocol !== 'cord-connector';
  const showModel = agent.protocol === 'openai-chat' && !!agent.model;
  const showKey = editable && agent.protocol !== 'mcp-app';
  const showEdit = editable && agent.protocol !== 'mcp-app';
  return (
    <View style={[styles.group, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Row
        label="Connection method"
        value={protocolLabel(agent.protocol)}
        divider={showAddress || showModel || showKey || showEdit}
      />
      {showAddress && (
        <Row
          label="Address"
          value={agent.endpoint_url}
          layout="stacked"
          divider={showModel || showKey || showEdit}
        />
      )}
      {showModel && <Row label="Model" value={agent.model} divider={showKey || showEdit} />}
      {showKey && (
        <Row
          label="Key"
          value={agent.has_credential ? 'Saved (hidden)' : 'None'}
          divider={showEdit}
        />
      )}
      {showEdit && (
        <Row
          label="Edit connection"
          accessibilityHint="Change the address or key, then test again"
          onPress={() => router.push({ pathname: '/connect', params: { agentId: agent.id } })}
          divider={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
});
