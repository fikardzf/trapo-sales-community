// lib/useNavigation.ts

'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Lightweight wrapper around Next.js router.
 * Keep navigation calls consistent across the app.
 */
export const useNavigation = () => {
  const router = useRouter();

  return useMemo(
    () => ({
      push: router.push,
      replace: router.replace,
      back: router.back,
      refresh: router.refresh,
      prefetch: router.prefetch,
    }),
    [router]
  );
};
