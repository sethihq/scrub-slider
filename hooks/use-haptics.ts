"use client";

import { useWebHaptics } from "web-haptics/react";

// Re-export with the same API so existing consumers don't break
export function useHaptics() {
  const { trigger, cancel, isSupported } = useWebHaptics({ debug: false });
  return { trigger, cancel, isSupported };
}
