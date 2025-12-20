// hooks/useToggle.ts
import { useState } from 'react';

/**
 * Hook untuk mengelola state boolean toggle.
 * @param initialValue - Nilai awal (default: false).
 * @returns - Array berisi [value, toggle, setValue].
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  
  return [value, toggle, setValue] as const;
};