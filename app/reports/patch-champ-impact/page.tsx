// app/reports/patch-champ-impact/page.tsx
import { signedGet } from '@/lib/server/signedFetch';
import type { PatchChampImpactRow } from '@/lib/types/reports';
import PatchImpactClient from './PatchImpactClient';

type ChampRow = { id: number; en: string; ko: string; key: string | null };
type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};

    // URL 쿼리 파라미터 파싱 (모든 필터 지원)
    const patch = typeof sp.patch === 'string' ? sp.patch : '15.19';
    const queue = sp.queue ? Number(Array.isArray(sp.queue) ? sp.queue[0] : sp.queue) : 420;
    const baseline = typeof sp.baseline === 'string' ? sp.baseline : 'prev';
    const region = typeof sp.region === 'string' ? sp.region : undefined;
    const tier = typeof sp.tier === 'string' ? sp.tier : undefined;
    const role = typeof sp.role === 'string' ? sp.role : undefined;

    // API URL 생성
    let apiUrl = `/api/reports/patch-champ-impact?patch=${encodeURIComponent(patch)}&queue=${queue}&baseline=${baseline}`;
    if (region && region !== 'all') apiUrl += `&region=${region}`;
    if (tier && tier !== 'all') apiUrl += `&tier=${tier}`;
    if (role && role !== 'all') apiUrl += `&role=${role}`;

    const [rows, champs] = await Promise.all([
        signedGet<PatchChampImpactRow[]>(apiUrl),
        signedGet<ChampRow[]>(`/api/champions`),
    ]);

    const champMap = champs.map((c: ChampRow) => [c.id, { ko: c.ko, en: c.en, key: c.key }] as const);

    return (
        <PatchImpactClient
            patch={patch}
            queue={queue}
            baseline={baseline}
            region={region}
            tier={tier}
            role={role}
            rows={rows}
            champMap={champMap}
        />
    );
}