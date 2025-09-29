// app/api/internal/champions/route.ts
import { NextResponse } from 'next/server';
import { signedGet } from '@/lib/server/signedFetch';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString(); // lang=en|ko
    const data = await signedGet(`/api/champions${qs ? `?${qs}` : ''}`);
    return NextResponse.json(data, { headers: { 'cache-control': 'no-store' } });
}