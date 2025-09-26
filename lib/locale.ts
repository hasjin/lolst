import { headers } from 'next/headers';
export type Locale = 'ko' | 'en';
export async function detectLocaleServer(): Promise<Locale> {
    const al = (await headers()).get('accept-language')?.toLowerCase() ?? '';
    const m = al.match(/\b(en|ko)\b/);
    return (m?.[0] as Locale) ?? 'ko';
}