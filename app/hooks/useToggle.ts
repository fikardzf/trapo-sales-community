// hooks/useToggle.ts
import { useState } from 'react';

export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  
  return [value, toggle, setValue] as const;
};