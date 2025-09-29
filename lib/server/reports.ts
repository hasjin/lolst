// lib/server/reports.ts
import { signedGet } from './signedFetch';
import type { PatchChampImpactRow } from '@/lib/types/reports';

export async function getPatchChampImpact(patch: string, queue?: number) {
  const sp = new URLSearchParams();
  sp.set('patch', patch);
  if (queue != null) sp.set('queue', String(queue));

  const path = `/api/reports/patch-champ-impact?${sp.toString()}`;
  return signedGet<PatchChampImpactRow[]>(path);
}