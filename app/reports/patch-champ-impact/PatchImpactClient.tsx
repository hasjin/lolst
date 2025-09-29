'use client';

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {Trans, useI18n} from '@/components/i18n';
import type { PatchChampImpactRow } from '@/lib/types/reports';

type L10n = { ko: string; en: string };
type TrendPt = { patch: string; games: number; wins: number; winRate: number; pickRate: number };

type Props = {
    patch: string;
    queue: number;
    rows: PatchChampImpactRow[];
    /** Accept readonly tuples/arrays from callers (e.g., from `as const`/Map.entries) */
    champMap: ReadonlyArray<readonly [number, Readonly<L10n>]>;
};

// 큐 라벨
const Q: Record<number, L10n> = {
    420: { ko: '솔로/듀오 랭크', en: 'Ranked Solo/Duo' },
    430: { ko: '일반 (비랭크)',   en: 'Normal (Blind/Draft)' },
    440: { ko: '자유 랭크',       en: 'Ranked Flex' },
    450: { ko: '칼바람나락',       en: 'ARAM' },
};
const queueLabel = (q: number, lang: 'ko' | 'en') =>
    (Q[q] ?? { ko: `큐 ${q}`, en: `Queue ${q}` })[lang];

// 작은 선형 차트 (SVG)
function Sparkline({ data, h = 120, w = 360, color = '#7dd3fc' }:{data:number[];h?:number;w?:number;color?:string}) {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = Math.max(max - min, 1e-9);
    const step = data.length > 1 ? w / (data.length - 1) : w;
    const pts = data.map((v, i) => `${i * step},${h - ((v - min) / span) * h}`);
    const last = data[data.length - 1];

    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{display:'block'}}>
            <polyline fill="none" stroke={color} strokeWidth={2} points={pts.join(' ')} vectorEffect="non-scaling-stroke"/>
            <circle cx={(data.length - 1) * step} cy={h - ((last - min) / span) * h} r={3} fill={color}/>
        </svg>
    );
}

const pct = (v:number) => `${(v*100).toFixed(2)}%`;
const delta = (v:number) => `${v>0?'+':''}${(v*100).toFixed(2)}%`;

export default function PatchImpactClient({ patch, queue, rows, champMap }: Props) {
    const { lang } = useI18n(); // 'ko' | 'en'
    const nameMap = useMemo(() => new Map<number, Readonly<L10n>>(champMap), [champMap]);

    // 변동 스코어(절대값 합)
    const sorted = useMemo(() => {
        return [...rows]
            .map(r => ({
                ...r,
                score: Math.abs(r.dWinRate ?? 0) + Math.abs(r.dPickRate ?? 0) + Math.abs(r.dBanRate ?? 0),
            }))
            .sort((a,b) => b.score - a.score);
    }, [rows]);

    const [sel, setSel] = useState(sorted[0]?.championId ?? 0);
    useEffect(() => {
        if (!sorted.some(r => r.championId === sel)) setSel(sorted[0]?.championId ?? 0);
    }, [sorted, sel]);

    const current = sorted.find(r => r.championId === sel);

    // 트렌드
    const [trend, setTrend] = useState<TrendPt[] | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        let alive = true;
        setLoading(true); setTrend(null);
        (async () => {
            try {
                const res = await fetch(
                    `/api/internal/reports/champion-trend?championId=${sel}&queue=${queue}&upto=${encodeURIComponent(patch)}&n=12`,
                    { cache: 'no-store' }
                );
                const data: TrendPt[] = await res.json();
                if (alive) setTrend([...data].reverse()); // 과거→현재
            } catch {
                if (alive) setTrend([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [sel, queue, patch]);

    const champName = (id:number) => (nameMap.get(id) ?? {ko:String(id), en:String(id)})[lang];

    return (
        <div className="twoCol">
            {/* LEFT */}
            <aside className="leftPane">
                <div className="paneHead">
                    <h2><Trans ko="상위 변동" en="Top shifts"/></h2>
                    <div className="sub">{patch}, {queueLabel(queue, lang)}</div>
                </div>
                <ul className="list" role="list">
                    {sorted.map(r => (
                        <li key={r.championId}>
                            <button
                                type="button"
                                className={`rowBtn ${sel===r.championId ? 'is-active' : ''}`}
                                onClick={()=>setSel(r.championId)}
                            >
                                <span className="title">{champName(r.championId)}</span>
                                <span className={`delta ${r.score>=0?'up':'down'}`}>▲ {pct(r.score)}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* RIGHT */}
            <section className="rightPane">
                {current ? (
                    <>
                        <div className="paneHead">
                            <h2>{champName(current.championId)}</h2>
                            <div className="sub">
                                {patch} · {queueLabel(queue, lang)}
                            </div>
                        </div>

                        <div className="statCard" aria-label="current stats">
                            <div className="statTitle"><Trans ko="현재 패치" en="Current patch"/> ({patch})</div>
                            <div className="statGrid">
                                <div><Trans ko="승률" en="Win%"/></div>
                                <div><strong>{pct(current.winRate)}</strong> <small className="up">({delta(current.dWinRate)})</small></div>

                                <div><Trans ko="픽률" en="Pick%"/></div>
                                <div><strong>{pct(current.pickRate)}</strong> <small className="up">({delta(current.dPickRate)})</small></div>

                                <div><Trans ko="밴률" en="Ban%"/></div>
                                <div><strong>{pct(current.banRate)}</strong> <small className="up">({delta(current.dBanRate)})</small></div>
                            </div>
                        </div>

                        <div className="chartWrap">
                            <div className="statTitle"><Trans ko="최근 추이 (패치별)" en="Recent trend (by patch)"/></div>
                            {loading && <div className="empty"><Trans ko="그래프 데이터를 불러오는 중…" en="Loading trend…"/></div>}
                            {!loading && trend && trend.length>0 && (
                                <>
                                    <div className="statTitle"><Trans ko="승률" en="Win rate"/></div>
                                    <Sparkline data={trend.map(t=>t.winRate)} />
                                    <div className="statTitle" style={{marginTop:8}}><Trans ko="픽률" en="Pick rate"/></div>
                                    <Sparkline data={trend.map(t=>t.pickRate)} color="#a78bfa"/>
                                </>
                            )}
                            {!loading && trend && trend.length===0 && <div className="empty"><Trans ko="데이터가 없습니다." en="No data."/></div>}
                        </div>
                    </>
                ) : (
                    <div className="empty"><Trans ko="데이터가 없습니다." en="No data."/></div>
                )}
            </section>
        </div>
    );
}