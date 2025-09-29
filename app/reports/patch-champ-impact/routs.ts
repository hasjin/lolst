import { NextRequest } from 'next/server';
import { signedGet } from '@/lib/server/signedFetch';
import type { PatchChampImpactRow } from '@/lib/types/reports';

export async function GET(req: NextRequest) {
    const { search } = new URL(req.url);
    const path = `/api/reports/patch-champ-impact${search}`;
    const data = await signedGet<PatchChampImpactRow[]>(path);
    return Response.json(data, {
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
}