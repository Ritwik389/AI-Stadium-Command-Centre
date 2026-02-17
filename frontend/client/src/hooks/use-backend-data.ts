import { useEffect } from 'react';
import { fetchBackendData } from '@/lib/backend';
import { useStadiumStore } from '@/lib/store';

const POLL_INTERVAL_MS = 2000;

export function useBackendData(): void {
  const { setBackendData, setConnectionError } = useStadiumStore();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await fetchBackendData();
        if (!isMounted) {
          return;
        }
        setBackendData(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        const message = error instanceof Error ? error.message : 'Backend unavailable';
        setConnectionError(message);
      }
    };

    load();
    const intervalId = window.setInterval(load, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [setBackendData, setConnectionError]);
}
