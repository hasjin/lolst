'use client';

import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {Trans, useI18n} from '@/components/i18n';
import type { PatchChampImpactRow } from '@/lib/types/reports';


const TREND_POINTS = 30;

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

function Sparkline({
                       data,
                       labels,
                       h = 180,
                       stroke = '#7dd3fc',
                   }: {
    data: number[];
    labels: string[];
    h?: number;
    stroke?: string;
}) {
    if (!data.length) return null;

    const padL = 42;
    const padR = 10;
    const padT = 12;
    const padB = 28; // x축 라벨 공간

    const n = data.length;
    const wCore = Math.max(360, (n - 1) * 70);
    const W = padL + wCore + padR;
    const H = h;

    let min = Math.min(...data);
    let max = Math.max(...data);
    if (min === max) { min -= 0.01; max += 0.01; }
    const span = max - min;
    const yOf = (v: number) => padT + (H - padT - padB) * (1 - (v - min) / span);
    const step = (n > 1 ? wCore / (n - 1) : wCore);

    const pts = data.map((v, i) => `${padL + i * step},${yOf(v)}`).join(' ');
    const yTicks = Array.from({ length: 6 }, (_, i) => min + (span * i) / 5);
    const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;

    const [hover, setHover] = React.useState<{ i: number; x: number; y: number } | null>(null);
    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget as SVGSVGElement;
        const box = svg.getBoundingClientRect();

        // 실제 화면 좌표를 SVG viewBox 좌표로 변환
        const mouseX = e.clientX - box.left;
        const scaleX = W / box.width;  // viewBox 너비 / 실제 렌더링 너비
        const svgX = mouseX * scaleX;

        // SVG 좌표계에서 데이터 인덱스 계산
        const rel = Math.max(padL, Math.min(W - padR, svgX)) - padL;
        const i = Math.round(rel / step);
        const idx = Math.max(0, Math.min(n - 1, i));
        setHover({ i: idx, x: padL + idx * step, y: yOf(data[idx]) });
    };

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            style={{ display: 'block' }}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
        >
            {/* 배경 히트 영역 (마우스 이벤트 보장) */}
            <rect x={0} y={0} width={W} height={H} fill="transparent" />

            {/* y 그리드 */}
            {yTicks.map((yv, idx) => {
                const y = yOf(yv);
                return (
                    <g key={`gy-${idx}`} style={{ pointerEvents: 'none' }}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,.08)" strokeWidth={1} />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="10" fill="rgba(200,210,235,.6)">
                            {fmtPct(yv)}
                        </text>
                    </g>
                );
            })}

            {/* 세로 그리드 + x 라벨 */}
            {data.map((_, i) => {
                const x = padL + i * step;
                return (
                    <g key={`vx-${i}`} style={{ pointerEvents: 'none' }}>
                        <line x1={x} y1={padT} x2={x} y2={H - padB} stroke="rgba(255,255,255,.04)" strokeWidth={1} />
                    </g>
                );
            })}
            {(() => {
                const maxTicks = Math.min(10, n);
                const skip = Math.max(1, Math.ceil(n / maxTicks));
                return labels.map((lb, i) => {
                    if (i % skip !== 0 && i !== n - 1) return null;
                    const x = padL + i * step;
                    return (
                        <text
                            key={`xl-${i}`}
                            x={x}
                            y={H - 8}
                            fontSize="10"
                            fill="rgba(200,210,235,.6)"
                            textAnchor="middle"
                            transform={`rotate(-28 ${x},${H - 8})`}
                            style={{ pointerEvents: 'none' }}
                        >
                            {lb}
                        </text>
                    );
                });
            })()}

            {/* 데이터 라인 */}
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                points={pts}
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: 'none' }}
            />

            {/* 포커스 / 툴팁 */}
            {hover && (
                <g style={{ pointerEvents: 'none' }}>
                    <line x1={hover.x} y1={padT} x2={hover.x} y2={H - padB} stroke="rgba(255,255,255,.15)" strokeWidth={1} />
                    <circle cx={hover.x} cy={hover.y} r={3.5} fill={stroke} />
                    {(() => {
                        const i = hover.i;
                        const tip = `${labels[i] ?? ''}  ${fmtPct(data[i])}`;
                        const tx = Math.min(hover.x + 10, W - padR - 4);
                        const ty = Math.max(padT + 12, hover.y - 12);
                        const w = Math.max(48, tip.length * 6.2);
                        return (
                            <g transform={`translate(${tx},${ty})`}>
                                <rect x={-2} y={-12} rx={4} ry={4} width={w} height={18} fill="rgba(0,0,0,.55)" stroke="rgba(255,255,255,.12)" />
                                <text x={2} y={2} fontSize="11" fill="#cfe4ff">{tip}</text>
                            </g>
                        );
                    })()}
                </g>
            )}
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

    const changeOf = (r: PatchChampImpactRow) =>
        (r.dWinRate ?? 0) + (r.dPickRate ?? 0) + (r.dBanRate ?? 0);

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
      return full.sort((a, b) => changeOf(b) - changeOf(a));
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
                    `/api/internal/reports/champion-trend?championId=${sel}&queue=${queue}&upto=${encodeURIComponent(patch)}&n=${TREND_POINTS}`,
                    { cache: 'no-store' }
                );
                const data: TrendPt[] = await res.json();
                console.log('trend', data);
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

    const prevPatchLabel = trend && trend.length > 1 ? trend[trend.length - 2].patch : 'prev';

    const dW = current?.dWinRate ?? 0;
    const dP = current?.dPickRate ?? 0;
    const dB = current?.dBanRate ?? 0;

    const prevW = (current?.winRate ?? 0) - dW;
    const prevP = (current?.pickRate ?? 0) - dP;
    const prevB = (current?.banRate ?? 0) - dB;

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
                    {filtered.map(r => {
                        const signedDelta = (r.dWinRate ?? 0) + (r.dPickRate ?? 0) + (r.dBanRate ?? 0);
                        const up = signedDelta >= 0;
                        const arrow = up ? '▲' : '▼';
                        return (
                            <li key={r.championId}>
                                <button
                                    type="button"
                                    className={`rowBtn ${sel===r.championId ? 'is-active' : ''}`}
                                    onClick={()=>setSel(r.championId)}
                                >
                                    <span className="title">{champName(r.championId)}</span>
                                    <span className={`delta ${up ? 'up' : 'down'}`}>
          {arrow} {Math.abs(signedDelta * 100).toFixed(2)}%
        </span>
                                </button>
                            </li>
                        );
                    })}
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
                                    {' '}
                                    <small className={dW >= 0 ? 'up' : 'down'}>({delta(dW)})</small>
                                    {' '}
                                    <small style={{ opacity: .7 }}>{prevPatchLabel} {pct(prevW)}</small>
                                </div>

                                <div><Trans ko="픽률" en="Pick%"/></div>
                                <div>
                                    <strong>{pct(current.pickRate)}</strong>
                                    {' '}
                                    <small className={dP >= 0 ? 'up' : 'down'}>({delta(dP)})</small>
                                    {' '}
                                    <small style={{ opacity: .7 }}>{prevPatchLabel} {pct(prevP)}</small>
                                </div>

                                <div><Trans ko="밴률" en="Ban%"/></div>
                                <div>
                                    <strong>{pct(current.banRate)}</strong>
                                    {' '}
                                    <small className={dB >= 0 ? 'up' : 'down'}>({delta(dB)})</small>
                                    {' '}
                                    <small style={{ opacity: .7 }}>{prevPatchLabel} {pct(prevB)}</small>
                                </div>
                            </div>
                        </div>

                        <div className="chartWrap">
                            <div className="statTitle"><Trans ko="최근 추이 (패치별)" en="Recent trend (by patch)"/></div>
                            {loading && <div className="empty"><Trans ko="그래프 데이터를 불러오는 중…" en="Loading trend…"/></div>}
                            {!loading && trend && trend.length>0 && (
                                <>
                                    <div className="statTitle"><Trans ko="승률" en="Win rate"/></div>
                                    <Sparkline
                                        data={trend.map(t=>t.winRate)}
                                        labels={trend.map(t=>t.patch)}
                                        stroke="#7dd3fc"
                                    />
                                    <div className="statTitle" style={{marginTop:8}}><Trans ko="픽률" en="Pick rate"/></div>
                                    <Sparkline
                                        data={trend.map(t=>t.pickRate)}
                                        labels={trend.map(t=>t.patch)}
                                        stroke="#a78bfa"
                                    />
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