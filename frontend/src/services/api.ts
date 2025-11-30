import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const errorMessage = error.response.data.message || error.response.data.error || 'An error occurred';
      throw new Error(errorMessage);
    }
    throw error;
  }
);

export enum CoilStatus {
  NP = 'NP',
  RTS = 'RTS',
  SCRAP = 'scrap'
}

export interface Coil {
  id: number;
  coilId: string;
  location: string;
  width: number;
  weight: number;
  orderNumber?: string;
  status: CoilStatus;
  isReadyFromCurrentLocation: boolean;
  load?: Load;
  createdAt: string;
  updatedAt: string;
}

export interface Load {
  id: number;
  loadId: string;
  orderNumber: string;
  timeToShip?: string;
  truckTime?: string;
  shipDate?: string;
  clientName?: string;
  status: 'Ready' | 'Missing' | 'Shipped';
  coils: Coil[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: number;
  locationCode: string;
  capacity: number;
  occupied: number;
  freeSpace: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationMapCoil {
  coilId: string;
  status: string;
}

export interface LocationMapCell {
  locationCode: string;
  coils: LocationMapCoil[];
  coilCount: number;
  row: number;
  col: number;
}

export interface LocationMap {
  cells: LocationMapCell[][];
  specialAreas: {
    row126: LocationMapCell;
    s3: LocationMapCell;
    truckReserving: LocationMapCell;
    s3os: LocationMapCell;
  };
}

export interface Stats {
  totalCoils: number;
  totalLoads: number;
  readyLoads: number;
  missingLoads: number;
  shippedLoads: number;
  readyCoils: number;
  missingCoils: number;
  locationStats: Array<{
    locationCode: string;
    capacity: number;
    occupied: number;
    freeSpace: number;
    coilCount: number;
  }>;
  coilsByLocation: Record<string, number>;
}

// Coils API
export const getCoils = () => api.get<Coil[]>('/coils');
export const getCoil = (id: number) => api.get<Coil>(`/coils/${id}`);
export const createCoil = (data: Partial<Coil>) => api.post<Coil>('/coils', data);
export const updateCoil = (id: number, data: Partial<Coil>) => api.put<Coil>(`/coils/${id}`, data);
export const deleteCoil = (id: number) => api.delete(`/coils/${id}`);

// Loads API
export const getLoads = () => api.get<Load[]>('/loads');
export const getLoad = (id: number) => api.get<Load>(`/loads/${id}`);
export const getTodayLoads = () => api.get<Load[]>('/loads/today/list');
export const getTomorrowLoads = () => api.get<Load[]>('/loads/tomorrow/list');
export const createLoad = (data: Partial<Load>) => api.post<Load>('/loads', data);
export const updateLoad = (id: number, data: Partial<Load>) => api.put<Load>(`/loads/${id}`, data);
export const updateLoadStatus = (id: number, status: string) => api.put<Load>(`/loads/${id}/status`, { status });
export const deleteLoad = (id: number) => api.delete(`/loads/${id}`);

// Locations API
export const getLocations = () => api.get<Location[]>('/locations');
export const getLocationMap = () => api.get<LocationMap>('/locations/map');
export const updateLocationCapacity = (code: string, capacity: number) =>
  api.put<Location>(`/locations/${code}`, { capacity });

// Stats API
export const getStats = () => api.get<Stats>('/stats/overview');

export default api;
