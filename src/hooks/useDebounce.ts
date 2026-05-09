/**
 * useDebounce — delays updating a value until the user stops changing it.
 *
 * Used for search inputs so we don't fire a query on every keystroke.
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
