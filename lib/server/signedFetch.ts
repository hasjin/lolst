// lib/server/signedFetch.ts
import 'server-only';
import { createHash, createHmac, randomBytes } from 'crypto';

const BASE = process.env.REPORTS_API_BASE;
const EDGE_SIGNING_SECRET = process.env.EDGE_SIGNING_SECRET;

if (!EDGE_SIGNING_SECRET) {
    throw new Error('EDGE_SIGNING_SECRET is not set');
}
if (!/^https?:\/\//.test(BASE)) {
    throw new Error('API_BASE must include protocol, e.g. http://localhost:3005');
}

const sha256Hex = (input: Buffer | string) =>
    createHash('sha256').update(input).digest('hex');
const hmac256Hex = (key: string, msg: string) =>
    createHmac('sha256', key).update(msg).digest('hex');

export async function signedGet<T>(pathWithQuery: string): Promise<T> {
    const ts = Date.now().toString();
    const nonce = randomBytes(8).toString('hex');
    const bodyHash = sha256Hex(Buffer.alloc(0));

    const canonical = ['GET', pathWithQuery, ts, nonce, bodyHash].join('\n');
    const sig = hmac256Hex(EDGE_SIGNING_SECRET!, canonical);

    const res = await fetch(`${BASE}${pathWithQuery}`, {
        headers: {
            'x-sig-ts': ts,
            'x-sig-nonce': nonce,
            'x-sig-hmac': sig,
        },
        cache: 'no-store',
    });
    if (!res.ok) {
        console.error('API Error:', await res.text());
        throw new Error(`Upstream ${res.status}`);
    }
    return (await res.json()) as T;
}