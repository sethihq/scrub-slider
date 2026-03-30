"use client";

import { useWebHaptics } from "web-haptics/react";
import type { HapticInput, TriggerOptions } from "web-haptics";

// Re-export with the same API so existing consumers don't break
export function useHaptics(): {
  trigger: (input?: HapticInput, options?: TriggerOptions) => Promise<void> | undefined;
  cancel: () => void | undefined;
  isSupported: boolean;
} {
  const { trigger, cancel, isSupported } = useWebHaptics({ debug: false });
  return { trigger, cancel, isSupported };
}
