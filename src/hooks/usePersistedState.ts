
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  sync?: (value: T) => Promise<void>
): [T, Dispatch<SetStateAction<T>>, boolean] {
  // Initialize state with persisted value or initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error retrieving persisted state for key "${key}":`, error);
      return initialValue;
    }
  });

  const [syncing, setSyncing] = useState(false);

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      
      // Sync to backend if provided
      if (sync) {
        setSyncing(true);
        sync(state)
          .catch((error) => {
            console.error(`Error syncing state for key "${key}":`, error);
          })
          .finally(() => {
            setSyncing(false);
          });
      }
    } catch (error) {
      console.error(`Error persisting state for key "${key}":`, error);
    }
  }, [key, state, sync]);

  return [state, setState, syncing];
}

export default usePersistedState;
