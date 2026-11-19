import { usePathname } from 'expo-router';

import { shouldShowCallBar } from './call-bar';
import { useCallView } from './session';

export interface OnCall {
  active: boolean;
  connectedAt?: number;
}

/** Whether this screen should offer a way back to a live call (not on the call screen itself). */
export function useOnCall(): OnCall {
  const pathname = usePathname();
  const view = useCallView();
  if (!shouldShowCallBar(pathname, view.call)) return { active: false };
  return { active: true, connectedAt: view.connectedAt };
}
