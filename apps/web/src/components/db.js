import Dexie from 'dexie';

export const db = new Dexie('SahiDawaDB');
db.version(1).stores({
  scans: '++id, batchNumber, timestamp'
});
