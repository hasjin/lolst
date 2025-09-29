// app/api/internal/reports/patch-champ-impact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signedGet } from '@/lib/server/signedFetch';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const u = new URL(req.url);
    const patch = u.searchParams.get('patch') ?? '';
    const queue = u.searchParams.get('queue') ?? '';
    const data = await signedGet(
        `/api/reports/patch-champ-impact?patch=${encodeURIComponent(patch)}&queue=${encodeURIComponent(queue)}`
    );
    return NextResponse.json(data, { headers: { 'cache-control': 'no-store' } });
}