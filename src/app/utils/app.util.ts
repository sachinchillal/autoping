import { DATA_STALE_MS } from "./constants";

export function isDataStale(key: string): boolean {
  const fetchedAtStr = localStorage.getItem(key);
  const fetchedAt = fetchedAtStr ? Number(fetchedAtStr) : 0;
  const isStale = !fetchedAt || Date.now() - fetchedAt > DATA_STALE_MS;
  return isStale;
}