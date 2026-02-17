import { create } from 'zustand';

export interface BackendZonePayload {
  count: number;
  price: number;
  energy: string;
  status: string;
  manual: boolean;
}

export interface BackendDataPayload {
  zones: Record<string, BackendZonePayload>;
  total_count: number;
  global_status: string;
}

export interface ZoneViewModel {
  id: string;
  name: string;
  count: number;
  price: number;
  energy: string;
  status: string;
  manual: boolean;
}

interface StadiumStore {
  zones: ZoneViewModel[];
  totalCount: number;
  globalStatus: string;
  isConnected: boolean;
  lastUpdated: string | null;
  error: string | null;
  setBackendData: (data: BackendDataPayload) => void;
  setConnectionError: (message: string) => void;
  setZoneManualPriceLocal: (zoneName: string, price: number) => void;
  setZoneAutoLocal: (zoneName: string) => void;
}

export const useStadiumStore = create<StadiumStore>((set) => ({
  zones: [],
  totalCount: 0,
  globalStatus: 'UNKNOWN',
  isConnected: false,
  lastUpdated: null,
  error: null,
  setBackendData: (data) =>
    set({
      zones: Object.entries(data.zones).map(([name, zone], index) => ({
        id: `z${index + 1}`,
        name,
        count: zone.count,
        price: zone.price,
        energy: zone.energy,
        status: zone.status,
        manual: zone.manual,
      })),
      totalCount: data.total_count,
      globalStatus: data.global_status,
      isConnected: true,
      lastUpdated: new Date().toISOString(),
      error: null,
    }),
  setConnectionError: (message) =>
    set({
      isConnected: false,
      error: message,
    }),
  setZoneManualPriceLocal: (zoneName, price) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.name === zoneName ? { ...zone, price, manual: true } : zone,
      ),
    })),
  setZoneAutoLocal: (zoneName) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.name === zoneName ? { ...zone, manual: false } : zone,
      ),
    })),
}));
