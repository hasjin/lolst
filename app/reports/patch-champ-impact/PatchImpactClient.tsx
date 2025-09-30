'use client';

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {Trans, useI18n} from '@/components/i18n';
import type { PatchChampImpactRow } from '@/lib/types/reports';

function toInitials(s: string): string {
    const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    let out = '';
    for (const ch of s) {
        const code = ch.codePointAt(0)!;
        if (code >= 0xac00 && code <= 0xd7a3) {
            const idx = Math.floor((code - 0xac00) / (21 * 28));
            out += CHO[idx] ?? ch;
        } else {
            out += ch;
        }
    }
    return out;
}
const norm = (s: string) => s.normalize('NFKD').toLowerCase();

type L10n = { ko: string; en: string };
type TrendPt = { patch: string; games: number; wins: number; winRate: number; pickRate: number };

type Props = {
    patch: string;
    queue: number;
    rows: PatchChampImpactRow[];
    champMap: ReadonlyArray<readonly [number, Readonly<L10n>]>;
};

type RowWithScore = PatchChampImpactRow & { score: number };

const Q: Record<number, L10n> = {
    420: { ko: '솔로/듀오 랭크', en: 'Ranked Solo/Duo' },
    430: { ko: '일반 (비랭크)',   en: 'Normal (Blind/Draft)' },
    440: { ko: '자유 랭크',       en: 'Ranked Flex' },
    450: { ko: '칼바람나락',       en: 'ARAM' },
};
const queueLabel = (q: number, lang: 'ko' | 'en') =>
    (Q[q] ?? { ko: `큐 ${q}`, en: `Queue ${q}` })[lang];

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
    const { lang } = useI18n();

    const [query, setQuery] = useState('');

    const nameMap = useMemo(() => new Map<number, Readonly<L10n>>(champMap), [champMap]);

    const rowsById = useMemo(() => new Map(rows.map(r => [r.championId, r])), [rows]);

    const sorted = useMemo(() => {
      const ids = champMap.map(([id]) => id);
      const full: RowWithScore[] = ids.map((id) => {
        const base = rowsById.get(id) ?? ({
          championId: id,
          winRate: 0,
          pickRate: 0,
          banRate: 0,
          dWinRate: 0,
          dPickRate: 0,
          dBanRate: 0,
        } as PatchChampImpactRow);
        const score = Math.abs(base.dWinRate ?? 0) + Math.abs(base.dPickRate ?? 0) + Math.abs(base.dBanRate ?? 0);
        return { ...(base as PatchChampImpactRow), score } as RowWithScore;
      });
      return full.sort((a, b) => b.score - a.score);
    }, [champMap, rowsById]);

    const [sel, setSel] = useState(sorted[0]?.championId ?? 0);
    useEffect(() => {
        if (!sorted.some(r => r.championId === sel)) setSel(sorted[0]?.championId ?? 0);
    }, [sorted, sel]);

    const current = sorted.find(r => r.championId === sel);

    const filtered = useMemo(() => {
        const q = norm(query.trim());
        if (!q) return sorted;

        const qInit = toInitials(q);
        return sorted.filter(r => {
            const nm = nameMap.get(r.championId);
            if (!nm) return false;

            const ko = norm(nm.ko || '');
            const en = norm(nm.en || '');
            const koInit = norm(toInitials(nm.ko || ''));

            return (
                ko.includes(q) || en.includes(q) || (qInit && koInit.includes(qInit))
            );
        });
    }, [sorted, query, nameMap]);

    useEffect(() => {
        if (filtered.length && !filtered.some(r => r.championId === sel)) {
            setSel(filtered[0].championId);
        }
    }, [filtered, sel]);

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
            <aside className="leftPane">
                <div style={{marginBottom: 10}}>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                        placeholder="챔피언 검색 (예: ㅇㄹㄹ / ahri)"
                        aria-label="filter champions"
                        className="filterInput"
                    />
                </div>
                <div className="paneHead">
                    <h2><Trans ko="상위 변동" en="Top shifts"/></h2>
                    <div className="sub">{patch}, {queueLabel(queue, lang)}</div>
                </div>
                {filtered.length === 0 ? (
                    <div className="empty"><Trans ko="검색 결과가 없습니다." en="No matches."/></div>
                ) : (
                <ul className="list" role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filtered.map(r => (
                        <li key={r.championId}>
                            <button
                                type="button"
                                className={`rowBtn ${sel===r.championId ? 'is-active' : ''}`}
                                onClick={()=>setSel(r.championId)}
                            >
                                <span className="title">{champName(r.championId)}</span>
                                <span className="delta up">▲ {((r.score)*100).toFixed(2)}%</span>
                            </button>
                        </li>
                    ))}
                </ul>
                )}
            </aside>

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
                                <div>
                                  <strong>{pct(current.winRate)}</strong>
                                  <small className={(current.dWinRate ?? 0) >= 0 ? 'up' : 'down'}>({delta(current.dWinRate ?? 0)})</small>
                                  <small style={{marginLeft:6, opacity:.8}}>prev {pct((current.winRate ?? 0) - (current.dWinRate ?? 0))}</small>
                                </div>

                                <div><Trans ko="픽률" en="Pick%"/></div>
                                <div>
                                  <strong>{pct(current.pickRate)}</strong>
                                  <small className={(current.dPickRate ?? 0) >= 0 ? 'up' : 'down'}>({delta(current.dPickRate ?? 0)})</small>
                                  <small style={{marginLeft:6, opacity:.8}}>prev {pct((current.pickRate ?? 0) - (current.dPickRate ?? 0))}</small>
                                </div>

                                <div><Trans ko="밴률" en="Ban%"/></div>
                                <div>
                                  <strong>{pct(current.banRate)}</strong>
                                  <small className={(current.dBanRate ?? 0) >= 0 ? 'up' : 'down'}>({delta(current.dBanRate ?? 0)})</small>
                                  <small style={{marginLeft:6, opacity:.8}}>prev {pct((current.banRate ?? 0) - (current.dBanRate ?? 0))}</small>
                                </div>
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