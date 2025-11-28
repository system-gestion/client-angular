import Dexie, { Table } from 'dexie';

export interface RequestCache {
  url: string;
  response: any;
  timestamp: number;
}

export interface RequestQueue {
  id?: number;
  url: string;
  method: string;
  body: any;
  timestamp: number;
  status?: 'pending' | 'success' | 'error'; // New field
}

export class OfflineDB extends Dexie {
  requestCache!: Table<RequestCache, string>;
  requestQueue!: Table<RequestQueue, number>;

  constructor() {
    super('OfflineDB');
    this.version(1).stores({
      requestCache: 'url',
      requestQueue: '++id',
    });
  }
}

export const db = new OfflineDB();
