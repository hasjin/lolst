// app/api/secured/reports/champion-trend/route.ts
import { NextRequest } from 'next/server';
import { signedGet } from '@/lib/server/signedFetch';

export async function GET(req: NextRequest) {
    const u = new URL(req.url);
    const championId = u.searchParams.get('championId');
    const queue = u.searchParams.get('queue');
    const upto = u.searchParams.get('upto');
    const limit = u.searchParams.get('limit') ?? '12';

    if (!championId || !queue || !upto) {
        return new Response(JSON.stringify({ message: 'missing query' }), { status: 400 });
    }

    const path = `/api/reports/champion-trend?championId=${championId}&queue=${queue}&upto=${encodeURIComponent(
        upto,
    )}&limit=${limit}`;

    const json = await signedGet(path);
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
}