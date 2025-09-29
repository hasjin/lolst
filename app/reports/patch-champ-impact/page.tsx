// app/reports/patch-champ-impact/page.tsx
import { signedGet } from '@/lib/server/signedFetch';
import type { PatchChampImpactRow } from '@/lib/types/reports';
import PatchImpactClient from './PatchImpactClient';

type ChampRow = { id: number; en: string; ko: string; key?: string | null };
type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};
    const patch = typeof sp.patch === 'string' ? sp.patch : '15.19';
    const queue = sp.queue ? Number(Array.isArray(sp.queue) ? sp.queue[0] : sp.queue) : 420;

    const [rows, champs] = await Promise.all([
        signedGet<PatchChampImpactRow[]>(`/api/reports/patch-champ-impact?patch=${encodeURIComponent(patch)}&queue=${queue}`),
        signedGet<ChampRow[]>(`/api/champions`),
    ]);

    const champMap = champs.map((c) => [c.id, { ko: c.ko, en: c.en }] as const);

    return <PatchImpactClient patch={patch} queue={queue} rows={rows} champMap={champMap} />;
}