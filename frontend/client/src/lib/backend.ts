import type { BackendDataPayload } from '@/lib/store';

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
export const BACKEND_URL = rawBackendUrl.replace(/\/$/, '');

export async function fetchBackendData(): Promise<BackendDataPayload> {
  const response = await fetch(`${BACKEND_URL}/data`);
  if (!response.ok) {
    throw new Error(`Failed to fetch /data (${response.status})`);
  }
  return (await response.json()) as BackendDataPayload;
}

export async function setManualPrice(zoneName: string, price: number): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/set_price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zone_name: zoneName, price }),
  });
  if (!response.ok) {
    throw new Error(`Failed to set manual price (${response.status})`);
  }
}

export async function setAutoPrice(zoneName: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/set_auto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zone_name: zoneName }),
  });
  if (!response.ok) {
    throw new Error(`Failed to set auto price (${response.status})`);
  }
}

export function getVideoFeedUrl(): string {
  return `${BACKEND_URL}/video_feed`;
}
