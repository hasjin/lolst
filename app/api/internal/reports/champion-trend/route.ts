// app/api/internal/reports/champion-trend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signedGet } from '@/lib/server/signedFetch';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString();
    const data = await signedGet(`/api/champion-trend?${qs}`);
    return NextResponse.json(data, { headers: { 'cache-control': 'no-store' } });
}