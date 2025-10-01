/**
 * 밴픽 분석 리포트 - 서버 컴포넌트
 *
 * 역할:
 * - URL 쿼리 파라미터에서 필터 조건 읽기 (patch, queue, region, tier, role)
 * - 백엔드 API 호출하여 밴픽 데이터 가져오기
 * - 챔피언 목록 가져오기
 * - 데이터를 클라이언트 컴포넌트로 전달
 *
 * API 엔드포인트:
 * - /api/reports/ban-pick-analysis?patch=15.19&queue=420&region=kr&tier=platinum&role=TOP
 */

import { signedGet } from '@/lib/server/signedFetch';
import type { BanPickAnalysisRow } from '@/lib/types/reports';
import BanPickClient from './BanPickClient';

type ChampRow = { id: number; en: string; ko: string; key: string | null };
type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};

    // URL 쿼리 파라미터 파싱
    const patch = typeof sp.patch === 'string' ? sp.patch : '15.19';
    const queue = sp.queue ? Number(Array.isArray(sp.queue) ? sp.queue[0] : sp.queue) : 420;
    const region = typeof sp.region === 'string' ? sp.region : 'kr';
    const tier = typeof sp.tier === 'string' ? sp.tier : 'all';
    const role = typeof sp.role === 'string' ? sp.role : 'all';

    // API 호출 (정확한 엔드포인트 사용)
    const [rows, champs] = await Promise.all([
        signedGet<BanPickAnalysisRow[]>(
            `/api/reports/ban-pick?patch=${encodeURIComponent(patch)}&queue=${queue}&region=${encodeURIComponent(region)}&tier=${encodeURIComponent(tier)}&role=${encodeURIComponent(role)}&sortBy=pickRate&sortOrder=desc&limit=200`
        ),
        signedGet<ChampRow[]>(`/api/champions`),
    ]);

    const champMap = champs.map((c: ChampRow) => [c.id, { ko: c.ko, en: c.en, key: c.key }] as const);

    return (
        <BanPickClient
            patch={patch}
            queue={queue}
            region={region}
            tier={tier}
            role={role}
            rows={rows}
            champMap={champMap}
        />
    );
}
