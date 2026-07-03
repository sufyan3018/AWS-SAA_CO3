import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 * Use this to gate any UI that depends on localStorage/theme so the
 * server-rendered markup and first client render always match.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
