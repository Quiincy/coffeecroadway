'use client';

import { useState, useEffect } from 'react';

export function useFormStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }
  }, [key]);

  // Save to local storage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [key, state, mounted]);

  const clearStorage = () => {
    try {
      window.localStorage.removeItem(key);
      setState(initialValue);
    } catch (error) {
      console.warn("Error clearing localStorage", error);
    }
  };

  return [state, setState, clearStorage];
}
